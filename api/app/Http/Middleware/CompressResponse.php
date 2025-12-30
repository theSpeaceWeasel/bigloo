<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompressResponse
{
    /**
     * Handle an incoming request and compress the response.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only compress if client accepts gzip encoding
        if ($request->header('Accept-Encoding') && str_contains($request->header('Accept-Encoding'), 'gzip')) {
            $content = $response->getContent();
            
            // Only compress if content is larger than 1KB
            if (strlen($content) > 1024) {
                $compressed = gzencode($content, 6); // Compression level 6 (balanced)
                
                if ($compressed !== false) {
                    $response->setContent($compressed);
                    $response->headers->set('Content-Encoding', 'gzip');
                    $response->headers->set('Vary', 'Accept-Encoding');
                }
            }
        }

        return $response;
    }
}


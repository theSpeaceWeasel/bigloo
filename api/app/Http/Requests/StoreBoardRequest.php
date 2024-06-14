<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Ticket;

use Illuminate\Support\Facades\Log;

class StoreBoardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $ticket = $this->route('ticket');
        // Log the ticket ID for debugging
        // Log::info("Ticket ID from route:" . $ticket->user->id);
        // Log::info("Authenticated User ID: " . Auth::id());
        // Log::info("is equal " . $ticket->user->id == Auth::id());


        // Find the ticket by its ID
        if(Auth::user()->email_verified && $ticket->user->id == Auth::id()) {
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => "string|required|max:255",
        ];
    }
}
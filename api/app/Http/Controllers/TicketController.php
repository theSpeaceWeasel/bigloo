<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Resources\TicketResource;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
// use App\Http\Requests\UpdateTicketRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Http;
// use Yaza\LaravelGoogleDriveStorage\Gdrive;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

// use Cloudinary\Cloudinary;


// use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request, $username)
    {
        // Find the user by username - optimized with index
        $user = \App\Models\User::where('name', $username)->first(['id']);
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Ensure authorized
        if (Auth::id() != $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $search = $request->input('search');

        // Main Query with Left Join for Aggregated Counts
        $query = Ticket::query()
            ->join('users', 'tickets.user_id', '=', 'users.id')
            ->leftJoin(DB::raw('(
                SELECT 
                    b.ticket_id, 
                    COUNT(t.id) as total_tasks_count, 
                    COUNT(CASE WHEN t.completed = 1 THEN 1 END) as completed_tasks_count
                FROM boards b
                LEFT JOIN cards c ON b.id = c.board_id
                LEFT JOIN tasks t ON c.id = t.card_id
                GROUP BY b.ticket_id
            ) as task_stats'), 'tickets.id', '=', 'task_stats.ticket_id')
            ->select([
                'tickets.id', 'tickets.ticket_number', 'tickets.title', 'tickets.description', 
                'tickets.category', 'tickets.priority', 'tickets.logo', 'tickets.user_id',
                'users.email as user_email',
                DB::raw('COALESCE(task_stats.total_tasks_count, 0) as total_tasks_count'),
                DB::raw('COALESCE(task_stats.completed_tasks_count, 0) as completed_tasks_count')
            ])
            ->where('tickets.user_id', $user->id);

        if ($search) {
            $query->where(function($q) use ($search) {
                // Full-Text search for title (quasi-momentous)
                if (strlen($search) >= 3) {
                    $q->whereRaw("MATCH(tickets.title) AGAINST(? IN BOOLEAN MODE)", [$search . '*']);
                } else {
                    $q->where('tickets.title', 'like', '%' . $search . '%');
                }

                $q->orWhere('tickets.ticket_number', 'like', $search . '%')
                  ->orWhere('users.email', 'like', '%' . $search . '%');
            });
        }

        if ($request->input('sorting')) {
            $query->orderBy('tickets.priority', $request->input('sorting'));
        }

        // Return collection directly - Resource will handle mapping
        return TicketResource::collection($query->get());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {

        $validated = $request->validated();
        $validated['user_id'] = Auth::id();
        
        // Generate a unique random ticket number (8 digits)
        do {
            $ticketNumber = str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
        } while (Ticket::where('ticket_number', $ticketNumber)->exists());
        
        $validated['ticket_number'] = $ticketNumber;
        
        $gpath = null;

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');

            //storing in gdrive
            // $gpath = Gdrive::put('file', $file);

            //storing in cloudinary with url
            $uploadedFileUrl = Cloudinary::upload($file->getRealPath())->getSecurePath();

            //storing in disk on server
            // $path =  Storage::disk('public')->put('uploads', request()->file('logo'));

            $cleanedUrl = str_replace('\\', '', $uploadedFileUrl);
            $validated['logo'] = $cleanedUrl;
        }



        $ticket = Ticket::create($validated);
        // return response()->json(['path' => $gpath], '200');


    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ticket = Ticket::with('user:id,name,email')->find($id);
        
        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }
        
        // Ensure the authenticated user can only access their own tickets
        if (Auth::id() != $ticket->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return new TicketResource($ticket);
    }


    /**
     * Update the specified resource in storage.
     */
    // public function tasksCompleted($ticketId)
    // {
    //     // $ticket = Ticket::with('boards.cards.tasks')->find($ticketId);
    //     $completedTasksCount = DB::table('tickets')
    //     ->join('boards', 'tickets.id', '=', 'boards.ticket_id')
    //     ->join('cards', 'boards.id', '=', 'cards.board_id')
    //     ->join('tasks', 'cards.id', '=', 'tasks.card_id')
    //     ->where('tickets.id', $ticketId)
    //     ->where('tasks.completed', true)
    //     ->count();


    //     $tasksCount = DB::table('tickets')
    //     ->join('boards', 'tickets.id', '=', 'boards.ticket_id')
    //     ->join('cards', 'boards.id', '=', 'cards.board_id')
    //     ->join('tasks', 'cards.id', '=', 'tasks.card_id')
    //     ->where('tickets.id', $ticketId)
    //     ->count();

    //     $data = ['completed_tasks_count' => $completedTasksCount, 'total_tasks_count' => $tasksCount];
    //     return response()->json($data, 201);
    // }

    public function downloadBoardsTasks($id)
    {
        $tasks = DB::table('tasks')
            ->join('cards', 'tasks.card_id', '=', 'cards.id')
            ->join('boards', 'cards.board_id', '=', 'boards.id')
            ->join('tickets', 'boards.ticket_id', '=', 'tickets.id')
            ->where('tickets.id', $id)
            ->select('tasks.*', 'cards.title as card_title', 'cards.description as card_description')
            ->get();
        $data = ['tasks' => $tasks];
        $pdf = Pdf::loadView('achievements.boards-tasks', $data);
        return $pdf->download('invoice.pdf');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
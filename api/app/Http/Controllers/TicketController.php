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
    public function index(Request $request, $userId)
    {

        if ($request->input('search')) {

            $search = $request->input('search');
            return TicketResource::collection(Ticket::where('title', 'like', '%' . $request->search . '%')->where('user_id', $userId)->get());
        }

        if ($request->input('sorting')) {
            $sortDirection = $request->input('sorting');
            return TicketResource::collection(Ticket::orderBy('priority', $sortDirection)->where('user_id', $userId)->get());
        }

        return TicketResource::collection(Ticket::all()->where('user_id', $userId));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {

        $validated = $request->validated();
        $validated['user_id'] = Auth::id();
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
    public function show(Ticket $ticket)
    {
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
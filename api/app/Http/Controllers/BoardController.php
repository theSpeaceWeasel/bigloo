<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Ticket;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\BoardResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $ticketId)
    {
        $ticket = Ticket::find($ticketId);
        $user = $ticket->user;

        if($user->id == Auth::id()) {
            $boards = Board::with([
                'cards' => function ($query) {
                    $query->select('id', 'board_id', 'title', 'description', 'date'); // Select specific columns for cards
                },
                'cards.labels' => function ($query) {
                    $query->select('id', 'card_id', 'color', 'text'); // Select specific columns for cards
                },
                 'cards.tasks' => function ($query) {
                     $query->select('id', 'card_id', 'text', 'completed'); // Select specific columns for cards
                 }
                 ])->select('id', 'title', 'ticket_id')->where('ticket_id', $ticketId)->get();
            return BoardResource::collection($boards);
        }
        return response()->json(['message' => 'You are not authorized to view this resource.'], 403);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBoardRequest $request, Ticket $ticket)
    {
        $validated = $request->validated();
        // $ticketId = $request->ticket_id;
        // $ticket = Ticket::find($ticketId);
        if (!$ticket) {
            return response()->json([
                "message" => "Ticket not found",
            ])->setStatusCode(404);
        }

        $board = $ticket->boards()->create($validated);

    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBoardRequest $request, Board $board)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $board = Board::findOrFail($id);

        // return $board;
        if($board->ticket->user->id == Auth::id()) {
            $board->delete();

            return response()->json(['message' => 'Board deleted successfully'], 200);
        } else {
            return response()->json(['message' => "This action is unauthorized."]);
        }

    }
}

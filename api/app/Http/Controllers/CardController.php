<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCardRequest;
use App\Http\Requests\UpdateCardRequest;
use Illuminate\Http\Request;
use App\Http\Resources\CardResource;
use App\Models\Label;
use App\Models\Task;

class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cards = Card::with(['board', 'labels', 'tasks'])->get();
        return CardResource::collection($cards);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCardRequest $request)
    {
        $validated = $request->validated();

        Card::create($validated);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateTitle(UpdateCardRequest $request, $id)
    {
        // return $id;
        // Validate the request data
        $validated = $request->validated();

        // Find the card by ID
        $card = Card::findOrFail($id);

        // Update the card with the validated data
        $card->update($validated);

        // Return a response indicating success
        return response()->json(['message' => 'Card updated successfully']);
    }


    public function updateDescription(Request $request, $id)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'description' => 'required|string|max:255',
            // Add validation rules for other fields if needed
        ]);

        // Find the card by ID
        $card = Card::findOrFail($id);

        // Update the card with the validated data
        $card->update($validatedData);

        // Return a response indicating success
        return response()->json(['message' => 'Card updated successfully']);
    }

    public function addLabelToCard(Request $request, $cardId)
    {

        $card = Card::findOrFail($cardId);

        // Validate request data
        $request->validate([
            'color' => 'required|string', // Assuming color is required for the label
            'text' => 'required|string',
        ]);

        // Create the new label
        $label = Label::create([
            'color' => $request->input('color'),
            'text' => $request->input('text'),
            // Add other fields as needed
        ]);

        // Attach the new label to the card
        $card->labels()->save($label);

        return response()->json(['message' => 'Label added to card successfully']);
    }

    public function addTaskToCard(Request $request, $cardId)
    {

        $card = Card::findOrFail($cardId);

        // Validate request data
        $request->validate([
            'completed' => 'required|boolean',
            'text' => 'required|string',
        ]);

        // Create the new label
        $task = Task::create([
            'completed' => $request->input('completed') ? 1 : 0,
            'text' => $request->input('text'),
            // Add other fields as needed
        ]);

        // Attach the new label to the card
        $card->tasks()->save($task);

        return response()->json(['message' => 'Task added to card successfully']);
    }


    public function updateCardTask(Request $request, $id)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'completed' => 'required|boolean',
            // Add validation rules for other fields if needed
        ]);

        // Find the card by ID
        $task = Task::findOrFail($id);

        // Update the card with the validated data
        $task->update($validatedData);

        // Return a response indicating success
        return response()->json(['message' => 'Card task updated successfully']);
    }

    public function updateDueDateForCard(Request $request, $cardId)
    {
        // Validate request data
        $request->validate([
            'date' => 'required|date', // Validate due_date as a date
        ]);

        // Find the card by ID
        $card = Card::findOrFail($cardId);

        // Update the due_date
        $card->update([
            'date' => $request->input('date'),
        ]);

        // Return a response
        return response()->json(['message' => 'Due date updated successfully']);
    }

    public function deleteLabelFromCard($id)
    {
        $label = Label::findOrFail($id);

        // Delete the label
        $label->delete();

        return response()->json(['message' => 'Label deleted successfully']);
    }

    public function deleteTaskFromCard($id)
    {
        $task = Task::findOrFail($id);

        // Delete the label
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $card = Card::findOrFail($id);

        // return $board;

        $card->delete();

        return response()->json(['message' => 'Card deleted successfully'], 200);
    }
}

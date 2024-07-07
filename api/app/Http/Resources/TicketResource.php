<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $ticketId = $this->id;

        // Perform the necessary database queries to get the counts
        // $completedTasksCount = DB::table('tickets')
        //     ->join('boards', 'tickets.id', '=', 'boards.ticket_id')
        //     ->join('cards', 'boards.id', '=', 'cards.board_id')
        //     ->join('tasks', 'cards.id', '=', 'tasks.card_id')
        //     ->where('tickets.id', $ticketId)
        //     ->where('tasks.completed', true)
        //     ->count();

        // $tasksCount = DB::table('tickets')
        //     ->join('boards', 'tickets.id', '=', 'boards.ticket_id')
        //     ->join('cards', 'boards.id', '=', 'cards.board_id')
        //     ->join('tasks', 'cards.id', '=', 'tasks.card_id')
        //     ->where('tickets.id', $ticketId)
        //     ->count();

        $tasksCounts = DB::table('tickets')
            ->join('boards', 'tickets.id', '=', 'boards.ticket_id')
            ->join('cards', 'boards.id', '=', 'cards.board_id')
            ->join('tasks', 'cards.id', '=', 'tasks.card_id')
            ->where('tickets.id', $ticketId)
            ->selectRaw('COUNT(tasks.id) as total_tasks, COUNT(CASE WHEN tasks.completed = 1 THEN 1 END) as completed_tasks')
            ->first();

        $completedTasks = $tasksCounts->completed_tasks ?? 0;
        $totalTasks = $tasksCounts->total_tasks ?? 0;
        $completionRatio = "";

        if ($totalTasks > 0) {
            $completionRatio = ($completedTasks / $totalTasks) * 100;
        } else {
            $completionRatio = 0;
        }

        // $completionRatio = ($tasksCounts->completed_tasks / $tasksCounts->total_tasks) * 100 ?? 0 ;

        return [
           'id' => $this->id,
           'title' => $this->title,
           'description' => $this->description,
           'category' => $this->category,
           'priority' => $this->priority,
           'logo' => $this->logo ,
           'tasks_done_completed' => $completionRatio
        ];
    }
}

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
        $completedTasks = $this->completed_tasks_count ?? 0;
        $totalTasks = $this->total_tasks_count ?? 0;
        $completionRatio = 0;

        if ($totalTasks > 0) {
            $completionRatio = ($completedTasks / $totalTasks) * 100;
        }

        return [
           'id' => $this->id,
           'ticket_number' => $this->ticket_number,
           'title' => $this->title,
           'description' => $this->description,
           'category' => $this->category,
           'priority' => $this->priority,
           'logo' => $this->logo ,
           'tasks_done_completed' => $completionRatio,
           'user_email' => $this->user_email ?? null
        ];
    }
}

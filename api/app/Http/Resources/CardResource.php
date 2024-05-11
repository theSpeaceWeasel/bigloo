<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\BoardResource;
use App\Http\Resources\LabelResource;
use App\Http\Resources\TaskResource;

class CardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => $this->date,
            'description'  => $this->description,
            'board' => new BoardResource($this->whenLoaded('board')),
            'labels' => LabelResource::collection($this->whenLoaded('labels')),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks'))

        ];
    }
}
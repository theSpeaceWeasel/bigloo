<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Card;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['completed', 'text'];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }
}

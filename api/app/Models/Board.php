<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Card;
use App\Models\Ticket;

class Board extends Model
{
    use HasFactory;


    protected $fillable = ['title', 'ticket_id'];

    public function cards()
    {
        return $this->hasMany(Card::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Board;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = ['logo','user_id','title', 'description', 'category', 'priority'];

    public function boards()
    {
        return $this->hasMany(Board::class);
    }
}

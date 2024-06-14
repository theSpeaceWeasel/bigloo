<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Board;
use App\Models\User;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = ['logo','user_id','title', 'description', 'category', 'priority'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function boards()
    {
        return $this->hasMany(Board::class);
    }
}

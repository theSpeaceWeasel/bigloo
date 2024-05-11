<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Board;
use App\Models\Label;
use App\Models\Task;

class Card extends Model
{
    use HasFactory;
    protected $fillable = [
        'board_id',
        'title',
        'description',
        'date'
    ];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function labels()
    {
        return $this->hasMany(Label::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    // このカードが所属するスレッドを取得
}

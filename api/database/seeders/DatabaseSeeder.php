<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(5)->create();
        \App\Models\Ticket::factory(20)->create();
        \App\Models\Board::factory(5)->create();
        \App\Models\Card::factory(5)->create();
        \App\Models\Label::factory(5)->create();
        \App\Models\Task::factory(5)->create();
    }
}

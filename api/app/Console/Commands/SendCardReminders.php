<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Card;
use Illuminate\Support\Facades\Mail;
use App\Mail\CardReminderMail;

class SendCardReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cards:remind';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for cards that are 3 days away';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $cards = Card::whereDate('date', now()->subDays(3))->get();

        foreach ($cards as $card) {
            $user = $card->board->ticket->user;
            Mail::to($user->email)->send(new CardReminderMail($card));
        }
    }

}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    // Route::post('/tickets', [TicketController::class,'store']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/tickets/{ticketId}', [TicketController::class, 'index']);
    Route::get('/ticket/{ticketId}/tasks-completed', [TicketController::class, 'tasksCompleted']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/download-boards-tasks/{id}', [TicketController::class, 'downloadBoardsTasks']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);

    Route::get('/boards/{ticketId}', [BoardController::class, 'index']);
    Route::post('/boards', [BoardController::class, 'store']);
    Route::delete('/boards/{id}', [BoardController::class, 'destroy']);

    //cards

    Route::get('/cards', [CardController::class, 'index']);
    Route::post('/cards', [CardController::class, 'store']);
    Route::post('/cards/{cardId}/labels', [CardController::class, 'addLabelToCard']);
    Route::post('/cards/{cardId}/tasks', [CardController::class, 'addTaskToCard']);
    Route::post('/cards/{cardId}/duedate', [CardController::class, 'updateDueDateForCard']);

    Route::delete('/cards/{id}', [CardController::class, 'destroy']);
    Route::delete('/labels/{id}', [CardController::class, 'deleteLabelFromCard']);
    Route::delete('/tasks/{id}', [CardController::class, 'deleteTaskFromCard']);

    Route::put('/cards/title/{id}', [CardController::class, 'updateTitle']);
    Route::put('/cards/description/{id}', [CardController::class, 'updateDescription']);
    Route::put('/tasks/{id}', [CardController::class, 'updateCardTask']);



});

// Route::get('/cards', [CardsController::class, 'index']);





//ROUTE GROUP TO GET TICKETS AND CREATE A NEW TICKET GOES HERE

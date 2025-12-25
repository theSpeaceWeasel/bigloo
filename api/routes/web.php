<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Test;
use App\Http\Controllers\TicketController;
// use Illuminate\Http\Request;
use App\Mail\MyTestEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';


//TEST STUFF

// Route::get('/testuser', [Test::class, 'create']);

// //testmail
// Route::get('/mail', function () {
//     $name = "Funny Coder";

//     // The email sending is done using the to method on the Mail facade
//     Mail::to('thespeaceweasel@gmail.com')->send(new MyTestEmail($name));
// });

// Route::get('/users', function () {
//     return User::all();
// });

// Route::middleware(['auth'])->group(function () {
//     Route::post('/tickets', [TicketController::class,'store'])->middleware('web');
// });

// Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
//     $request->fulfill();

//     return redirect('/home');
// })->middleware(['auth', 'signed'])->name('verification.verify');

Route::get('/tickets/download-boards-tasks', [TicketController::class, 'downloadBoardsTasks']);

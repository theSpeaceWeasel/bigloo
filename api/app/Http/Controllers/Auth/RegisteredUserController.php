<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Jobs\RegisteredEmailJob;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
// use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified' => 0
        ]);

        // event(new Registered($user));
        $token = $user->createToken('authToken')->plainTextToken;
        $user->email_verification_token = $token;
        $user->save();




        Auth::login($user);
        RegisteredEmailJob::dispatch($user, $token);
        info("dispatch here");




        return response()->json([
            'status' => 'success',
            'message' => 'User Registered Successfully Verify Your Email Address',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
            ]
        ]);
    }
}

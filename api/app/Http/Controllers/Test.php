<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class Test extends Controller
{
    public function create(){
        return User::create([
            'name'=>'ali',
            'email'=>'ali@baba.com',
            'password'=>'ali@baba.com'
        ]);
    }
}

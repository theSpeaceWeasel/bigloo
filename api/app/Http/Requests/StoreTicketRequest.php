<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\Base64Image;
use Illuminate\Support\Facades\Auth;

class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if(Auth::user()->email_verified) {
            return true;
        }
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'title' => 'required|string',
            'description' => 'required|string|min:8|max:32',
            'category' => Rule::in(["Q1","Q2", "Q3", "Q4"]),
            'priority' => 'required|integer|digits_between:1,5',
            'logo' => [
            'required',
            'image'
            // 'string',
            //  new Base64Image()
            ],
        ];
    }
}

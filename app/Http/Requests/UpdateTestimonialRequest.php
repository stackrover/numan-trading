<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'author_name' => 'string|max:255',
            'author_position' => 'nullable|string|max:255',
            'content' => 'string',
            'author_image' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}

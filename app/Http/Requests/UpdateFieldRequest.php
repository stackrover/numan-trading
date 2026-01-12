<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFieldRequest extends FormRequest
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
            'block_id' => 'sometimes|required|exists:blocks,id',
            'label' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|required|string|max:255|alpha_dash',
            'type' => 'sometimes|required|string|in:text,number,select,checkbox,radio,textarea,date,upload,boolean,richtext,relation',
            'order' => 'nullable|integer',
            'options' => 'nullable|array',
            'options.*' => 'string|max:255',
            'validation' => 'nullable|array',
            'default_value' => 'nullable|string|max:1000',
            'is_required' => 'boolean',
            'has_many' => 'boolean',
            'relation_model' => 'nullable|string|max:255',
            'placeholder' => 'nullable|string|max:255',
            'help_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'layout' => 'nullable|string|max:255',
        ];
    }
}

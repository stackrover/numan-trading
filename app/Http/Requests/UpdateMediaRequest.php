<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMediaRequest extends FormRequest
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
      'original_name' => 'sometimes|required|string|max:255',
      'filename' => 'sometimes|required|string|max:255',
      'mime_type' => 'sometimes|required|string|max:100',
      'extension' => 'sometimes|required|string|max:10',
      'size' => 'sometimes|required|integer',
      'width' => 'nullable|integer',
      'height' => 'nullable|integer',
      'placeholder' => 'nullable|string',
      'path' => 'sometimes|required|string|max:255',
    ];
  }
}

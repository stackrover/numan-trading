<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return $this->user() !== null;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'file' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:102400', // 100MB = 102400 KB
    ];
  }

  public function messages(): array
  {
    return [
      'file.required' => 'Please select a file to upload.',
      'file.file' => 'The uploaded file is invalid.',
      'file.mimes' => 'Only image files are supported. Allowed formats: JPEG, JPG, PNG, GIF, WEBP.',
      'file.max' => 'The file size must not exceed 100MB.',
    ];
  }
  protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
  {
    \Illuminate\Support\Facades\Log::error('Media Upload Validation Failed', [
      'errors' => $validator->errors()->toArray(),
      'request' => $this->all(),
      'files' => $this->allFiles(),
    ]);
    parent::failedValidation($validator);
  }
}

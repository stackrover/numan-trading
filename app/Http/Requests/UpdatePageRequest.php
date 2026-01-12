<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
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
      "title" => "nullable|string|max:255",
      "slug" => "nullable|string|max:255|unique:pages,slug," . $this->page->id,
      'published_at' => 'nullable|date',
      'icon' => 'nullable|string|max:255',
    ];
  }
}

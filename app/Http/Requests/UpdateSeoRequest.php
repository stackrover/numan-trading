<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeoRequest extends FormRequest
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
      'title' => 'sometimes|required|string|max:255',
      'description' => 'nullable|string',
      'keywords' => 'nullable',
      'og_title' => 'nullable|string|max:255',
      'og_description' => 'nullable|string',
      'og_image' => 'nullable|string',
      'og_type' => 'nullable|string|max:50',
      'twitter_card' => 'nullable|string|max:50',
      'twitter_title' => 'nullable|string|max:255',
      'twitter_description' => 'nullable|string',
      'twitter_image' => 'nullable|string',
      'canonical_url' => 'nullable|string',
      'robots' => 'nullable|string|max:100',
    ];
  }
}

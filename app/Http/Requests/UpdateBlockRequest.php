<?php

namespace App\Http\Requests;

use App\Models\Block;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlockRequest extends FormRequest
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
    $slug = $this->route('slug');
    $block = Block::where('slug', $slug)
      ->orWhere('id', $slug)
      ->first();


    return [
      "title" => "nullable|string|max:255",
      "slug" => [
        "nullable",
        "string",
        "max:255",
        Rule::unique('blocks', 'slug')->ignore($block ? $block->id : null),
      ],
      "icon" => "nullable|string|max:255",
      "page_id" => "nullable|exists:pages,id",
    ];
  }
}

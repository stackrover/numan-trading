<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QueryPageRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'search' => ['nullable', 'string', 'max:255'],
      'page' => ['nullable', 'integer', 'min:1'],
      'size' => ['nullable', 'integer', 'min:1', 'max:100'],
      'sort_by' => ['nullable', 'in:title,slug,created_at'],
      'sort_dir' => ['nullable', 'in:asc,desc'],
    ];
  }

  /**
   * Optional: defaults for missing params
   */
  protected function prepareForValidation(): void
  {
    $this->merge([
      'size' => $this->size ?? 15,
      'sort_dir' => $this->sort_dir ?? 'desc',
    ]);
  }
}

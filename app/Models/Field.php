<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Field extends Model
{
    /** @use HasFactory<\Database\Factories\FieldFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'block_id',
        'label',
        'name',
        'type',
        'order',
        'options',
        'validation',
        'default_value',
        'is_required',
        'has_many',
    ];

    protected $hidden = [];
    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'has_many' => 'boolean',
        'validation' => 'object',
    ];

    /* Relations  */
    public function block()
    {
        return $this->belongsTo(Block::class);
    }
}

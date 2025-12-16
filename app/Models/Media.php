<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'original_name',
        'filename',
        'mime_type',
        'extension',
        'size',
        'width',
        'height',
        'placeholder',
        'path',
    ];

    protected $hidden = ["path"];

    protected $casts = [
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];
}

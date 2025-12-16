<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug',
        'page_slug',
        'data',
    ];

    protected $casts = [
        'data' => 'object',
    ];

    protected $hidden = [];

    /* Relations  */
    public function page()
    {
        return $this->belongsTo(Page::class, 'page_slug', 'slug');
    }
}

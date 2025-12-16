<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'published_at',
    ];


    protected $hidden = [];

    /* Relations  */

    public function blocks(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function documents(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function seo(): BelongsTo
    {
        return $this->belongsTo(Seo::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'published_at',
        'icon',
    ];


    protected $hidden = [];

    /* Relations  */

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class)->oldest();
    }

    public function document(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Document::class);
    }

    public function seo(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Seo::class);
    }

    public function views(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(PageView::class, 'viewable');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'thumbnail',
        'short_description',
        'description',
        'origin',
        'origin_details',
        'brand',
        'brand_details',
        'category_id',
        'physical_form',
        'stability',
        'storage_conditions',
        'solubility',
        'specific_gravity',
        'flash_point',
        'arsenic_content',
        'heavy_metals',
        'usage_rate',
        'usages',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'usages' => 'array',
        'status' => 'string',
        'is_featured' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function views(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(PageView::class, 'viewable');
    }
}

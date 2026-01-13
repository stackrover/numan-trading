<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = ['image_id', 'image_category_id', 'is_active', 'is_featured'];

    public function category()
    {
        return $this->belongsTo(ImageCategory::class, 'image_category_id');
    }

    public function media()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }
}

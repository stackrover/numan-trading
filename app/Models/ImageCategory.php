<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageCategory extends Model
{
    protected $fillable = ['title', 'slug'];

    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }
}

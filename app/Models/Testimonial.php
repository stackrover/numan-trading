<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $table = "testimonials";

    protected $fillable = [
        "author_name",
        "author_position",
        "content",
        "author_image",
        "rating",
        "is_featured",
        "is_active",
    ];
}


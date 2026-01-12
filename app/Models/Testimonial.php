<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $table = "testimonials";

    protected $fillable = [
        "name",
        "company",
        "review",
        "image",
        "rating",
        "is_featured",
        "is_active",
    ];
}

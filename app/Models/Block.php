<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'icon',
        'page_id',
    ];

    protected $hidden = [];

    /* Relations  */
    public function fields()
    {
        return $this->hasMany(Field::class);
    }
}

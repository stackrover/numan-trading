<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    protected $fillable = [
        'viewable_id',
        'viewable_type',
        'ip_address',
        'user_agent',
        'viewed_at',
    ];

    public function viewable()
    {
        return $this->morphTo();
    }
}

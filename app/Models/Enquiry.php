<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $fillable = [
        'name',
        'company',
        'product_id',
        'email',
        'subject',
        'message',
        'status',
        'replied_at',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

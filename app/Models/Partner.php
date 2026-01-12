<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    /** @use HasFactory<\Database\Factories\PartnerFactory> */
    protected $fillable = [
        'name',
        'logo',
        'location',
        'established_at',
    ];
}

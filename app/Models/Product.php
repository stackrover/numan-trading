<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'category_id',
        'brand_id',
        'price',
        'discount_price',
        'status',
        'unit',
        'color_name',
        'color_code',
        'color_index',
        'shade',
        'appearance',
        'food_grade',
        'fssai_compliant',
        'fssai_number',
        'fssai_expiry_date',
        'fda_approved',
        'halal_certified',
        'kosher_certified',
        'e_number',
        'allergen_info',
        'gmo_status',
        'solubility',
        'heat_stability',
        'ph_stability_range',
        'light_stability',
        'dosage_recommendation',
        'net_weight',
        'net_volume',
        'weight_unit',
        'volume_unit',
    ];

    public function views(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(PageView::class, 'viewable');
    }
}

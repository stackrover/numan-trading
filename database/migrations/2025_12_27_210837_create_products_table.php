<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description', 255);
            $table->text('description');
            $table->integer('category_id')->nullable();
            $table->integer('brand_id')->nullable();
            $table->integer('price')->default(0);
            $table->integer('discount_price')->nullable();
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->enum('unit', ['piece', 'kg', 'g', 'ml', 'l'])->default('piece');
            $table->string('color_name')->nullable();
            $table->string('color_code')->nullable();
            $table->string('color_index')->nullable();
            $table->enum('shade', ['light', 'dark', 'medium'])->default('medium');
            $table->enum('appearance', ['powder', 'paste', 'liquid', 'solid'])->default('solid');

            $table->boolean('food_grade')->nullable()->default(false);
            $table->boolean('fssai_compliant')->nullable()->default(false);
            $table->string('fssai_number')->nullable();
            $table->string('fssai_expiry_date')->nullable();
            $table->boolean('fda_approved')->nullable()->default(false);
            $table->boolean('halal_certified')->nullable()->default(false);
            $table->boolean('kosher_certified')->nullable()->default(false);
            $table->string('e_number')->nullable();
            $table->text('allergen_info')->nullable();
            $table->enum('gmo_status', ['gmo', 'non-gmo'])->default('non-gmo');
            $table->enum("solubility", ['water', 'oil', 'gas', 'solid', 'liquid', 'powder'])->default('solid');
            $table->string('heat_stability')->nullable();
            $table->string('ph_stability_range')->nullable();
            $table->boolean('light_stability')->nullable()->default(false);
            $table->string("dosage_recommendation")->nullable();

            $table->string('net_weight')->nullable();
            $table->string('net_volume')->nullable();
            $table->enum('weight_unit', ['g', 'kg'])->default('g');
            $table->enum('volume_unit', ['ml', 'l'])->default('ml');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

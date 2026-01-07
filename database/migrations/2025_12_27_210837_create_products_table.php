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
            $table->string('thumbnail')->nullable();

            $table->text('short_description')->nullable();
            $table->longText('description')->nullable(); // For general rich text content

            $table->string('origin')->nullable();
            $table->text('origin_details')->nullable();

            $table->string('brand')->nullable();
            $table->text('brand_details')->nullable();

            $table->unsignedBigInteger('category_id')->nullable()->index(); // Foreign key to categories

            // Technical Specs
            $table->string('physical_form')->nullable(); // e.g. Concentrated Emulsion
            $table->string('stability')->nullable();
            $table->string('storage_conditions')->nullable(); // e.g. 24month life

            $table->string('solubility')->nullable(); // text or string
            $table->string('specific_gravity')->nullable();
            $table->string('flash_point')->nullable();
            $table->string('arsenic_content')->nullable();
            $table->string('heavy_metals')->nullable();

            $table->string('usage_rate')->nullable(); // "use rule" e.g. 0.1% - 0.4% w/w

            $table->json('usages')->nullable(); // { title: "", rate: "" }[]

            $table->enum('status', ['published', 'draft'])->default('draft');
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

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fields', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('name')->index();
            $table->enum('type', [
                "text",
                "date",
                "boolean",
                "textarea",
                "select",
                "radio",
                "checkbox",
                "upload",
                "richtext",
                "relation",
            ])->default('text');
            $table->integer('order')->default(0);
            $table->jsonb('options')->nullable();
            $table->jsonb('validation')->nullable();
            $table->text('default_value')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('has_many')->default(false);
            $table->text('relation_model')->nullable();
            $table->text('placeholder')->nullable();
            $table->text('help_text')->nullable();
            $table->text('description')->nullable();
            $table->string('layout')->default('12');

            $table->unsignedBigInteger('block_id')->index();
            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade')->onUpdate('cascade');

            $table->softDeletes();
            $table->timestamps();

            $table->unique(['block_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};

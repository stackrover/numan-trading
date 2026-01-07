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
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->index();
            $table->string('icon')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unsignedBigInteger('page_id')->index();
            $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade')->onUpdate('cascade');

            $table->unique(['slug', 'page_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};

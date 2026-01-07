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
        Schema::table('enquiries', function (Blueprint $table) {
            $table->string('company')->nullable()->after('name');
            $table->foreignId('product_id')->nullable()->after('company')->constrained()->nullOnDelete();
            $table->string('subject')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn(['company', 'product_id']);
            $table->string('subject')->nullable(false)->change();
        });
    }
};

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
        Schema::table('entries', function (Blueprint $table) {
            $table->uuid('user_posting_id')->nullable();
            $table->foreign("user_posting_id")->references("user_id")->on("users")->onDelete("set null");
            $table->dateTime('edited_at')->nullable();
            $table->dateTime('posting_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entries', function (Blueprint $table) {
            //
        });
    }
};

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
        Schema::create('closings', function (Blueprint $table) {
            $table->id();
            $table->uuid('location_id');
            $table->foreign("location_id")->references("id")->on("locations")->onDelete("cascade");
            $table->unsignedTinyInteger('month'); // 1–12
            $table->unsignedSmallInteger('year'); // misalnya 2025
            $table->uuid('user_id')->nullable();
            $table->foreign("user_id")->references("user_id")->on("users")->onDelete("set null");
            $table->string('action');
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('closings');
    }
};

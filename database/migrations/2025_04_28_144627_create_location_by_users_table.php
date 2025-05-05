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
        Schema::create('location_by_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid("location_id")->nullable();
            $table->foreign("location_id")->references("id")->on("locations")->onDelete("set null");
            $table->uuid("user_id")->nullable();
            $table->foreign("user_id")->references("user_id")->on("users")->onDelete("set null");
            $table->boolean("isSelected")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('location_by_users');
    }
};

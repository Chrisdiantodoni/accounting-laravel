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
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->string('document_number');
            $table->date('entries_date');
            $table->uuid('location_id');
            $table->foreign("location_id")->references("id")->on("locations")->onDelete("cascade");
            $table->uuid('user_edit_id')->nullable();
            $table->foreign("user_edit_id")->references("user_id")->on("users")->onDelete("set null");
            $table->uuid('user_id')->nullable();
            $table->foreign("user_id")->references("user_id")->on("users")->onDelete("set null");
            $table->integer('debit');
            $table->integer('credit');
            $table->string('notes')->nullable();
            $table->enum('status', ['create', 'posting']);
            $table->boolean('is_closing')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};

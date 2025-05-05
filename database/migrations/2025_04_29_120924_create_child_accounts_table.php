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
        Schema::create('child_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('child_account_code')->unique();
            $table->string('child_account_name');
            $table->unsignedBigInteger('parent_account_id');
            $table->foreign("parent_account_id")->references("id")->on("parent_accounts")->onDelete("cascade");
            $table->uuid("location_id")->nullable();
            $table->foreign("location_id")->references("id")->on("locations")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_accounts');
    }
};

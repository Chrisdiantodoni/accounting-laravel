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
        Schema::create('ledgers', function (Blueprint $table) {
            $table->id();
            $table->string('ledger_code');
            $table->string('ledger_name');
            $table->integer('balance');
            $table->enum('type_start_balance', ['Debet', 'Kredit']);
            $table->unsignedBigInteger('child_account_id');
            $table->foreign("child_account_id")->references("id")->on("child_accounts")->onDelete("cascade");
            $table->foreignUuid('location_id')->nullable();
            $table->foreign("location_id")->references("id")->on("locations")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledgers');
    }
};

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
        Schema::create('entry_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('entries_id');
            $table->foreign("entries_id")->references("id")->on("entries")->onDelete("cascade");
            $table->date('entry_date');
            $table->unsignedBigInteger('ledger_id');
            $table->foreign("ledger_id")->references("id")->on("ledgers")->onDelete("cascade");
            $table->uuid('user_id')->nullable();
            $table->foreign("user_id")->references("user_id")->on("users")->onDelete("set null");
            $table->integer('debit');
            $table->integer('credit');
            $table->string('notes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entry_items');
    }
};

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
        Schema::create('revenue_ledgers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('revenue_id');
            $table->foreign("revenue_id")->references("id")->on("revenues")->onDelete("cascade");
            $table->unsignedBigInteger('ledger_id');
            $table->foreign("ledger_id")->references("id")->on("ledgers")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revenue_ledgers');
    }
};

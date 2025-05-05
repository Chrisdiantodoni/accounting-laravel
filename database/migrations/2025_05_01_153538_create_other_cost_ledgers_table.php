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
        Schema::create('other_cost_ledgers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('other_cost_id');
            $table->foreign("other_cost_id")->references("id")->on("other_costs")->onDelete("cascade");
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
        Schema::dropIfExists('other_cost_ledgers');
    }
};

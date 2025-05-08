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
        Schema::create('ledger_balances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ledger_id');
            $table->foreign('ledger_id')->references('id')->on('ledgers')->onDelete('cascade');
            $table->uuid('location_id'); // untuk melacak lokasi jika diperlukan
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');

            $table->integer('year');
            $table->integer('month');
            $table->bigInteger('opening_balance');  // Saldo awal bulan ini (ambil dari closing balance bulan lalu)
            $table->bigInteger('closing_balance');  // Saldo akhir bulan ini setelah transaksi
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledger_balances');
    }
};

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
        Schema::create('coa_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_code');
            $table->string('group_description');
            $table->enum('group_type', ['Neraca', 'Laba/Rugi']);
            $table->string('upper_account_code');
            $table->string('lower_account_code');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coa_groups');
    }
};

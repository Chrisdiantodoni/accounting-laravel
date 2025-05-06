<?php

namespace Database\Seeders;

use App\Models\Year;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class YearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = Carbon::now()->year;

        if (!Year::where('year', $currentYear)->exists()) {
            Year::create(['year' => $currentYear]);
        }
    }
}

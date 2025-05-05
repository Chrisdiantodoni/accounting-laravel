<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'location_name' => 'SPBU GARUDA SAKTI',
                'address' => 'Jl. Lintas Timur Km.15 - Kel. Kulim Kec. Tenayan Raya - Pekanbaru',
                'code' => '001'
            ],
            [
                'location_name' => 'SPBU KULIM',
                'address' => 'Jl. Garuda Sakti KM.2 - Pekanbaru',
                'code' => '002'

            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}

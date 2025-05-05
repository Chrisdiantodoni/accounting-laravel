<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Location;
use App\Models\LocationByUser;
use App\Models\Position;
use App\Models\User;
use Faker\Core\Uuid;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $user =  User::factory()->create([
            'user_id' => Str::uuid(),
            'name' => 'Test User',
            'username' => 'testing',
        ]);


        $this->call([
            LocationSeeder::class,
            CoaGroupSeeder::class,
            ParentAccountSeeder::class,
            LedgerSeeder::class,
        ]);

        $locations = Location::all();

        foreach ($locations as $key =>  $location) {
            LocationByUser::create([
                'location_id' => $location['id'],
                'user_id' => $user->user_id,
                'isSelected' => $key == 0 ? true : false
            ]);
        }
    }
}

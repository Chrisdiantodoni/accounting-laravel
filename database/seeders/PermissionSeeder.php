<?php

namespace Database\Seeders;

use App\Helpers\PermissionList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $permissions = PermissionList::AllPermission();
        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName['name'], 'guard_name' => 'web', 'alias_name' => $permissionName['alias_name'], 'group_name' => $permissionName['group_name']]);
        }
    }
}

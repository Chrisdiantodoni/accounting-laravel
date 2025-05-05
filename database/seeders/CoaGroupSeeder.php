<?php

namespace Database\Seeders;

use App\Models\CoaGroup;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CoaGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $coa_groups = [
            [
                'group_code' => '001',
                'group_description' => 'ASET LANCAR',
                'group_type' => 'Neraca',
                'upper_account_code' => '150',
                'lower_account_code' => '101',
            ],
            [
                'group_code' => '002',
                'group_description' => 'ASET TIDAK LANCAR',
                'group_type' => 'Neraca',
                'upper_account_code' => '250',
                'lower_account_code' => '201',
            ],
            [
                'group_code' => '003',
                'group_description' => 'LIABILITAS JANGKA PENDEK',
                'group_type' => 'Neraca',
                'upper_account_code' => '350',
                'lower_account_code' => '301',
            ],
            [
                'group_code' => '004',
                'group_description' => 'LIABILITAS JANGKA PANJANG',
                'group_type' => 'Neraca',
                'upper_account_code' => '450',
                'lower_account_code' => '401',
            ],
            [
                'group_code' => '005',
                'group_description' => 'EKUITAS',
                'group_type' => 'Neraca',
                'upper_account_code' => '550',
                'lower_account_code' => '501',
            ],
            [
                'group_code' => '006',
                'group_description' => 'PENJUALAN',
                'group_type' => 'Laba/Rugi',
                'upper_account_code' => '650',
                'lower_account_code' => '601',
            ],
            [
                'group_code' => '007',
                'group_description' => 'PEMBELIAN',
                'group_type' => 'Laba/Rugi',
                'upper_account_code' => '750',
                'lower_account_code' => '701',
            ],
            [
                'group_code' => '008',
                'group_description' => 'BIAYA UMUM DAN ADMINISTRASI',
                'group_type' => 'Laba/Rugi',
                'upper_account_code' => '850',
                'lower_account_code' => '801',
            ],
            [
                'group_code' => '009',
                'group_description' => 'BIAYA LAIN-LAIN',
                'group_type' => 'Laba/Rugi',
                'upper_account_code' => '950',
                'lower_account_code' => '901',
            ],
            [
                'group_code' => '010',
                'group_description' => 'PENDAPATAN LAIN-LAIN',
                'group_type' => 'Laba/Rugi',
                'upper_account_code' => '999',
                'lower_account_code' => '951',
            ],
        ];


        foreach ($coa_groups as $coa) {
            CoaGroup::create($coa);
        }
    }
}

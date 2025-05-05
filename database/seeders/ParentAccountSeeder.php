<?php

namespace Database\Seeders;

use App\Models\ParentAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParentAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parent_accounts = [
            ['parent_account_code' => 101, 'parent_account_name' => 'Kas'],
            ['parent_account_code' => 102, 'parent_account_name' => 'Bank SPBU'],
            ['parent_account_code' => 103, 'parent_account_name' => 'Deposito'],
            ['parent_account_code' => 104, 'parent_account_name' => 'Piutang Dagang SPBU'],
            ['parent_account_code' => 105, 'parent_account_name' => 'Piutang Kantor Cabang'],
            ['parent_account_code' => 106, 'parent_account_name' => 'Piutang Lain'],
            ['parent_account_code' => 107, 'parent_account_name' => 'Pers. BBM SPBU'],
            ['parent_account_code' => 108, 'parent_account_name' => 'Biaya Dibayar Dimuka'],
            ['parent_account_code' => 109, 'parent_account_name' => 'Panjar Lainnya (Down payment)'],
            ['parent_account_code' => 201, 'parent_account_name' => 'Inventaris Kantor'],
            ['parent_account_code' => 202, 'parent_account_name' => 'Kendaraan'],
            ['parent_account_code' => 203, 'parent_account_name' => 'Bangunan Kantor'],
            ['parent_account_code' => 204, 'parent_account_name' => 'Ak. Penyusutan Inventaris Kantor'],
            ['parent_account_code' => 205, 'parent_account_name' => 'Ak. Penyusutan Inventaris Kendaraan'],
            ['parent_account_code' => 206, 'parent_account_name' => 'Ak. Penyusutan Inventaris Bangunan Kantor'],
            ['parent_account_code' => 301, 'parent_account_name' => 'Hutang Dagang'],
            ['parent_account_code' => 302, 'parent_account_name' => 'Biaya yang masih harus Dibayar'],
            ['parent_account_code' => 303, 'parent_account_name' => 'Hutang Lain-lain'],
            ['parent_account_code' => 401, 'parent_account_name' => 'Hutang Aktiva Tetap'],
            ['parent_account_code' => 501, 'parent_account_name' => 'Modal Saham'],
            ['parent_account_code' => 502, 'parent_account_name' => 'Laba Ditahan (TA)'],
            ['parent_account_code' => 503, 'parent_account_name' => 'Saldo Laba'],
            // Penjualan
            ['parent_account_code' => 601, 'parent_account_name' => 'Penjualan Pertalite'],
            ['parent_account_code' => 602, 'parent_account_name' => 'Penjualan Dexlite'],
            ['parent_account_code' => 603, 'parent_account_name' => 'Penjualan Solar'],
            ['parent_account_code' => 604, 'parent_account_name' => 'Penjualan Pertamax 92'],
            ['parent_account_code' => 605, 'parent_account_name' => 'Penjualan Pertamax TURBO'],
            ['parent_account_code' => 606, 'parent_account_name' => 'Penjualan Pertamina Dex'],
            ['parent_account_code' => 607, 'parent_account_name' => 'Penjualan Lain-lain'],
            ['parent_account_code' => 608, 'parent_account_name' => 'Penjualan Bersih'],

            // Harga Pokok Penjualan
            ['parent_account_code' => 701, 'parent_account_name' => 'Pembelian Pertalite'],
            ['parent_account_code' => 702, 'parent_account_name' => 'Pembelian Dexlite'],
            ['parent_account_code' => 703, 'parent_account_name' => 'Pembelian Solar'],
            ['parent_account_code' => 704, 'parent_account_name' => 'Pembelian Pertamax 92'],
            ['parent_account_code' => 705, 'parent_account_name' => 'Pembelian Pertamax TURBO'],
            ['parent_account_code' => 706, 'parent_account_name' => 'Pembelian Pertamina Dex'],
            ['parent_account_code' => 707, 'parent_account_name' => 'Ongkos Bongkar Pembelian'],
            ['parent_account_code' => 708, 'parent_account_name' => 'Persediaan Awal'],
            ['parent_account_code' => 709, 'parent_account_name' => 'Persediaan Akhir'],

            // Biaya Umum dan Administrasi
            ['parent_account_code' => 801, 'parent_account_name' => 'Biaya Gaji Pokok Karyawan'],
            ['parent_account_code' => 802, 'parent_account_name' => 'Biaya Uang Makan Karyawan'],
            ['parent_account_code' => 803, 'parent_account_name' => 'Biaya Uang Lembur'],
            ['parent_account_code' => 804, 'parent_account_name' => 'Biaya Uang Transport Karyawan'],
            ['parent_account_code' => 805, 'parent_account_name' => 'Biaya Tunjangan Karyawan'],
            ['parent_account_code' => 806, 'parent_account_name' => 'Biaya THR Karyawan'],
            ['parent_account_code' => 807, 'parent_account_name' => 'Biaya Pergaulan'],
            ['parent_account_code' => 808, 'parent_account_name' => 'Biaya BBM Operasional'],
            ['parent_account_code' => 809, 'parent_account_name' => 'Biaya Sumbangan'],
            ['parent_account_code' => 810, 'parent_account_name' => 'Biaya Rek. Telepon'],
            ['parent_account_code' => 811, 'parent_account_name' => 'Biaya Rek. Listrik'],
            ['parent_account_code' => 812, 'parent_account_name' => 'Biaya Rek. Air'],
            ['parent_account_code' => 813, 'parent_account_name' => 'Biaya Perawatan Inventaris & Tempat'],
            ['parent_account_code' => 814, 'parent_account_name' => 'Biaya Pos dan Paket'],
            ['parent_account_code' => 815, 'parent_account_name' => 'Biaya Sewa'],
            ['parent_account_code' => 816, 'parent_account_name' => 'Biaya Penyusutan Inventaris Kantor'],
            ['parent_account_code' => 817, 'parent_account_name' => 'Biaya Penyusutan Kendaraan'],
            ['parent_account_code' => 818, 'parent_account_name' => 'Biaya Penyusutan Bangunan'],
            ['parent_account_code' => 819, 'parent_account_name' => 'Biaya Renovasi'],
            ['parent_account_code' => 820, 'parent_account_name' => 'Biaya Asuransi Kendaraan'],
            ['parent_account_code' => 821, 'parent_account_name' => 'Biaya Asuransi Gedung'],
            ['parent_account_code' => 822, 'parent_account_name' => 'Biaya Asuransi'],
            ['parent_account_code' => 823, 'parent_account_name' => 'Biaya Pajak'],
            ['parent_account_code' => 824, 'parent_account_name' => 'Biaya PBB'],
            ['parent_account_code' => 825, 'parent_account_name' => 'Biaya Alat Tulis dan Keperluan Kantor'],
            ['parent_account_code' => 826, 'parent_account_name' => 'Biaya Karyawan'],
            ['parent_account_code' => 827, 'parent_account_name' => 'Biaya Surat Izin'],
            ['parent_account_code' => 828, 'parent_account_name' => 'Biaya Lain-lain'],

            // Biaya Lain-lain
            ['parent_account_code' => 901, 'parent_account_name' => 'Biaya Bunga Pinjaman'],
            ['parent_account_code' => 902, 'parent_account_name' => 'Biaya Admin Bank dan Provisi'],
            ['parent_account_code' => 903, 'parent_account_name' => 'Biaya Selisih (Pembulatan)'],

            // Pendapatan Lain-lain
            ['parent_account_code' => 951, 'parent_account_name' => 'Pendapatan Jasa Giro'],
            ['parent_account_code' => 952, 'parent_account_name' => 'Pendapatan Lain-lain'],
            ['parent_account_code' => 953, 'parent_account_name' => 'Pendapatan Bunga Deposito'],
        ];


        $locations = DB::table('locations')->get();

        foreach ($parent_accounts as $parent_account) {
            // Insert parent account langsung ke database jika belum ada
            $parents = ParentAccount::create($parent_account);

            // Untuk setiap lokasi, buat child account
            foreach ($locations as $location) {
                // Format child_account_code
                $child_account_code = $parent_account['parent_account_code'] . '-' . $location->code . '-000';

                // Menentukan child_account_name
                $child_account_name = $parent_account['parent_account_name'];

                // Insert ke dalam tabel child_accounts
                DB::table('child_accounts')->insert([
                    'child_account_code' => $child_account_code,
                    'child_account_name' => $child_account_name,
                    'parent_account_id' => $parents->id, // Menggunakan id parent_account yang baru dibuat
                    'location_id' => $location->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\ChildAccount;
use App\Models\Ledger;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LedgerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $child_accounts = DB::table('child_accounts')->get();  // Ambil data child accounts
        $ledgers = [
            ['prefix' => 'Kas', 'ledger_name' => 'Kas'],
            ['prefix' => 'Bank SPBU', 'ledger_name' => 'Bank BNI'],
            ['prefix' => 'Bank SPBU', 'ledger_name' => 'Bank BRI'],
            ['prefix' => 'Bank SPBU', 'ledger_name' => 'My Pertamina'],
            ['prefix' => 'Deposito', 'ledger_name' => 'Deposito'],
            ['prefix' => 'Piutang Dagang SPBU', 'ledger_name' => 'Piutang Pertalite'],
            ['prefix' => 'Piutang Dagang SPBU', 'ledger_name' => 'Piutang Dexlite'],
            ['prefix' => 'Piutang Dagang SPBU', 'ledger_name' => 'Piutang Solar'],
            ['prefix' => 'Piutang Dagang SPBU', 'ledger_name' => 'Piutang Pertamax 92'],
            ['prefix' => 'Piutang Dagang SPBU', 'ledger_name' => 'Piutang Pertamax Turbo'],
            ['prefix' => 'Piutang Dagang SPBU', 'ledger_name' => 'Piutang Pertamina Dex'],
            ['prefix' => 'Piutang Kantor Cabang', 'ledger_name' => 'Piutang SPBU'],
            ['prefix' => 'Piutang Kantor Cabang', 'ledger_name' => 'Piutang (Instansi)'],
            ['prefix' => 'Piutang Kantor Cabang', 'ledger_name' => 'Piutang Claim'],
            ['prefix' => 'Piutang Lain', 'ledger_name' => 'Piutang Lain'],
            ['prefix' => 'Piutang Lain', 'ledger_name' => 'Pinjaman Karyawan'],
            ['prefix' => 'Pers. BBM SPBU', 'ledger_name' => 'Persediaan Pertalite'],
            ['prefix' => 'Pers. BBM SPBU', 'ledger_name' => 'Persediaan Dexlite'],
            ['prefix' => 'Pers. BBM SPBU', 'ledger_name' => 'Persediaan Solar'],
            ['prefix' => 'Pers. BBM SPBU', 'ledger_name' => 'Persediaan Pertamax 92'],
            ['prefix' => 'Pers. BBM SPBU', 'ledger_name' => 'Persediaan Pertamax Turbo'],
            ['prefix' => 'Pers. BBM SPBU', 'ledger_name' => 'Persediaan Pertamina Dex'],
            ['prefix' => 'Biaya Dibayar Dimuka', 'ledger_name' => 'Asuransi Dibayar Dimuka'],
            ['prefix' => 'Biaya Dibayar Dimuka', 'ledger_name' => 'Sewa Dibayar Dimuka'],
            ['prefix' => 'Biaya Dibayar Dimuka', 'ledger_name' => 'Biaya Dibayar Dimuka'],
            ['prefix' => 'Panjar Lainnya (Down payment)', 'ledger_name' => 'Panjar Lainnya (Down payment)'],
            ['prefix' => 'Inventaris Kantor', 'ledger_name' => 'Inventaris Kantor'],
            ['prefix' => 'Kendaraan', 'ledger_name' => 'Kendaraan'],
            ['prefix' => 'Bangunan Kantor', 'ledger_name' => 'Bangunan Kantor'],
            ['prefix' => 'Ak. Penyusutan Inventaris Kantor', 'ledger_name' => 'Ak. Penyusutan Inventaris Kantor'],
            ['prefix' => 'Ak. Penyusutan Inventaris Kendaraan', 'ledger_name' => 'Ak. Penyusutan Inventaris Kendaraan'],
            ['prefix' => 'Ak. Penyusutan Inventaris Bangunan Kantor', 'ledger_name' => 'Inventaris Kantor'],
            ['prefix' => 'Hutang Dagang', 'ledger_name' => 'Hutang ke Pertamina'],
            ['prefix' => 'Biaya yang masih harus Dibayar', 'ledger_name' => 'Biaya yang masih harus Dibayar'],
            ['prefix' => 'Hutang SPBU', 'ledger_name' => 'Hutang SPBU'],
            ['prefix' => 'Hutang Lain-lain', 'ledger_name' => 'Hutang Lain-lain'],
            ['prefix' => 'Hutang Aktiva Tetap', 'ledger_name' => 'Hutang Aktiva Tetap'],
            ['prefix' => 'Modal Saham', 'ledger_name' => 'Modal Saham'],
            ['prefix' => 'Laba Ditahan (TA)', 'ledger_name' => 'Laba Ditahan (TA)'],
            ['prefix' => 'Saldo Laba', 'ledger_name' => 'Laba Ditahan s.d Tahun Lalu'],
            ['prefix' => 'Saldo Laba', 'ledger_name' => 'Laba Ditahan s.d Bulan Lalu'],
            ['prefix' => 'Saldo Laba', 'ledger_name' => 'Laba Ditahan Bulan ini'],

            ['prefix' => 'Penjualan Pertalite', 'ledger_name' => 'Penjualan Pertalite'],
            ['prefix' => 'Penjualan Dexlite', 'ledger_name' => 'Penjualan Dexlite'],
            ['prefix' => 'Penjualan Solar', 'ledger_name' => 'Penjualan Solar'],
            ['prefix' => 'Penjualan Pertamax 92', 'ledger_name' => 'Penjualan Pertamax 92'],
            ['prefix' => 'Penjualan Pertamax TURBO', 'ledger_name' => 'Penjualan Pertamax TURBO'],
            ['prefix' => 'Penjualan Pertamina Dex', 'ledger_name' => 'Penjualan Pertamina Dex'],
            ['prefix' => 'Penjualan Lain-lain', 'ledger_name' => 'Penjualan Lain-lain'],

            // Harga Pokok Penjualan
            ['prefix' => 'Pembelian Pertalite', 'ledger_name' => 'Pembelian Pertalite'],
            ['prefix' => 'Pembelian Dexlite', 'ledger_name' => 'Pembelian Dexlite'],
            ['prefix' => 'Pembelian Solar', 'ledger_name' => 'Pembelian Solar'],
            ['prefix' => 'Pembelian Pertamax 92', 'ledger_name' => 'Pembelian Pertamax 92'],
            ['prefix' => 'Pembelian Pertamax TURBO', 'ledger_name' => 'Pembelian Pertamax TURBO'],
            ['prefix' => 'Pembelian Pertamina Dex', 'ledger_name' => 'Pembelian Pertamina Dex'],
            ['prefix' => 'Ongkos Bongkar Pembelian', 'ledger_name' => 'Ongkos Bongkar Pembelian'],
            ['prefix' => 'Persediaan Awal', 'ledger_name' => 'Persediaan Awal'],
            ['prefix' => 'Persediaan Akhir', 'ledger_name' => 'Persediaan Akhir'],

            // Biaya Umum dan Administrasi
            ['prefix' => 'Biaya Gaji Pokok Karyawan', 'ledger_name' => 'Biaya Gaji Pokok Karyawan'],
            ['prefix' => 'Biaya Uang Makan Karyawan', 'ledger_name' => 'Biaya Uang Makan Karyawan'],
            ['prefix' => 'Biaya Uang Lembur', 'ledger_name' => 'Biaya Uang Lembur'],
            ['prefix' => 'Biaya Uang Transport Karyawan', 'ledger_name' => 'Biaya Uang Transport Karyawan'],
            ['prefix' => 'Biaya Tunjangan Karyawan', 'ledger_name' => 'Biaya Tunjangan Karyawan'],
            ['prefix' => 'Biaya THR Karyawan', 'ledger_name' => 'Biaya THR Karyawan'],
            ['prefix' => 'Biaya Pergaulan', 'ledger_name' => 'Biaya Pergaulan'],
            ['prefix' => 'Biaya BBM Operasional', 'ledger_name' => 'Biaya BBM Operasional'],
            ['prefix' => 'Biaya Sumbangan', 'ledger_name' => 'Biaya Sumbangan'],
            ['prefix' => 'Biaya Rek. Telepon', 'ledger_name' => 'Biaya Rek. Telepon'],
            ['prefix' => 'Biaya Rek. Listrik', 'ledger_name' => 'Biaya Rek. Listrik'],
            ['prefix' => 'Biaya Rek. Air', 'ledger_name' => 'Biaya Rek. Air'],
            ['prefix' => 'Biaya Perawatan Inventaris & Tempat', 'ledger_name' => 'Biaya Perawatan Inventaris & Tempat'],
            ['prefix' => 'Biaya Pos dan Paket', 'ledger_name' => 'Biaya Pos dan Paket'],
            ['prefix' => 'Biaya Sewa', 'ledger_name' => 'Biaya Sewa'],
            ['prefix' => 'Biaya Penyusutan Inventaris Kantor', 'ledger_name' => 'Biaya Penyusutan Inventaris Kantor'],
            ['prefix' => 'Biaya Penyusutan Kendaraan', 'ledger_name' => 'Biaya Penyusutan Kendaraan'],
            ['prefix' => 'Biaya Penyusutan Bangunan', 'ledger_name' => 'Biaya Penyusutan Bangunan'],
            ['prefix' => 'Biaya Renovasi', 'ledger_name' => 'Biaya Renovasi'],
            ['prefix' => 'Biaya Asuransi Kendaraan', 'ledger_name' => 'Biaya Asuransi Kendaraan'],
            ['prefix' => 'Biaya Asuransi Gedung', 'ledger_name' => 'Biaya Asuransi Gedung'],
            ['prefix' => 'Biaya Asuransi', 'ledger_name' => 'Biaya Asuransi'],
            ['prefix' => 'Biaya Pajak', 'ledger_name' => 'Biaya Pajak'],
            ['prefix' => 'Biaya PBB', 'ledger_name' => 'Biaya PBB'],
            ['prefix' => 'Biaya Alat Tulis dan Keperluan Kantor', 'ledger_name' => 'Biaya Alat Tulis dan Keperluan Kantor'],
            ['prefix' => 'Biaya Karyawan', 'ledger_name' => 'Biaya Karyawan'],
            ['prefix' => 'Biaya Surat Izin', 'ledger_name' => 'Biaya Surat Izin'],
            ['prefix' => 'Biaya Lain-lain', 'ledger_name' => 'Biaya Lain-lain'],

            // Biaya Lain-lain
            ['prefix' => 'Biaya Bunga Pinjaman', 'ledger_name' => 'Biaya Bunga Pinjaman'],
            ['prefix' => 'Biaya Admin Bank dan Provisi', 'ledger_name' => 'Biaya Admin Bank dan Provisi'],
            ['prefix' => 'Biaya Selisih (Pembulatan)', 'ledger_name' => 'Biaya Selisih (Pembulatan)'],

            // Pendapatan Lain-lain
            ['prefix' => 'Pendapatan Jasa Giro', 'ledger_name' => 'Pendapatan Jasa Giro'],
            ['prefix' => 'Pendapatan Lain-lain', 'ledger_name' => 'Pendapatan Lain-lain'],
            ['prefix' => 'Pendapatan Bunga Deposito', 'ledger_name' => 'Pendapatan Bunga Deposito'],

        ];
        $ledger_code_counter = 1; // Untuk menghitung urutan ledger_code per prefix

        foreach ($ledgers as $ledger) {
            // Menentukan child_accounts berdasarkan prefix
            $child_accounts = ChildAccount::where('child_account_name', $ledger['prefix'])->get();

            if ($child_accounts->isEmpty()) {
                continue; // Jika tidak ada child_account yang ditemukan, lanjutkan ke ledger berikutnya
            }

            foreach ($child_accounts as $child_account) {
                // Mengambil child_account_code, menghilangkan -000, dan menambahkan nomor urut
                $base_code = str_replace('000', '', $child_account->child_account_code);
                $ledger_code = $base_code . str_pad($ledger_code_counter, 3, '0', STR_PAD_LEFT); // Menambahkan nomor urut setelah base code
                $ledger_code_counter++; // Increment counter setelah setiap ledger

                // Jika kita beralih ke prefix yang berbeda, reset counter
                if (isset($previous_prefix) && $previous_prefix !== $ledger['prefix']) {
                    $ledger_code_counter = 1;
                }

                // Menentukan ledger_name
                $ledger_name = $ledger['ledger_name'];

                // Tentukan saldo awal (balance), asumsikan saldo awal 0
                $balance = 0;

                // Tentukan type_start_balance: apakah Debit atau Kredit
                $type_start_balance = ($child_account->parent_account_id % 2 == 0) ? 'Debet' : 'Kredit';

                // Insert data ke tabel ledgers untuk setiap child_account yang ditemukan
                Ledger::firstOrCreate(
                    ['ledger_code' => $ledger_name],
                    ([
                        'ledger_code' => $ledger_code,
                        'ledger_name' => $ledger_name,
                        'balance' => $balance,
                        'type_start_balance' => $type_start_balance,
                        'child_account_id' => $child_account->id,
                        'location_id' => $child_account->location_id, // Pastikan location_id sudah didefinisikan
                        'created_at' => now(),
                        'updated_at' => now(),
                        'notes' => 'Initial ledger entry for ' . $ledger_name,
                    ])
                );

                // Menyimpan prefix sebelumnya untuk pengecekan perubahan prefix
                $previous_prefix = $ledger['prefix'];
            }
        }
    }
}

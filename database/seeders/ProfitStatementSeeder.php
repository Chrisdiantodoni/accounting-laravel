<?php

namespace Database\Seeders;

use App\Models\Cogs;
use App\Models\CogsLedger;
use App\Models\Cost;
use App\Models\CostLedger;
use App\Models\Ledger;
use App\Models\Location;
use App\Models\OtherCost;
use App\Models\OtherCostLedger;
use App\Models\ProfitLossStatement;
use App\Models\Revenue;
use App\Models\RevenueLedger;
use App\Models\Sales;
use App\Models\SalesLedger;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfitStatementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = Location::all();

        // $profitLossStatement = ProfitLossStatement::query()->delete();

        $ledgers = [
            ['prefix' => 'Penjualan Pertalite', 'ledger_name' => 'Penjualan Pertalite', 'type' => 'sales'],
            ['prefix' => 'Penjualan Dexlite', 'ledger_name' => 'Penjualan Dexlite', 'type' => 'sales'],
            ['prefix' => 'Penjualan Solar', 'ledger_name' => 'Penjualan Solar', 'type' => 'sales'],
            ['prefix' => 'Penjualan Pertamax 92', 'ledger_name' => 'Penjualan Pertamax 92', 'type' => 'sales'],
            ['prefix' => 'Penjualan Pertamax TURBO', 'ledger_name' => 'Penjualan Pertamax TURBO', 'type' => 'sales'],
            ['prefix' => 'Penjualan Pertamina Dex', 'ledger_name' => 'Penjualan Pertamina Dex', 'type' => 'sales'],
            ['prefix' => 'Penjualan Lain-lain', 'ledger_name' => 'Penjualan Lain-lain', 'type' => 'sales'],

            // Harga Pokok Penjualan
            ['prefix' => 'Pembelian Pertalite', 'ledger_name' => 'Pembelian Pertalite', 'type' => 'cogs'],
            ['prefix' => 'Pembelian Dexlite', 'ledger_name' => 'Pembelian Dexlite', 'type' => 'cogs'],
            ['prefix' => 'Pembelian Solar', 'ledger_name' => 'Pembelian Solar', 'type' => 'cogs'],
            ['prefix' => 'Pembelian Pertamax 92', 'ledger_name' => 'Pembelian Pertamax 92', 'type' => 'cogs'],
            ['prefix' => 'Pembelian Pertamax TURBO', 'ledger_name' => 'Pembelian Pertamax TURBO', 'type' => 'cogs'],
            ['prefix' => 'Pembelian Pertamina Dex', 'ledger_name' => 'Pembelian Pertamina Dex', 'type' => 'cogs'],
            ['prefix' => 'Ongkos Bongkar Pembelian', 'ledger_name' => 'Ongkos Bongkar Pembelian', 'type' => 'cogs'],
            ['prefix' => 'Persediaan Awal', 'ledger_name' => 'Persediaan Awal', 'type' => 'cogs'],
            ['prefix' => 'Persediaan Akhir', 'ledger_name' => 'Persediaan Akhir', 'type' => 'cogs'],

            // Biaya Umum dan Administrasi
            ['prefix' => 'Biaya Gaji Pokok Karyawan', 'ledger_name' => 'Biaya Gaji Pokok Karyawan', 'type' => 'cost'],
            ['prefix' => 'Biaya Uang Makan Karyawan', 'ledger_name' => 'Biaya Uang Makan Karyawan', 'type' => 'cost'],
            ['prefix' => 'Biaya Uang Lembur', 'ledger_name' => 'Biaya Uang Lembur', 'type' => 'cost'],
            ['prefix' => 'Biaya Uang Transport Karyawan', 'ledger_name' => 'Biaya Uang Transport Karyawan', 'type' => 'cost'],
            ['prefix' => 'Biaya Tunjangan Karyawan', 'ledger_name' => 'Biaya Tunjangan Karyawan', 'type' => 'cost'],
            ['prefix' => 'Biaya THR Karyawan', 'ledger_name' => 'Biaya THR Karyawan', 'type' => 'cost'],
            ['prefix' => 'Biaya Pergaulan', 'ledger_name' => 'Biaya Pergaulan', 'type' => 'cost'],
            ['prefix' => 'Biaya BBM Operasional', 'ledger_name' => 'Biaya BBM Operasional', 'type' => 'cost'],
            ['prefix' => 'Biaya Sumbangan', 'ledger_name' => 'Biaya Sumbangan', 'type' => 'cost'],
            ['prefix' => 'Biaya Rek. Telepon', 'ledger_name' => 'Biaya Rek. Telepon', 'type' => 'cost'],
            ['prefix' => 'Biaya Rek. Listrik', 'ledger_name' => 'Biaya Rek. Listrik', 'type' => 'cost'],
            ['prefix' => 'Biaya Rek. Air', 'ledger_name' => 'Biaya Rek. Air', 'type' => 'cost'],
            ['prefix' => 'Biaya Perawatan Inventaris & Tempat', 'ledger_name' => 'Biaya Perawatan Inventaris & Tempat', 'type' => 'cost'],
            ['prefix' => 'Biaya Pos dan Paket', 'ledger_name' => 'Biaya Pos dan Paket', 'type' => 'cost'],
            ['prefix' => 'Biaya Sewa', 'ledger_name' => 'Biaya Sewa', 'type' => 'cost'],
            ['prefix' => 'Biaya Penyusutan Inventaris Kantor', 'ledger_name' => 'Biaya Penyusutan Inventaris Kantor', 'type' => 'cost'],
            ['prefix' => 'Biaya Penyusutan Kendaraan', 'ledger_name' => 'Biaya Penyusutan Kendaraan', 'type' => 'cost'],
            ['prefix' => 'Biaya Penyusutan Bangunan', 'ledger_name' => 'Biaya Penyusutan Bangunan', 'type' => 'cost'],
            ['prefix' => 'Biaya Renovasi', 'ledger_name' => 'Biaya Renovasi', 'type' => 'cost'],
            ['prefix' => 'Biaya Asuransi Kendaraan', 'ledger_name' => 'Biaya Asuransi Kendaraan', 'type' => 'cost'],
            ['prefix' => 'Biaya Asuransi Gedung', 'ledger_name' => 'Biaya Asuransi Gedung', 'type' => 'cost'],
            ['prefix' => 'Biaya Asuransi', 'ledger_name' => 'Biaya Asuransi', 'type' => 'cost'],
            ['prefix' => 'Biaya Pajak', 'ledger_name' => 'Biaya Pajak', 'type' => 'cost'],
            ['prefix' => 'Biaya PBB', 'ledger_name' => 'Biaya PBB', 'type' => 'cost'],
            ['prefix' => 'Biaya Alat Tulis dan Keperluan Kantor', 'ledger_name' => 'Biaya Alat Tulis dan Keperluan Kantor', 'type' => 'cost'],
            ['prefix' => 'Biaya Karyawan', 'ledger_name' => 'Biaya Karyawan', 'type' => 'cost'],
            ['prefix' => 'Biaya Surat Izin', 'ledger_name' => 'Biaya Surat Izin', 'type' => 'cost'],
            ['prefix' => 'Biaya Lain-lain', 'ledger_name' => 'Biaya Lain-lain', 'type' => 'cost'],

            // Biaya Lain-lain
            ['prefix' => 'Biaya Bunga Pinjaman', 'ledger_name' => 'Biaya Bunga Pinjaman', 'type' => 'other_cost'],
            ['prefix' => 'Biaya Admin Bank dan Provisi', 'ledger_name' => 'Biaya Admin Bank dan Provisi', 'type' => 'other_cost'],
            ['prefix' => 'Biaya Selisih (Pembulatan)', 'ledger_name' => 'Biaya Selisih (Pembulatan)', 'type' => 'other_cost'],

            // Pendapatan Lain-lain
            ['prefix' => 'Pendapatan Jasa Giro', 'ledger_name' => 'Pendapatan Jasa Giro', 'type' => 'revenue'],
            ['prefix' => 'Pendapatan Lain-lain', 'ledger_name' => 'Pendapatan Lain-lain', 'type' => 'revenue'],
            ['prefix' => 'Pendapatan Bunga Deposito', 'ledger_name' => 'Pendapatan Bunga Deposito', 'type' => 'revenue'],

        ];


        foreach ($locations as $location) {
            // Create ProfitLossStatement for each location if not exists
            $profitLossStatement = ProfitLossStatement::firstOrCreate(
                ['location_id' => $location->id],
                ['location_id' => $location->id]
            );
            // Create the Sales entry
            $sales = Sales::create([
                'profit_loss_statements_id' => $profitLossStatement->id,  // Link to ProfitLossStatement
            ]);
            // Create the COGS entry
            $cogs = Cogs::create([
                'profit_loss_statements_id' => $profitLossStatement->id,  // Link to ProfitLossStatement

            ]);
            // Create the Cost entry
            $cost = Cost::create([
                'profit_loss_statements_id' => $profitLossStatement->id,

            ]);

            // Create the OtherCost entry
            $otherCost = OtherCost::create([
                'profit_loss_statements_id' => $profitLossStatement->id,

            ]);

            // Create the Revenue entry
            $revenue = Revenue::create([
                'profit_loss_statements_id' => $profitLossStatement->id,

            ]);

            foreach ($ledgers as $ledger) {
                // Fetch the existing ledger record based on ledger_name
                $ledgerRecord = Ledger::where('ledger_name', $ledger['ledger_name'])->where('location_id', $location->id)->first();

                if ($ledgerRecord) {
                    switch ($ledger['type']) {
                        case 'sales':

                            // Create SalesLedger entry
                            SalesLedger::create([
                                'sales_id' => $sales->id,    // Link to Sales
                                'ledger_id' => $ledgerRecord->id  // Link to Ledger
                            ]);
                            break;

                        case 'cogs':


                            // Create COGS Ledger entry
                            CogsLedger::create([
                                'cogs_id' => $cogs->id,  // Link to COGS
                                'ledger_id' => $ledgerRecord->id  // Link to Ledger
                            ]);
                            break;

                        case 'cost':


                            // Create Cost Ledger entry
                            CostLedger::create([
                                'cost_id' => $cost->id,
                                'ledger_id' => $ledgerRecord->id
                            ]);
                            break;

                        case 'other_cost':


                            // Create OtherCost Ledger entry
                            OtherCostLedger::create([
                                'other_cost_id' => $otherCost->id,
                                'ledger_id' => $ledgerRecord->id
                            ]);
                            break;

                        case 'revenue':

                            // Create Revenue Ledger entry
                            RevenueLedger::create([
                                'revenue_id' => $revenue->id,
                                'ledger_id' => $ledgerRecord->id
                            ]);
                            break;
                    }
                }
            }
        }
    }
}

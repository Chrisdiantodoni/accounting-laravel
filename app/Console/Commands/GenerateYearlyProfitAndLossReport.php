<?php

namespace App\Console\Commands;

use App\Models\Ledger;
use App\Models\Location;
use App\Models\Entry;
use App\Models\EntryItems;
use App\Models\EntryLog;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateYearlyProfitAndLossReport extends Command
{
    protected $signature = 'app:generate-yearly-profit-and-loss-report';
    protected $description = 'Generate monthly profit and loss entries per location';

    public function handle()
    {
        Entry::where('user_id', null)->delete();



        $year = now()->year;
        $locations = Location::all();

        foreach ($locations as $location) {
            $locationCode = str_pad($location->code, 3, '0', STR_PAD_LEFT);
            $labaDitahanBulanLalu = Ledger::where('ledger_name', 'Laba Ditahan s.d Bulan Lalu')->where('location_id', $location->id)->first();
            $labaDitahanBulanIni = Ledger::where('ledger_name', 'Laba Ditahan Bulan ini')->where('location_id', $location->id)->first();

            if (!$labaDitahanBulanLalu || !$labaDitahanBulanIni) {
                $this->error('Beberapa data ledger tidak ditemukan.');
                return;
            }

            for ($month = 1; $month <= 12; $month++) {
                $monthCode = str_pad($month, 2, '0', STR_PAD_LEFT);
                $documentNumber = "{$year}.{$locationCode}.{$monthCode}.LR.001";

                $entryDate = Carbon::create($year, $month, 1)->endOfMonth();

                // Cek apakah Entry sudah ada
                $entry = Entry::where('document_number', $documentNumber)->first();

                if (!$entry) {
                    $entry = Entry::create([
                        'document_number' => $documentNumber,
                        'entries_date' => $entryDate,
                        'location_id' => $location->id,
                        'debit' => 0,
                        'credit' => 0,
                        'notes' => "Laba Ditahan Report {$month}/{$year} - {$location->location_name}",
                        'status' => 'posting',
                        'is_closing' => false,
                        'created_at' => $entryDate,
                        'updated_at' => $entryDate,
                        'posting_at' => $entryDate,
                    ]);
                    EntryLog::create([
                        'user_id' => null,
                        'action' => "System Pembuatan Laba Rugi",
                        'entries_id' => $entry->id,
                    ]);
                }

                $monthName = Carbon::create()->month($month)->translatedFormat('F');
                $lastMonth = now()->copy()->month($month)->subMonth()->translatedFormat('F');
                // EntryItem 1: Bulan Lalu - Debet
                EntryItems::create([
                    'entries_id' => $entry->id,
                    'entry_date' => $entryDate,
                    'ledger_id' => $labaDitahanBulanLalu->id,
                    'user_id' => null,
                    'debit' => 0,
                    'credit' => 0,
                    'notes' => "Laba Ditahan s.d Bulan Lalu - {$lastMonth} {$year} - {$location->name}",
                    'type' => 'Debit',
                    'created_at' => $entryDate,
                    'updated_at' => $entryDate,
                ]);

                // EntryItem 2: Bulan Ini - Debet
                EntryItems::create([
                    'entries_id' => $entry->id,
                    'entry_date' => $entryDate,
                    'ledger_id' => $labaDitahanBulanIni->id,
                    'user_id' => null,
                    'debit' => 0,
                    'credit' => 0,
                    'notes' => "Laba Ditahan Bulan Ini (Debet) - {$monthName} {$year} - {$location->name}",
                    'type' => 'Debit',
                    'created_at' => $entryDate,
                    'updated_at' => $entryDate,
                ]);

                // EntryItem 3: Bulan Ini - Kredit
                EntryItems::create([
                    'entries_id' => $entry->id,
                    'entry_date' => $entryDate,
                    'ledger_id' => $labaDitahanBulanIni->id,
                    'user_id' => null,
                    'debit' => 0,
                    'credit' => 0,
                    'notes' => "Adjustment Laba - {$lastMonth} {$year} - {$location->name}",
                    'type' => 'Kredit',
                    'created_at' => $entryDate,
                    'updated_at' => $entryDate,
                ]);
            }
        }

        $this->info("✅ Laporan Laba Ditahan berhasil dibuat untuk seluruh lokasi di tahun {$year}.");
    }
}

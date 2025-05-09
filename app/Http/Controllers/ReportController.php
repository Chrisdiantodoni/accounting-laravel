<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\CoaGroup;
use App\Models\Cogs;
use App\Models\Cost;
use App\Models\EntryItems;
use App\Models\Ledger;
use App\Models\LedgerBalance;
use App\Models\OtherCost;
use App\Models\ProfitLossStatement;
use App\Models\Revenue;
use App\Models\Sales;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function profitLossReports(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'location_id' => 'required',
                'month' => 'required',
                'year' => 'required',
            ]);

            $location_id = $request->input('location_id');
            $month = $request->input('month');
            $year = $request->input('year');

            if ($validator->fails()) {
                $data = [];
                $filters = [
                    'month' => $month,
                    'year' => $year,
                    'location_id' => $location_id
                ];
                return Inertia::render('Dashboard/Report/ProfitLoss', compact('data', 'filters'));
            }

            $relations = [
                'ledgers.entry_items' => function ($q) {
                    $q->whereHas('entry', function ($query) {
                        $query->where('status', 'posting');
                    });
                },
                'ledgers.entry_items.entry', // tetap include entry-nya agar bisa diakses
            ];

            $locationFilter = function ($q) use ($location_id) {
                $q->where('location_id', $location_id);
            };

            // Hapus ledgerFilter supaya semua ledger ikut, meskipun entry_items-nya kosong
            $collections = [
                'sales' => Sales::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
                'cogs' => Cogs::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
                'costs' => Cost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
                'other_costs' => OtherCost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
                'revenues' => Revenue::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            ];

            $data = [];
            foreach ($collections as $key => $items) {
                $data[$key] = [];

                foreach ($items as $item) {
                    foreach ($item->ledgers as $ledger) {
                        $total = 0;

                        foreach ($ledger->entry_items as $entry) {
                            $entryDate = is_string($entry->entry_date)
                                ? Carbon::parse($entry->entry_date)
                                : $entry->entry_date;

                            if ($entryDate->format('Y') == $year && $entryDate->format('m') == str_pad($month, 2, '0', STR_PAD_LEFT)) {
                                switch ($key) {
                                    case 'sales':
                                        $total += $entry->credit - $entry->debit; // credit positif, debit negatif
                                        break;
                                    case 'revenues':
                                        $total += $entry->credit - $entry->debit; // sama seperti sales
                                        break;
                                    case 'cogs':
                                    case 'costs':
                                    case 'other_costs':
                                        $total += $entry->debit - $entry->credit; // debit positif, kredit negatif
                                        break;
                                }
                            }
                        }

                        $data[$key][] = [
                            'ledger_name' => $ledger->ledger_name,
                            'total' => $total,
                        ];
                    }
                }
            }

            $filters = [
                'month' => $month,
                'year' => $year,
                'location_id' => $location_id,
            ];


            return Inertia::render('Dashboard/Report/ProfitLoss', compact('data', 'filters'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function balanceSheetReports(Request $request)
    {
        try {
            DB::beginTransaction();

            $validator = Validator::make($request->all(), [
                'location_id' => 'required',
                'month' => 'required',
                'year' => 'required',
            ]);

            if ($validator->fails()) {
                $filters = $request->only(['month', 'year', 'location_id']);
                return Inertia::render('Dashboard/Report/BalanceSheet', [
                    'data' => [],
                    'filters' => $filters,
                ]);
            }

            $location_id = $request->input('location_id');
            $month = (int) $request->input('month');
            $year = (int) $request->input('year');

            // $relations = [
            //     'entry_items' => function ($q) {
            //         $q->whereHas('entry', function ($query) {
            //             $query->where('status', 'posting');
            //         });
            //     },
            //     'entry_items.entry',
            // ];
            $relations = [
                'entry_items' => function ($q) {
                    $q->where(function ($query) {
                        $query->whereNull('entries_id') // biarkan lewat
                            ->orWhereHas('entry', function ($subQuery) {
                                $subQuery->where('status', 'posting');
                            });
                    });
                },
                'entry_items.entry',
            ];

            $ledgers = Ledger::query()
                ->with(array_merge(['entry_items', 'child_account.parent_account'], $relations))
                ->where('location_id', $location_id)
                ->whereHas('child_account.parent_account')
                ->get()
                ->filter(function ($ledger) {
                    return $ledger->child_account?->parent_account?->coa_group_type === 'Neraca';
                })
                ->groupBy(function ($ledger) {
                    return $ledger->child_account->parent_account->coa_group ?? 'Tidak Diketahui';
                });
            // return ResponseFormatter::success($ledgers);
            $data = [];

            foreach ($ledgers as $group => $ledgerGroup) {
                $data[$group] = [];

                foreach ($ledgerGroup as $ledger) {
                    $total_debit = 0;
                    $total_kredit = 0;

                    // Hitung saldo awal dari ledgers_end_balances bulan sebelumnya
                    $prevMonth = $month - 1;
                    $prevYear = $year;
                    if ($prevMonth <= 0) {
                        $prevMonth = 12;
                        $prevYear -= 1;
                    }

                    $saldo_awal = LedgerBalance::where('ledger_id', $ledger->id)
                        ->where('month', $prevMonth)
                        ->where('year', $prevYear)
                        ->value('closing_balance') ?? 0;

                    foreach ($ledger->entry_items as $entry) {
                        $entryDate = is_string($entry->entry_date)
                            ? Carbon::parse($entry->entry_date)
                            : $entry->entry_date;

                        if ((int)$entryDate->format('Y') === $year && (int)$entryDate->format('m') === $month) {
                            $total_debit += $entry->debit;
                            $total_kredit += $entry->credit;
                        }
                    }

                    $saldo_akhir = $saldo_awal + ($total_debit - $total_kredit);

                    $data[$group][] = [
                        'ledger_name' => $ledger->ledger_name,
                        'saldo_awal' => $saldo_awal,
                        'total_debit' => $total_debit,
                        'total_kredit' => $total_kredit,
                        'saldo_akhir' => $saldo_akhir,
                    ];
                }
            }

            $filters = [
                'month' => $month,
                'year' => $year,
                'location_id' => $location_id,
            ];

            DB::commit();
            return Inertia::render('Dashboard/Report/BalanceSheet', compact('data', 'filters', 'ledgers'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function historicalJournalReports(Request $request)
    {
        try {
            $type = $request->input('type');
            // return ResponseFormatter::success($type);
            $ledger_id = $request->input('ledger_id');
            $location_id = $request->input('location_id');
            $start_date = $request->input('start_date');
            $end_date = $request->input('end_date');

            $totalInRange = [
                'total_debit' => 0,
                'total_credit' => 0,
            ];
            $totalBefore = [
                'total_debit' => 0,
                'total_credit' => 0,
            ];


            $journals = [];

            // Hanya lakukan query kalau ada filter lengkap
            if ($ledger_id && $location_id && $start_date && $end_date) {
                // Total debit & kredit dalam rentang tanggal
                $entriesInRange = EntryItems::with(['entry' => function ($query) use ($location_id) {
                    $query->where('location_id', $location_id);
                }])
                    ->where('ledger_id', $ledger_id)
                    ->whereBetween('entry_date', [$start_date, $end_date]);

                $totalInRange = $entriesInRange->selectRaw('SUM(debit) as total_debit, SUM(credit) as total_credit')->first();
                // Total sebelum rentang tanggal
                $entriesBefore = EntryItems::with(['entry' => function ($query) use ($location_id) {
                    $query->where('location_id', $location_id);
                }])
                    ->where('ledger_id', $ledger_id)
                    ->where('entry_date', '<', $start_date);

                $totalBefore = $entriesBefore->selectRaw('SUM(debit) as total_debit, SUM(credit) as total_credit')->first();
                $journals = Ledger::with(['entry_items' => function ($query) use ($location_id, $start_date, $end_date) {
                    $query->whereHas('entry', function ($subQuery) use ($location_id, $start_date, $end_date) {
                        $subQuery->where('location_id', $location_id)
                            ->whereBetween('entries_date', [$start_date, $end_date]);
                    });
                }, 'entry_items.entry'])
                    ->where('id', $ledger_id)
                    ->whereHas('entry_items.entry', function ($query) use ($location_id, $start_date, $end_date) {
                        $query->where('location_id', $location_id)
                            ->whereBetween('entries_date', [$start_date, $end_date]);
                    })
                    ->first();
                $previousMonth = Carbon::parse($start_date)->startOfMonth()->subMonth(); // TANPA toDateString()


                $start_balance = LedgerBalance::where('ledger_id', $ledger_id)
                    ->where('location_id', $location_id)
                    ->where('month', $previousMonth->month)
                    ->where('year', $previousMonth->year)
                    ->first();
            }

            $filters = [
                'ledger_id' => $ledger_id,
                'location_id' => $location_id,
                'start_date' => $start_date,
                'end_date' => $end_date,
            ];


            return Inertia::render('Dashboard/Report/HistoricalJournal', [
                'journals' => $journals,
                'filters' => $filters,
                'total_in_range' => $totalInRange,
                'total_in_range_before' => $totalBefore,
                'start_balance' => $type == 'Laba/Rugi' ? 0 : $start_balance->closing_balance ?? 0
            ]);
        } catch (\Exception $e) {
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

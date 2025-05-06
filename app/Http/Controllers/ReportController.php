<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\CoaGroup;
use App\Models\Cogs;
use App\Models\Cost;
use App\Models\EntryItems;
use App\Models\Ledger;
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

            $relations = ['ledgers.entry_items'];

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
                        $total_debit = 0;
                        $total_kredit = 0;

                        foreach ($ledger->entry_items as $entry) {
                            $entryDate = is_string($entry->entry_date)
                                ? Carbon::parse($entry->entry_date)
                                : $entry->entry_date;

                            if ($entryDate->format('Y') == $year && $entryDate->format('m') == str_pad($month, 2, '0', STR_PAD_LEFT)) {
                                $total_debit += $entry->debit;
                                $total_kredit += $entry->credit;
                            }
                        }

                        $data[$key][] = [
                            'ledger_name' => $ledger->ledger_name,
                            'total_debit' => $total_debit,
                            'total_kredit' => $total_kredit,
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
            $location_id = $request->input('location_id');
            $month = $request->input('month');
            $year = $request->input('year');
            $locationFilter = function ($q) use ($location_id) {
                $q->where('location_id', $location_id);
            };

            if ($validator->fails()) {
                $data = [];
                $filters = [
                    'month' => $month,
                    'year' => $year,
                    'location_id' => $location_id
                ];
                return Inertia::render('Dashboard/Report/BalanceSheet', compact('data', 'filters'));
            }





            $ledgers = Ledger::query()
                ->with(['entry_items', 'child_account.parent_account'])
                ->where('location_id', $location_id)
                ->whereHas('child_account.parent_account') // pastikan relasi lengkap
                ->get()
                ->filter(function ($ledger) use ($year, $month) {
                    return $ledger->child_account?->parent_account?->coa_group_type === 'Neraca';
                })
                ->groupBy(function ($ledger) {
                    return $ledger->child_account->parent_account->coa_group ?? 'Tidak Diketahui';
                });

            $data = [];


            foreach ($ledgers as $group => $ledgerGroup) {
                $data[$group] = [];

                foreach ($ledgerGroup as $ledger) {
                    $total_debit = 0;
                    $total_kredit = 0;

                    foreach ($ledger->entry_items as $entry) {
                        $entryDate = is_string($entry->entry_date)
                            ? Carbon::parse($entry->entry_date)
                            : $entry->entry_date;

                        if ($entryDate->format('Y') == $year && $entryDate->format('m') == str_pad($month, 2, '0', STR_PAD_LEFT)) {
                            $total_debit += $entry->debit;
                            $total_kredit += $entry->credit;
                        }
                    }

                    $data[$group][] = [
                        'ledger_name' => $ledger->ledger_name,
                        'total_debit' => $total_debit,
                        'total_kredit' => $total_kredit,
                    ];
                }
            }


            $filters = [
                'month' => $month,
                'year' => $year,
                'location_id' => $location_id
            ];

            return Inertia::render('Dashboard/Report/BalanceSheet', compact('data', 'filters', 'ledgers'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }
    public function historicalJournalReports(Request $request)
    {
        try {
            $ledger_id = $request->input('ledger_id');
            $location_id = $request->input('location_id');
            $start_date = $request->input('start_date');
            $end_date = $request->input('end_date');

            $data = Ledger::where('id', $ledger_id)->get();

            $filters = [
                'ledger_id' => $ledger_id,
                'location_id' => $location_id,
                'start_date' => $start_date,
                'end_date' => $end_date,
            ];

            return Inertia::render('Dashboard/Report/HistoricalJournal', compact('data', 'filters'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

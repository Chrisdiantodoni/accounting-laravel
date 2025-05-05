<?php

namespace App\Http\Controllers;

use App\Models\CoaGroup;
use App\Models\Cogs;
use App\Models\Cost;
use App\Models\EntryItems;
use App\Models\Ledger;
use App\Models\OtherCost;
use App\Models\ProfitLossStatement;
use App\Models\Revenue;
use App\Models\Sales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function profitLossReports(Request $request)
    {
        try {
            DB::beginTransaction();

            $location_id = $request->input('location_id');
            $month = $request->input('month');
            $year = $request->input('year');

            $relations = ['ledgers.entry_items', 'profit_loss'];
            $locationFilter = function ($q) use ($location_id) {
                $q->where('location_id', $location_id);
            };
            $dateFilter = function ($query) use ($month, $year) {
                $query->whereYear('entry_date', $year)
                    ->whereMonth('entry_date', $month);
            };

            $ledgerFilter = function ($query) use ($dateFilter) {
                $query->whereHas('entry_items', $dateFilter);
            };

            $sales = Sales::with(['ledgers.entry_items'])
                ->whereHas('ledgers', $ledgerFilter)
                ->whereHas('profit_loss', function ($q) use ($location_id) {
                    $q->where('location_id', $location_id);
                })
                ->get();

            $cogs = Cogs::with(['ledgers.entry_items'])
                ->whereHas('ledgers', $ledgerFilter)
                ->whereHas('profit_loss', function ($q) use ($location_id) {
                    $q->where('location_id', $location_id);
                })
                ->get();

            $costs = Cost::with(['ledgers.entry_items'])
                ->whereHas('ledgers', $ledgerFilter)
                ->whereHas('profit_loss', function ($q) use ($location_id) {
                    $q->where('location_id', $location_id);
                })
                ->get();

            $other_costs = OtherCost::with(['ledgers.entry_items'])
                ->whereHas('ledgers', $ledgerFilter)
                ->whereHas('profit_loss', function ($q) use ($location_id) {
                    $q->where('location_id', $location_id);
                })
                ->get();

            $revenues = Revenue::with(['ledgers.entry_items'])
                ->whereHas('ledgers', $ledgerFilter)
                ->whereHas('profit_loss', function ($q) use ($location_id) {
                    $q->where('location_id', $location_id);
                })
                ->get();


            $filters = [
                'month' => $month,
                'year' => $year,
                'location_id' => $location_id
            ];

            $data = [
                'sales' => $sales,
                'other_cost' => $other_costs,
                'cogs' => $cogs,
                'costs'  => $other_costs,
                'revenues' => $revenues
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

            $location_id = $request->input('location_id');
            $month = $request->input('month');
            $year = $request->input('year');
            $locationFilter = function ($q) use ($location_id) {
                $q->where('location_id', $location_id);
            };



            $data = Ledger::query()
                ->with(['entry_items', 'child_account.parent_account'])->whereHas('entry_items', function ($query) use ($year, $month) {
                    $query->whereYear('entry_date', $year)
                        ->whereMonth('entry_date', $month);
                })
                ->where('location_id', $location_id)
                ->whereHas('child_account', function ($q) {
                    $q->whereHas('parent_account'); // tidak bisa filter coa_group_type di sini
                })
                ->get()
                ->filter(function ($ledger) {
                    return $ledger->child_account?->parent_account?->coa_group_type === 'Neraca';
                })
                ->values();


            $filters = [
                'month' => $month,
                'year' => $year,
                'location_id' => $location_id
            ];

            return Inertia::render('Dashboard/Report/BalanceSheet', compact('data', 'filters'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }
    public function historicalJournalReport(Request $request) {}
}

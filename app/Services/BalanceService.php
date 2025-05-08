<?php

namespace App\Services;

use App\Helpers\ResponseFormatter;
use App\Models\Sales;
use App\Models\Cogs;
use App\Models\Cost;
use App\Models\EntryItems;
use App\Models\OtherCost;
use App\Models\Revenue;
use Carbon\Carbon;

class BalanceService
{
    public function calculateEachLedgerBalance($locationId, $month, $year)
    {
        $totals = EntryItems::with(['entry'])
            ->whereHas('entry', function ($query) use ($month, $year) {
                $query->whereMonth('entries_date', $month)
                    ->whereYear('entries_date', $year);
            })
            ->where('location_id', $locationId)
            ->get(['debit', 'credit'])
            ->reduce(function ($carry, $item) {
                $carry['debit'] += $item->debit;
                $carry['credit'] += $item->credit;
                return $carry;
            }, ['debit' => 0, 'credit' => 0]);

        $total_debit = $totals['debit'];
        $total_credit = $totals['credit'];

        return [
            'total_debit' => $total_debit,
            'total_credit' => $total_credit,
        ];
    }
}

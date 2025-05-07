<?php

namespace App\Services;

use App\Helpers\ResponseFormatter;
use App\Models\Sales;
use App\Models\Cogs;
use App\Models\Cost;
use App\Models\OtherCost;
use App\Models\Revenue;
use Carbon\Carbon;

class ProfitLossService
{

    public function calculateWithExclusion($locationId, $month, $year, $excludeEntryItemIds = [])
    {
        $relations = ['ledgers.entry_items'];

        $locationFilter = function ($q) use ($locationId) {
            $q->where('location_id', $locationId);
        };

        $collections = [
            'sales' => Sales::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'cogs' => Cogs::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'costs' => Cost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'other_costs' => OtherCost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'revenues' => Revenue::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
        ];

        $sums = [
            'sales' => 0,
            'cogs' => 0,
            'costs' => 0,
            'other_costs' => 0,
            'revenues' => 0,
        ];

        foreach ($collections as $key => $items) {
            foreach ($items as $item) {
                foreach ($item->ledgers as $ledger) {
                    foreach ($ledger->entry_items as $entry) {
                        // Abaikan jika masuk dalam daftar exclude
                        if (in_array($entry->id, $excludeEntryItemIds)) {
                            continue;
                        }

                        $entryDate = is_string($entry->entry_date)
                            ? Carbon::parse($entry->entry_date)
                            : $entry->entry_date;

                        if ($entryDate->format('Y') == $year && $entryDate->format('m') == str_pad($month, 2, '0', STR_PAD_LEFT)) {
                            $value = $entry->credit + $entry->debit;

                            switch ($key) {
                                case 'sales':
                                    $sums[$key] += $entry->credit - $entry->debit;
                                    break;
                                case 'cogs':
                                case 'costs':
                                case 'other_costs':
                                    $sums[$key] += $entry->debit - $entry->credit;
                                    break;
                                case 'revenues':
                                    $sums[$key] += $entry->credit - $entry->debit;
                                    break;
                            }
                        }
                    }
                }
            }
        }

        $laba_kotor = $sums['sales'] - $sums['cogs'];
        $total_biaya = $sums['costs'] + $sums['other_costs'];
        $laba_sebelum_pendapatan = $laba_kotor - $total_biaya;
        $laba_sesudah_pendapatan = $laba_sebelum_pendapatan + $sums['revenues'];

        return [
            'laba_kotor' => $laba_kotor,
            'total_biaya' => $total_biaya,
            'laba_sebelum_pendapatan' => $laba_sebelum_pendapatan,
            'laba_sesudah_pendapatan' => $laba_sesudah_pendapatan,
            'detail' => $sums,
        ];
    }

    public function calculate($location_id, $month, $year)
    {
        $relations = ['ledgers.entry_items'];

        $locationFilter = function ($q) use ($location_id) {
            $q->where('location_id', $location_id);
        };

        $collections = [
            'sales' => Sales::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'cogs' => Cogs::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'costs' => Cost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'other_costs' => OtherCost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'revenues' => Revenue::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
        ];

        $sums = [
            'sales' => 0,
            'cogs' => 0,
            'costs' => 0,
            'other_costs' => 0,
            'revenues' => 0,
        ];
        // return ResponseFormatter::success($collections['sales']);

        foreach ($collections as $key => $items) {
            foreach ($items as $item) {
                foreach ($item->ledgers as $ledger) {
                    foreach ($ledger->entry_items as $entry) {
                        $entryDate = is_string($entry->entry_date)
                            ? Carbon::parse($entry->entry_date)
                            : $entry->entry_date;

                        if ($entryDate->format('Y') == $year && $entryDate->format('m') == str_pad($month, 2, '0', STR_PAD_LEFT)) {
                            switch ($key) {
                                case 'sales':
                                    $sums[$key] += $entry->credit;
                                    $sums[$key] -= $entry->debit;
                                    break;
                                case 'revenues':
                                    $sums[$key] += $entry->credit;
                                    $sums[$key] -= $entry->debit;
                                    break;
                                case 'cogs':
                                case 'costs':
                                case 'other_costs':
                                    $sums[$key] += $entry->debit;
                                    $sums[$key] -= $entry->credit;
                                    break;
                            }
                        }
                    }
                }
            }
        }

        $laba_kotor = $sums['sales'] - $sums['cogs'];
        $total_biaya = $sums['costs'] + $sums['other_costs'];
        $laba_sebelum_pendapatan = $laba_kotor - $total_biaya;
        $laba_sesudah_pendapatan = $laba_sebelum_pendapatan + $sums['revenues'];

        return [
            'laba_kotor' => $laba_kotor,
            'total_biaya' => $total_biaya,
            'laba_sebelum_pendapatan' => $laba_sebelum_pendapatan,
            'laba_sesudah_pendapatan' => $laba_sesudah_pendapatan,
            'detail' => $sums,
        ];
    }
    public function calculatePerYear($location_id, $year)
    {
        $relations = ['ledgers.entry_items'];

        $locationFilter = function ($q) use ($location_id) {
            $q->where('location_id', $location_id);
        };

        $collections = [
            'sales' => Sales::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'cogs' => Cogs::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'costs' => Cost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'other_costs' => OtherCost::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
            'revenues' => Revenue::with($relations)->whereHas('profit_loss', $locationFilter)->get(),
        ];

        $sums = [
            'sales' => 0,
            'cogs' => 0,
            'costs' => 0,
            'other_costs' => 0,
            'revenues' => 0,
        ];

        foreach ($collections as $key => $items) {
            foreach ($items as $item) {
                foreach ($item->ledgers as $ledger) {
                    foreach ($ledger->entry_items as $entry) {
                        $entryDate = is_string($entry->entry_date)
                            ? Carbon::parse($entry->entry_date)
                            : $entry->entry_date;

                        if ($entryDate->format('Y') == $year) {
                            switch ($key) {
                                case 'sales':
                                case 'revenues':
                                    $sums[$key] += $entry->credit;
                                    $sums[$key] -= $entry->debit;
                                    break;
                                case 'cogs':
                                case 'costs':
                                case 'other_costs':
                                    $sums[$key] += $entry->debit;
                                    $sums[$key] -= $entry->credit;
                                    break;
                            }
                        }
                    }
                }
            }
        }

        $laba_kotor = $sums['sales'] - $sums['cogs'];
        $total_biaya = $sums['costs'] + $sums['other_costs'];
        $laba_sebelum_pendapatan = $laba_kotor - $total_biaya;
        $laba_sesudah_pendapatan = $laba_sebelum_pendapatan + $sums['revenues'];

        return [
            'laba_kotor' => $laba_kotor,
            'total_biaya' => $total_biaya,
            'laba_sebelum_pendapatan' => $laba_sebelum_pendapatan,
            'laba_sesudah_pendapatan' => $laba_sesudah_pendapatan,
            'detail' => $sums,
        ];
    }
}

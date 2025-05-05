<?php

namespace App\Http\Controllers;

use App\Models\Cogs;
use App\Models\CogsLedger;
use App\Models\Cost;
use App\Models\CostLedger;
use App\Models\OtherCost;
use App\Models\OtherCostLedger;
use App\Models\ProfitLossStatement;
use App\Models\Revenue;
use App\Models\RevenueLedger;
use App\Models\Sales;
use App\Models\SalesLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProfitLossStatementController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $profit_loss = ProfitLossStatement::with(['location'])
            ->when($q, function ($query) use ($q) {
                $query->where('ledger_code', 'like', '%' . $q . '%');
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Master/ListProfitLoss', compact('profit_loss', 'filters'));
    }

    public function add()
    {
        return Inertia::render('Dashboard/Master/form/ProfitLossForm');
    }

    public function store(Request $request)
    {

        try {
            DB::beginTransaction();
            $user = Auth::user();
            $selectedLocations = $user->locations
                ->firstWhere('pivot.isSelected', true);
            $profit_loss = ProfitLossStatement::where('location_id', $selectedLocations?->id)->first();
            if ($profit_loss) {
                $notification = array(
                    'type' => 'error',
                    'message' => 'Laba Rugi sudah terdaftar'
                );
                return redirect()->back()->with('message',  $notification);
            }

            $validator = Validator::make($request->all(), [
                'sales' => 'required|array',
                'sales.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'costs' => 'required|array',
                'costs.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'other_costs' => 'required|array',
                'other_costs.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'cogs' => 'required|array',
                'cogs.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'revenues' => 'required|array',
                'revenues.*.ledger_id' => 'required|integer|exists:ledgers,id',
            ]);
            $errors = implode(', ', $validator->errors()->all());

            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => $errors
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }

            $sales = $request->input('sales');
            $costs = $request->input('costs');
            $other_costs = $request->input('other_costs');
            $cogs = $request->input('cogs');
            $revenues = $request->input('revenues');

            $profit_losses = ProfitLossStatement::create([
                'location_id' => $selectedLocations->id
            ]);
            if ($sales) {
                $newSale = Sales::create([
                    'profit_loss_statements_id' => $profit_losses->id,
                ]);
                foreach ($sales as $sale) {
                    SalesLedger::create([
                        'sales_id' => $newSale->id,
                        'ledger_id' => $sale['ledger_id'], // pakai array access
                    ]);
                }
            }
            if ($costs) {
                $newCost = Cost::create([
                    'profit_loss_statements_id' => $profit_losses->id,
                ]);
                foreach ($costs as $cost) {
                    CostLedger::create([
                        'cost_id' => $newCost->id,
                        'ledger_id' => $cost['ledger_id'],
                    ]);
                }
            }
            if ($other_costs) {
                $newOtherCost = OtherCost::create([
                    'profit_loss_statements_id' => $profit_losses->id,
                ]);
                foreach ($other_costs as $other_cost) {
                    OtherCostLedger::create([
                        'other_cost_id' => $newOtherCost->id,
                        'ledger_id' => $other_cost['ledger_id'],
                    ]);
                }
            }
            if ($cogs) {
                $newCogs = Cogs::create([
                    'profit_loss_statements_id' => $profit_losses->id,
                ]);
                foreach ($cogs as $cog) {
                    CogsLedger::create([
                        'cogs_id' => $newCogs->id,
                        'ledger_id' => $cog['ledger_id'],
                    ]);
                }
            }
            if ($revenues) {
                $newRevenue = Revenue::create([
                    'profit_loss_statements_id' => $profit_losses->id,
                ]);
                foreach ($revenues as $revenue) {
                    RevenueLedger::create([
                        'revenue_id' => $newRevenue->id,
                        'ledger_id' => $revenue['ledger_id'],
                    ]);
                }
            }
            DB::commit();
            $notification = array(
                'type' => 'success',
                'message' => 'Laba Rugi Ditambahkan'
            );
            return redirect()->intended(route('list.profitloss.statements'))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $selectedLocations = $user->locations
                ->firstWhere('pivot.isSelected', true);

            $validator = Validator::make($request->all(), [
                'sales' => 'required|array',
                'sales.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'costs' => 'required|array',
                'costs.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'other_costs' => 'required|array',
                'other_costs.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'cogs' => 'required|array',
                'cogs.*.ledger_id' => 'required|integer|exists:ledgers,id',
                'revenues' => 'required|array',
                'revenues.*.ledger_id' => 'required|integer|exists:ledgers,id',
            ]);

            $errors = implode(', ', $validator->errors()->all());
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->with('message', [
                    'type' => 'error',
                    'message' => $errors
                ]);
            }

            $profit_losses = ProfitLossStatement::find($id);
            $profit_losses->sale->delete();
            $profit_losses->cost->delete();
            $profit_losses->other_cost->delete();
            $profit_losses->cogs->delete();
            $profit_losses->revenue->delete();
            // Hapus semua relasi lama
            // foreach ($profit_losses->sale as $oldSale) {
            //     $oldSale->delete();
            // }
            // foreach ($profit_losses->cost as $oldCost) {
            //     $oldCost->delete();
            // }
            // foreach ($profit_losses->other_cost as $oldOtherCost) {
            //     $oldOtherCost->delete();
            // }
            // foreach ($profit_losses->cogs as $oldCog) {
            //     $oldCog->delete();
            // }
            // foreach ($profit_losses->revenue as $oldRevenue) {
            //     $oldRevenue->delete();
            // }

            // Simpan data baru
            $newSale = Sales::create([
                'profit_loss_statements_id' => $profit_losses->id,
            ]);
            foreach ($request->sales as $sale) {
                SalesLedger::create([
                    'sales_id' => $newSale->id,
                    'ledger_id' => $sale['ledger_id'],
                ]);
            }

            $newCost = Cost::create([
                'profit_loss_statements_id' => $profit_losses->id,
            ]);
            foreach ($request->costs as $cost) {
                CostLedger::create([
                    'cost_id' => $newCost->id,
                    'ledger_id' => $cost['ledger_id'],
                ]);
            }

            $newOtherCost = OtherCost::create([
                'profit_loss_statements_id' => $profit_losses->id,
            ]);
            foreach ($request->other_costs as $other_cost) {
                OtherCostLedger::create([
                    'other_cost_id' => $newOtherCost->id,
                    'ledger_id' => $other_cost['ledger_id'],
                ]);
            }

            $newCogs = Cogs::create([
                'profit_loss_statements_id' => $profit_losses->id,
            ]);
            foreach ($request->cogs as $cog) {
                CogsLedger::create([
                    'cogs_id' => $newCogs->id,
                    'ledger_id' => $cog['ledger_id'],
                ]);
            }

            $newRevenue = Revenue::create([
                'profit_loss_statements_id' => $profit_losses->id,
            ]);
            foreach ($request->revenues as $revenue) {
                RevenueLedger::create([
                    'revenue_id' => $newRevenue->id,
                    'ledger_id' => $revenue['ledger_id'],
                ]);
            }

            DB::commit();

            return redirect()->intended(route('list.profitloss.statements'))->with('message', [
                'type' => 'success',
                'message' => 'Laba Rugi berhasil diperbarui.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', ['type' => 'error', 'message' => $e->getMessage()]);
        }
    }
    public function show($id)
    {
        $profit_loss = ProfitLossStatement::with(['revenue.ledgers', 'cost.ledgers', 'other_cost.ledgers', 'cogs.ledgers', 'sale.ledgers', 'revenue.ledgers.entry_items'])->find($id);
        return Inertia::render('Dashboard/Master/form/ProfitLossForm', compact('profit_loss'));
    }
    public function delete($id)
    {
        try {
            DB::beginTransaction();

            $profit_losses = ProfitLossStatement::findOrFail($id);
            $profit_losses->sale->delete();
            $profit_losses->cost->delete();
            $profit_losses->other_cost->delete();
            $profit_losses->cogs->delete();
            $profit_losses->revenue->delete();

            $profit_losses->delete();

            DB::commit();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'message' => 'Data berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', [
                'type' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function showProfitLossStatement(Request $request)
    {
        try {
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', [
                'type' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}

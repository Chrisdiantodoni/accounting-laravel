<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\ChildAccount;
use App\Models\Ledger;
use Flasher\Laravel\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LedgerController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');

        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $ledgers = Ledger::with(['location', 'child_account'])
            ->when($q, function ($query) use ($q) {
                $query->where('ledger_code', 'like', '%' . $q . '%')
                    ->orWhere('ledger_name', 'like', '%' . $q . '%');
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        $child_accounts = ChildAccount::with(['location'])->get();
        return Inertia::render('Dashboard/Master/ListLedgers', compact('ledgers', 'filters', 'child_accounts'));
    }

    public function storeLedger(Request $request)
    {
        $user = Auth::user();
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;

        try {

            $validator = Validator::make($request->all(), [
                'ledger_code' => 'required',
                'ledger_name' => 'required',
                'child_account_id' => 'required',
                'balance' => 'required',
                'type_start_balance' => 'required',
                'notes' => 'nullable'
            ]);
            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => "Tambah Akun Ledger Gagal"
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $ledger_code = $request->input('ledger_code');
            $ledger_name = $request->input('ledger_name');
            $child_account_id = $request->input('child_account_id');
            $balance = $request->input('balance');
            $type_start_balance = $request->input('type_start_balance');
            $notes = $request->input('notes');

            DB::beginTransaction();

            $ledgers = Ledger::where('ledger_code', $ledger_code)->where('location_id', $selectedLocationId)->first();
            if ($ledgers) {
                DB::rollBack();
                $notification = [
                    'type' => 'error',
                    'message' => 'Akun Ledger sudah terdaftar',
                ];
            } else {
                Ledger::create([
                    'ledger_code' => $ledger_code,
                    'ledger_name' => $ledger_name,
                    'child_account_id' => $child_account_id,
                    'balance' => $balance,
                    'location_id' => $selectedLocationId,
                    'notes' => $notes,
                    'type_start_balance' => $type_start_balance,
                ]);
                // Menyiapkan notifikasi sukses
                $notification = [
                    'type' => 'success',
                    'message' => 'Akun Ledger ditambahkan',
                ];
                DB::commit();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
        }
        return redirect()->back()->with('message',  $notification);
    }

    public function updateLedger(Request $request, $id)
    {

        $user = Auth::user();
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;

        try {

            $validator = Validator::make($request->all(), [
                'ledger_code' => 'required',
                'ledger_name' => 'required',
                'child_account_id' => 'required',
                'balance' => 'required',
                'type_start_balance' => 'required',
                'notes' => 'nullable'
            ]);
            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => "Edit Akun Ledger Gagal"
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $ledger_code = $request->input('ledger_code');
            $ledger_name = $request->input('ledger_name');
            $child_account_id = $request->input('child_account_id');
            $balance = $request->input('balance');
            $type_start_balance = $request->input('type_start_balance');
            $notes = $request->input('notes');

            DB::beginTransaction();

            $isDuplicate = Ledger::where('ledger_code', $request->ledger_code)
                ->where('id', '!=', $id)->where('location_id', $selectedLocationId)
                ->exists();
            if ($isDuplicate) {
                DB::rollBack();
                $notification = [
                    'type' => 'error',
                    'message' => 'Akun Ledger sudah terdaftar',
                ];
            } else {
                $ledger = Ledger::find($id);

                $ledger->update([
                    'ledger_code' => $ledger_code,
                    'ledger_name' => $ledger_name,
                    'child_account_id' => $child_account_id,
                    'balance' => $balance,
                    'location_id' => $selectedLocationId,
                    'notes' => $notes,
                    'type_start_balance' => $type_start_balance,
                ]);
                // Menyiapkan notifikasi sukses
                $notification = [
                    'type' => 'success',
                    'message' => 'Akun Ledger diedit',
                ];
                DB::commit();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
        }
        return redirect()->back()->with('message',  $notification);
    }

    public function deleteLedgers($id)
    {
        try {
            DB::beginTransaction();
            $ledgers = Ledger::find($id);
            if ($ledgers) {
                $ledgers->delete();
                $notification = array(
                    'type' => 'success',
                    'message' => "Ledger dihapus"
                );
            } else {
                $notification = array(
                    'type' => 'error',
                    'message' => "Ledger tidak ditemukan"
                );
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
        }
        return redirect()->back()->with('message',  $notification);
    }

    public function getLedger(Request $request)
    {

        $user = Auth::user();
        $type = $request->input('type');
        $request->validate([
            'type' => 'in:Neraca,Laba/Rugi'
        ]);

        // return ResponseFormatter::success($user, '');
        $selectedLocations = $user->locations
            ->firstWhere('pivot.isSelected', true);
        try {
            $q = $request->input('q');
            $limit = $request->input('limit') ?? 10;



            $ledgers = Ledger::query()
                ->with(['child_account.parent_account'])
                ->where('location_id', $selectedLocations->id)
                ->when($type, function ($query) use ($type) {
                    $query->whereHas('child_account.parent_account', function ($query) use ($type) {
                        $query->whereIn('id', function ($sub) use ($type) {
                            $sub->select('parent_accounts.id')
                                ->from('parent_accounts')
                                ->join('coa_groups', function ($join) {
                                    $join->on('parent_accounts.parent_account_code', '>=', 'coa_groups.lower_account_code')
                                        ->on('parent_accounts.parent_account_code', '<=', 'coa_groups.upper_account_code');
                                })
                                ->where('coa_groups.group_type', $type);
                        });
                    });
                })
                ->when($q, function ($query) use ($q) {
                    $query->where(function ($subquery) use ($q) {
                        $subquery->where('ledger_name', 'like', '%' . $q . '%')
                            ->orWhere('ledger_code', 'like', '%' . $q . '%');
                    });
                })
                ->paginate($limit);

            return ResponseFormatter::success($ledgers, 'successfully fetch data');

            // return ResponseFormatter::success($ledgers, 'successfully fetch data');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 'Akun Anak Sudah Terdaftar');
        }
    }
}

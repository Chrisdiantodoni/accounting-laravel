<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\ChildAccount;
use App\Models\ParentAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $accounts = ParentAccount::with(['child_accounts', 'child_accounts.location', 'child_accounts.parent_account'])
            ->when($q, function ($query) use ($q) {
                $query->where('parent_account_name', 'like', '%' . $q . '%');
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        $parent_accounts = ParentAccount::all();

        $user = Auth::user();
        $selectedLocations = $user->locations
            ->firstWhere('pivot.isSelected', true);
        return Inertia::render('Dashboard/Master/ListAccounts', compact('accounts', 'filters', 'parent_accounts', 'selectedLocations'));
    }

    public function storeParentAccount(Request $request)
    {


        try {
            $validator = Validator::make($request->all(), [
                'parent_account_code' => 'required|unique:parent_accounts,parent_account_code',
                'parent_account_name' => 'required',
            ]);
            $validator->after(function ($validator) use ($request) {
                $parentCode = $request->input('parent_account_code');

                $groupConflicts = DB::table('coa_groups')
                    ->where('upper_account_code', '>=', $parentCode)
                    ->where('lower_account_code', '<=', $parentCode)
                    ->exists();

                if (!$groupConflicts) {
                    $validator->errors()->add('parent_account_code', 'Kode tidak berada dalam rentang akun manapun.');
                }
            });
            $errors = implode(', ', $validator->errors()->all());
            if ($validator->fails()) {
                $notification = [
                    'type' => 'error',
                    'message' => "Tambah Akun Induk Gagal: " . $errors
                ];
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $parent_account_code = $request->input('parent_account_code');
            $parent_account_name = $request->input('parent_account_name');
            ParentAccount::create([
                'parent_account_code' => $parent_account_code,
                'parent_account_name' => $parent_account_name,
            ]);
            // Menyiapkan notifikasi sukses
            $notification = [
                'type' => 'success',
                'message' => 'Akun Induk ditambahkan',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
        }
        return redirect()->back()->with('message',  $notification);
    }


    public function storeChildAccount(Request $request)
    {
        $user = Auth::user();
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;

        try {
            $validator = Validator::make($request->all(), [
                'child_account_code' => 'required|unique:child_accounts,child_account_code',
                'child_account_name' => 'required',
                'parent_account_id' => 'required',
            ]);

            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => "Tambah Akun Anak Gagal"
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $child_account_code = $request->input('child_account_code');
            $child_account_name = $request->input('child_account_name');
            $parent_account_id = $request->input('parent_account_id');
            ChildAccount::create([
                'child_account_code' => $child_account_code,
                'child_account_name' => $child_account_name,
                'parent_account_id' => $parent_account_id,
                'location_id' => $selectedLocationId,
            ]);
            // Menyiapkan notifikasi sukses
            $notification = [
                'type' => 'success',
                'message' => 'Akun Anak ditambahkan',
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
        }
        return redirect()->back()->with('message',  $notification);
    }

    public function checkDuplicateChildAccount(Request $request)
    {
        try {
            $childAccount = ChildAccount::where('child_account_code', $request->input('child_account_code'))->first();

            if ($childAccount) {
                return ResponseFormatter::error($childAccount, 'Akun Anak Sudah Terdaftar');
            } else {
                return ResponseFormatter::success(null, '');
            }
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 'Akun Anak Sudah Terdaftar');
        }
    }

    public function deleteParents($id)
    {
        try {
            DB::beginTransaction();
            $parentAccounts = ParentAccount::find($id);
            if ($parentAccounts) {
                $parentAccounts->delete();
                $notification = array(
                    'type' => 'success',
                    'message' => "Akun Induk dihapus"
                );
            } else {
                $notification = array(
                    'type' => 'error',
                    'message' => "Akun Induk tidak ditemukan"
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

    public function deleteChilds($id)
    {
        try {
            DB::beginTransaction();
            $childAccounts = ChildAccount::find($id);
            if ($childAccounts) {
                $childAccounts->delete();
                $notification = array(
                    'type' => 'success',
                    'message' => "Akun Anak dihapus"
                );
            } else {
                $notification = array(
                    'type' => 'error',
                    'message' => "Akun Anak tidak ditemukan"
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
}

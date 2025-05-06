<?php

namespace App\Http\Controllers;

use App\Models\CoaGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CoaGroupController extends Controller
{

    public function index(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $coa = CoaGroup::latest()
            ->when($q, function ($query) use ($q) {
                $query->where('group_code', 'like', '%' . $q . '%')
                    ->orWhere('group_code', 'like', '%' . $q . '%')
                    ->orWhere('group_description', 'like', '%' . $q . '%')
                    ->orWhere('group_type', 'like', '%' . $q . '%')
                    ->orWhere('upper_account_code', 'like', '%' . $q . '%')
                    ->orWhere('lower_account_code', 'like', '%' . $q . '%');
            })
            ->paginate($limit);
        // $coa->getCollection()->transform(function ($item) {
        //     $item->parent_accounts = $item->parent_accounts; // panggil accessor manual
        //     return $item;
        // });
        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Master/ListCoa', compact('coa', 'filters'));
    }

    public function storeCoa(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'group_code' => 'required|unique:coa_groups,group_code',
            'group_description' => 'required',
            'group_type' => 'required',
            'upper_account_code' => 'required',
            'lower_account_code' => 'required',
        ]);

        $validator->after(function ($validator) use ($request) {
            $newUpper = $request->upper_account_code;
            $newLower = $request->lower_account_code;

            // Pastikan numerik (atau ubah logika kalau berupa string kode)
            $existingRanges = CoaGroup::all(['upper_account_code', 'lower_account_code']);

            foreach ($existingRanges as $range) {
                if (
                    ($newUpper >= $range->upper_account_code && $newUpper <= $range->lower_account_code) ||
                    ($newLower >= $range->upper_account_code && $newLower <= $range->lower_account_code) ||
                    ($newUpper <= $range->upper_account_code && $newLower >= $range->lower_account_code)
                ) {
                    $validator->errors()->add('upper_account_code', 'Kode akun ini sudah berada dalam rentang group lain.');
                    break;
                }
            }
            if ($request->lower_account_code > $request->upper_account_code) {
                $validator->errors()->add('lower_account_code', 'Kode Akun Bawah tidak boleh lebih tinggi dari Kode Akun Atas');
            } else if ($request->upper_account_code < $request->lower_account_code) {
                $validator->errors()->add('upper_account_code', 'Kode Akun Atas tidak boleh lebih rendah dari Kode Akun Bawah.');
            }
        });

        if ($validator->fails()) {
            $notification = array(
                'type' => 'error',
                'message' => "Tambah Group Perkiraan Gagal"
            );
            return redirect()->back()->withErrors($validator)->with('message',  $notification);
        }
        try {
            DB::beginTransaction();
            $group_code = $request->input('group_code');
            $group_description = $request->input('group_description');
            $group_type = $request->input('group_type');
            $upper_account_code = $request->input('upper_account_code');
            $lower_account_code = $request->input('lower_account_code');

            CoaGroup::create([
                'group_code' => $group_code,
                'group_description' => $group_description,
                'group_type' => $group_type,
                'upper_account_code' => $upper_account_code,
                'lower_account_code' => $lower_account_code,
            ]);

            DB::commit();
            $notification = array(
                'type' => 'success',
                'message' => 'Group Perkiraan Ditambahkan'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
        }
        return redirect()->back()->with('message',  $notification);
    }

    public function deleteCoaGroup($id)
    {
        try {
            DB::beginTransaction();
            $coaGroups = CoaGroup::find($id);
            if ($coaGroups) {
                $coaGroups->delete();
                $notification = array(
                    'type' => 'success',
                    'message' => "Group Perkiraan dihapus"
                );
            } else {
                $notification = array(
                    'type' => 'error',
                    'message' => "Group Perkiraan tidak ditemukan"
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

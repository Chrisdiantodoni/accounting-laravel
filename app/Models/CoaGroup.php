<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoaGroup extends Model
{
    use HasFactory;
    protected $guarded = [];

    // protected $appends = ['parent_accounts'];


    public function getParentAccountsAttribute()
    {
        // Ambil data child account berdasarkan kondisi upper_account_code dan lower_account_code
        $parentAccounts = \App\Models\ParentAccount::with(['child_accounts', 'child_accounts.ledgers'])->where('parent_account_code', '<=', $this->upper_account_code)
            ->where('parent_account_code', '>=', $this->lower_account_code)
            ->get(); // Ambil seluruh data child account

        // Kembalikan hasil sebagai array of arrays (berisi semua kolom dari ChildAccount)
        return $parentAccounts->toArray();
    }
}

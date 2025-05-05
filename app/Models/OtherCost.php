<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtherCost extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function ledgers()
    {
        return $this->belongsToMany(Ledger::class, 'other_cost_ledgers', 'other_cost_id', 'ledger_id');
    }
}

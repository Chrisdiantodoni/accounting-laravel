<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cost extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function ledgers()
    {
        return $this->belongsToMany(Ledger::class, 'cost_ledgers', 'cost_id', 'ledger_id');
    }
    public function profit_loss()
    {
        return $this->belongsTo(ProfitLossStatement::class, 'profit_loss_statements_id');
    }
}

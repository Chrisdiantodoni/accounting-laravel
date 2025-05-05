<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Revenue extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function ledgers()
    {
        return $this->belongsToMany(Ledger::class, 'revenue_ledgers', 'revenue_id', 'ledger_id');
    }

    public function profit_loss()
    {
        return $this->belongsTo(ProfitLossStatement::class, 'profit_loss_statements_id');
    }
}

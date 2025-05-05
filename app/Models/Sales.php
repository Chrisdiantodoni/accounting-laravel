<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sales extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function ledgers()
    {
        return $this->belongsToMany(Ledger::class, 'sales_ledgers', 'sales_id', 'ledger_id');
    }

    public function profit_loss()
    {
        return $this->belongsTo(ProfitLossStatement::class, 'profit_loss_statements_id');
    }
}

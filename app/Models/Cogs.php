<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cogs extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function ledgers()
    {
        return $this->belongsToMany(Ledger::class, 'cogs_ledgers', 'cogs_id', 'ledger_id');
    }
}

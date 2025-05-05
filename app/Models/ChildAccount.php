<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildAccount extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }

    public function parent_account()
    {
        return $this->belongsTo(ParentAccount::class, 'parent_account_id', 'id');
    }

    public function ledgers()
    {
        return $this->hasMany(Ledger::class, 'child_account_id', 'id');
    }
}

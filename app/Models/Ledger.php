<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    use HasFactory;
    protected $guarded = [];



    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }

    public function child_account()
    {
        return $this->belongsTo(ChildAccount::class, 'child_account_id', 'id');
    }

    public function entry_items()
    {
        return $this->hasMany(EntryItems::class, 'ledger_id', 'id');
    }
}

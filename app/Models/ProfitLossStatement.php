<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfitLossStatement extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }

    public function sale()
    {
        return $this->hasOne(Sales::class, 'profit_loss_statements_id');
    }

    public function cogs()
    {
        return $this->hasOne(Cogs::class, 'profit_loss_statements_id');
    }

    public function cost()
    {
        return $this->hasOne(Cost::class, 'profit_loss_statements_id');
    }

    public function revenue()
    {
        return $this->hasOne(Revenue::class, 'profit_loss_statements_id');
    }

    public function other_cost()
    {
        return $this->hasOne(OtherCost::class, 'profit_loss_statements_id');
    }
}

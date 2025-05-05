<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentAccount extends Model
{
    use HasFactory;

    // protected $with = ['child_accounts'];
    protected $guarded = [];
    protected $appends = ['coa_group', 'coa_group_type'];

    public function child_accounts()
    {
        return $this->hasMany(ChildAccount::class, 'parent_account_id', 'id');
    }


    public function getCoaGroupAttribute()
    {
        $group =  CoaGroup::where('upper_account_code', '>=', $this->parent_account_code)
            ->where('lower_account_code', '<=', $this->parent_account_code)
            ->first();
        return $group?->group_description;
    }

    public function getCoaGroupTypeAttribute()
    {
        $group =  CoaGroup::where('upper_account_code', '>=', $this->parent_account_code)
            ->where('lower_account_code', '<=', $this->parent_account_code)
            ->first();
        return $group?->group_type;
    }
}

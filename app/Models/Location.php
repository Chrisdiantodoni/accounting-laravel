<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];


    public function entries()
    {
        return $this->hasMany(Entry::class, 'location_id', 'id'); // sesuaikan model
    }

    public function closing_books()
    {
        return $this->belongsTo(Closing::class, 'location_id', 'id');
    }
}

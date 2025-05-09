<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LocationByUser extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];
    public $incrementing = false; // <- penting
    protected $keyType = 'string'; // <- karena UUID
    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }
}

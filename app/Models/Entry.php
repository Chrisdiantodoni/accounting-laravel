<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $with = ['location', 'entry_items', 'entry_logs', 'user'];

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }

    public function entry_items()
    {
        return $this->hasMany(EntryItems::class, 'entries_id', 'id');
    }

    public function entry_logs()
    {
        return $this->hasMany(EntryLog::class, 'entries_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function user_edit()
    {
        return $this->belongsTo(User::class, 'user_edit_id', 'user_id');
    }
    public function user_posting()
    {
        return $this->belongsTo(User::class, 'user_posting_id', 'user_id');
    }
}

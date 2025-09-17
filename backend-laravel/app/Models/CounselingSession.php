<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CounselingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
        'counselor_id',
        'type',
        'status',
        'messages',
        'escalation_reason',
        'started_at',
        'ended_at',
        'rating',
        'feedback'
    ];

    protected $casts = [
        'messages' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'rating' => 'integer'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeUnclaimed($query)
    {
        return $query->where('status', 'escalated')
                    ->whereNull('counselor_id');
    }

    // Helper methods
    public function isActive()
    {
        return $this->status === 'open';
    }

    public function isEscalated()
    {
        return $this->status === 'escalated';
    }

    public function isClosed()
    {
        return $this->status === 'closed';
    }

    public function getDurationAttribute()
    {
        if (!$this->started_at) return null;
        
        $end = $this->ended_at ?? now();
        return $this->started_at->diffInMinutes($end);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CounselingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'session_type',
        'messages',
        'status',
        'assigned_staff_id',
        'escalated_at',
        'escalation_reason',
        'consent_given_at'
    ];

    protected function casts(): array
    {
        return [
            'messages' => 'array',
            'escalated_at' => 'datetime',
            'consent_given_at' => 'datetime'
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($session) {
            if (empty($session->session_id)) {
                $session->session_id = 'session_' . uniqid() . '_' . time();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedStaff()
    {
        return $this->belongsTo(User::class, 'assigned_staff_id');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeEscalated($query)
    {
        return $query->where('status', 'escalated');
    }

    public function scopeChatbot($query)
    {
        return $query->where('session_type', 'chatbot');
    }

    public function scopeHumanHandover($query)
    {
        return $query->where('session_type', 'human_handover');
    }

    public function scopeAssignedTo($query, $staffId)
    {
        return $query->where('assigned_staff_id', $staffId);
    }

    // Helper methods
    public function addMessage($message, $sender = 'user', $metadata = [])
    {
        $messages = $this->messages ?? [];
        
        $messages[] = [
            'id' => uniqid(),
            'message' => $message,
            'sender' => $sender, // 'user', 'bot', 'staff'
            'timestamp' => now()->toISOString(),
            'metadata' => $metadata
        ];

        $this->update(['messages' => $messages]);
    }

    public function escalateToHuman($reason = null, $staffId = null)
    {
        $this->update([
            'status' => 'escalated',
            'session_type' => 'human_handover',
            'escalated_at' => now(),
            'escalation_reason' => $reason,
            'assigned_staff_id' => $staffId
        ]);
    }

    public function assignToStaff($staffId)
    {
        $this->update(['assigned_staff_id' => $staffId]);
    }

    public function close()
    {
        $this->update(['status' => 'closed']);
    }

    public function getLastMessage()
    {
        $messages = $this->messages ?? [];
        return end($messages);
    }

    public function getMessageCount()
    {
        return count($this->messages ?? []);
    }
}
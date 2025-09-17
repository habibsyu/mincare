<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assessment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'questions',
        'answers',
        'score',
        'result_label',
        'recommendations',
        'consent_given',
        'consent_timestamp',
        'ip_address',
        'user_agent',
        'session_id'
    ];

    protected $casts = [
        'questions' => 'array',
        'answers' => 'array',
        'recommendations' => 'array',
        'consent_given' => 'boolean',
        'consent_timestamp' => 'datetime',
        'score' => 'integer'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Helper methods
    public function getScoreInterpretation()
    {
        $ranges = config('assessments.score_ranges.' . str_replace('-', '', $this->type));
        
        if (!$ranges) {
            return ['label' => 'Unknown', 'color' => 'gray'];
        }

        foreach ($ranges as $range) {
            if ($this->score >= $range['min'] && $this->score <= $range['max']) {
                return $range;
            }
        }

        return ['label' => 'Unknown', 'color' => 'gray'];
    }

    public function isAnonymous()
    {
        return is_null($this->user_id);
    }
}
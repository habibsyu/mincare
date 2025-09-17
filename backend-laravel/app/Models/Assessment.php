<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'raw_answers',
        'score',
        'result_label',
        'recommendations',
        'consent_given_at',
        'anonymous_session_id'
    ];

    protected function casts(): array
    {
        return [
            'recommendations' => 'array',
            'consent_given_at' => 'datetime',
            'score' => 'decimal:2'
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor for decrypted answers (use carefully)
    public function getDecryptedAnswersAttribute()
    {
        try {
            return json_decode(decrypt($this->raw_answers), true);
        } catch (\Exception $e) {
            return null;
        }
    }

    // Scope for anonymous assessments
    public function scopeAnonymous($query)
    {
        return $query->whereNull('user_id')->whereNotNull('anonymous_session_id');
    }

    // Scope for authenticated assessments
    public function scopeAuthenticated($query)
    {
        return $query->whereNotNull('user_id');
    }

    // Scope by type
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Scope by date range
    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}
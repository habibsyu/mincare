<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform',
        'url',
        'title',
        'description',
        'is_active',
        'sort_order'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ];
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    public function scopePlatform($query, $platform)
    {
        return $query->where('platform', $platform);
    }

    // Helper methods
    public function getPlatformIcon()
    {
        return match($this->platform) {
            'discord' => '🎮',
            'telegram' => '✈️',
            'whatsapp' => '📱',
            default => '🌐'
        };
    }

    public function getPlatformColor()
    {
        return match($this->platform) {
            'discord' => '#5865F2',
            'telegram' => '#0088CC',
            'whatsapp' => '#25D366',
            default => '#6B7280'
        };
    }
}
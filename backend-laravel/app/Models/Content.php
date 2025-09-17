<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'body',
        'meta',
        'video_url',
        'thumbnail_path',
        'author_id',
        'status',
        'views_count',
        'likes_count'
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'views_count' => 'integer',
            'likes_count' => 'integer'
        ];
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    // Helper methods
    public function isPublished()
    {
        return $this->status === 'published';
    }

    public function getTags()
    {
        return $this->meta['tags'] ?? [];
    }

    public function getCategory()
    {
        return $this->meta['category'] ?? null;
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function incrementLikes()
    {
        $this->increment('likes_count');
    }
}
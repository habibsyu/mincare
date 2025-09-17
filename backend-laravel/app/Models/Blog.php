<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'body',
        'tags',
        'seo_meta',
        'author_id',
        'status',
        'published_at',
        'views_count'
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'seo_meta' => 'array',
            'published_at' => 'datetime',
            'views_count' => 'integer'
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
                
                // Ensure unique slug
                $count = static::where('slug', 'LIKE', $blog->slug . '%')->count();
                if ($count > 0) {
                    $blog->slug = $blog->slug . '-' . ($count + 1);
                }
            }
        });
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    public function scopeWithTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    // Helper methods
    public function isPublished()
    {
        return $this->status === 'published' && $this->published_at !== null;
    }

    public function publish()
    {
        $this->update([
            'status' => 'published',
            'published_at' => now()
        ]);
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function getExcerpt($length = 150)
    {
        return Str::limit(strip_tags($this->body), $length);
    }
}
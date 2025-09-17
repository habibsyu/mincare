<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'date_of_birth',
        'gender',
        'is_active',
        'last_login_at',
        'email_verified_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'name' => $this->name,
            'email' => $this->email
        ];
    }

    // Relationships
    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function contents()
    {
        return $this->hasMany(Content::class, 'author_id');
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class, 'author_id');
    }

    public function counselingSessions()
    {
        return $this->hasMany(CounselingSession::class);
    }

    public function claimedSessions()
    {
        return $this->hasMany(CounselingSession::class, 'counselor_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    // Helper methods
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isStaff()
    {
        return in_array($this->role, ['admin', 'staff']);
    }

    public function isPsychologist()
    {
        return $this->role === 'psikolog';
    }

    public function canManageContent()
    {
        return in_array($this->role, ['admin', 'staff']);
    }

    public function canAccessCounseling()
    {
        return in_array($this->role, ['admin', 'psikolog']);
    }
}
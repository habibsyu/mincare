<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'is_anonymous',
        'is_active',
        'last_login_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_anonymous' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    // JWT methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'name' => $this->name
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

    public function assignedSessions()
    {
        return $this->hasMany(CounselingSession::class, 'assigned_staff_id');
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
}
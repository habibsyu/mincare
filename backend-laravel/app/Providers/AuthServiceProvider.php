<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for role-based access
        Gate::define('admin-access', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('staff-access', function ($user) {
            return in_array($user->role, ['admin', 'staff']);
        });

        Gate::define('psikolog-access', function ($user) {
            return in_array($user->role, ['admin', 'staff', 'psikolog']);
        });
    }
}
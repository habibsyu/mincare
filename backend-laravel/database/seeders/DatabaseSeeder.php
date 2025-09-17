<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@mindcare.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Staff User
        User::firstOrCreate(
            ['email' => 'staff@mindcare.com'],
            [
                'name' => 'Content Staff',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
                'email_verified_at' => now(),
            ]
        );

        // Create Psychologist User
        User::firstOrCreate(
            ['email' => 'psikolog@mindcare.com'],
            [
                'name' => 'Dr. Jane Smith',
                'password' => Hash::make('psikolog123'),
                'role' => 'psikolog',
                'email_verified_at' => now(),
            ]
        );

        // Create Test User
        User::firstOrCreate(
            ['email' => 'user@mindcare.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            ContentSeeder::class,
            CommunityLinkSeeder::class,
        ]);
    }
}
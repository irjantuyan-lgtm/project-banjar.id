<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Menciptakan akun Super Admin Utama
        User::create([
            'name' => 'Super Admin',
            'username' => 'superadmin1',
            'email' => 'superadmin1@gmail.com',
            'password' => Hash::make('superadmin1234'), // Password otomatis diacak (Bcrypt)
            'role' => 'super_admin',
        ]);
    }
}
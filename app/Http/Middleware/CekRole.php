<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // <-- Ini kunci agar VS Code tidak bingung

class CekRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Cek apakah user sudah login atau belum menggunakan Facade Auth
        if (!Auth::check()) {
            return redirect('/login');
        }

        // 2. Ambil data user yang sedang login
        $user = Auth::user();

        // 3. Cek apakah role user ada di dalam daftar role yang diizinkan (...$roles)
        if (in_array($user->role, $roles)) {
            return $next($request); // Lolos! Silakan masuk ke halaman
        }

        // 4. Jika tidak punya akses, tendang kembali ke halaman Beranda
        return redirect('/')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Banjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class BanjarController
{
    public function index() {
        return Banjar::all();
    }

    public function show($id) {
        return Banjar::findOrFail($id);
    }

    public function login(Request $request) {
        // 1. Ambil email dan password dari form (hiraukan data role yang ikut terkirim)
        $credentials = $request->only('email', 'password');

        // 2. Coba cocokkan dengan data di database
        if (Auth::attempt($credentials, true)) {
            
            // Jika password benar, buatkan sesi baru agar aman
            $request->session()->regenerate();
            
            // Ambil data user yang berhasil login
            $user = Auth::user();

            // 3. Cek jabatannya (role) untuk diarahkan ke pintu yang tepat
            // Catatan: Pastikan penulisan role di sini sama persis dengan yang ada di database Anda
            if ($user->role === 'super_admin') {
                return redirect()->intended('/superadmin/dashboard');
            } elseif ($user->role === 'admin_banjar') {
                return redirect()->intended('/admin/dashboard');
            } else {
                return redirect()->intended('/'); // Warga biasa ke halaman depan
            }
        }

        // 4. Jika email/password salah, kembalikan ke form login dengan pesan error
        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ]);
        
        }

    public function register(Request $request) {
        // 1. Validasi data dari form React
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:warga,admin_banjar' // Sesuai instruksi agar bisa pilih jabatan
        ]);

        // 2. Simpan ke database sesuai role yang dipilih di form
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'role' => $request->role,
        ]);

        // 3. Loginkan otomatis setelah sukses mendaftar
        Auth::login($user);

        // 4. Arahkan ke halaman yang sesuai
        if ($user->role === 'admin_banjar') {
            return redirect('/admin/dashboard');
        } else {
            return redirect('/');
        }
    }
}
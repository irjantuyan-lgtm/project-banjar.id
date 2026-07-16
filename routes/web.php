<?php

use App\Http\Controllers\BanjarController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; // Tambahan Facade Auth agar VS Code tidak merah
use Inertia\Inertia;
use App\Models\Banjar;
use App\Models\Kegiatan;
use App\Models\Umkm;
use App\Models\User;

// ==========================================
// 1. JALUR HALAMAN PUBLIK
// ==========================================
Route::get('/', function () {
    return Inertia::render('publik/Home');
});
Route::get('/cari', function () {
    return Inertia::render('publik/Cari');
});
Route::get('/peta', function () {
    return Inertia::render('publik/Peta');
});
Route::get('/banjar/{id}', function ($id) {
    // Mengirim ID dari URL ke halaman BanjarProfile
    return Inertia::render('publik/BanjarProfile', ['id' => $id]);
});

// ==========================================
// 2. JALUR HALAMAN AUTH (LOGIN & REGISTER)
// ==========================================
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::post('/login', [BanjarController::class, 'login']);

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');
Route::post('/register', [BanjarController::class, 'register']);

// ==========================================
// 3. JALUR HALAMAN ADMIN BANJAR (Hanya untuk admin_banjar)
// ==========================================
Route::middleware(['auth', 'role:admin_banjar'])->prefix('admin')->group(function () {
    
    Route::get('/dashboard', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Cari data banjar berdasarkan ID admin yang login
        $banjar = Banjar::where('admin_id', $user->id)->first();

        // Lempar ke halaman profil jika data banjar belum ada
        if (!$banjar) {
            return redirect('/admin/profil')->with('error', 'Silakan lengkapi profil banjar Anda terlebih dahulu.');
        }

        // Ambil 5 kegiatan terbaru
        $kegiatan = Kegiatan::where('banjar_id', $banjar->id)
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();

        $totalUmkm = Umkm::where('banjar_id', $banjar->id)->count();

        return Inertia::render('admin/Dashboard', [
            'banjar' => [
                'adminName' => $user->name, 
                'name'      => $banjar->nama_banjar, 
                'members'   => $banjar->jumlah_kk,
                'umkm'      => $totalUmkm,
                'views'     => $banjar->total_views,
                'kegiatan'  => $kegiatan
            ]
        ]); 
    });

    Route::get('/profil', function () { return Inertia::render('admin/Profil'); });
    Route::get('/konten', function () { return Inertia::render('admin/Konten'); });
    Route::get('/peta', function () { return Inertia::render('admin/PetaAdmin'); });
    Route::get('/submit', function () { return Inertia::render('admin/Submit'); });
    Route::get('/password', function () { return Inertia::render('admin/Password'); });
});

// ==========================================
// 4. JALUR HALAMAN SUPER ADMIN (Hanya untuk super_admin)
// ==========================================
Route::middleware(['auth', 'role:super_admin'])->prefix('superadmin')->group(function () {
    
    Route::get('/dashboard', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Hitung statistik keseluruhan
        $totalBanjar = Banjar::count();
        $menungguModerasi = Banjar::where('status', 'pending')->count(); 
        $totalAdmin = User::where('role', 'admin_banjar')->count();
        $totalKegiatan = Kegiatan::count();

        // Tarik 5 data pendaftaran banjar terbaru yang butuh moderasi
        $pendaftaranBaru = Banjar::where('status', 'pending')
                                 ->with('admin') // Relasi ke tabel users
                                 ->orderBy('created_at', 'desc')
                                 ->take(5)
                                 ->get();

        return Inertia::render('superadmin/Dashboard', [
            'superadminName' => $user->name, 
            'statistik' => [
                'total_banjar' => $totalBanjar,
                'menunggu_moderasi' => $menungguModerasi,
                'total_admin' => $totalAdmin,
                'total_kegiatan' => $totalKegiatan,
            ],
            'pendaftaran_baru' => $pendaftaranBaru 
        ]); 
    });

    Route::get('/moderasi', function () { return Inertia::render('superadmin/Moderasi'); });
    Route::get('/pantau', function () { return Inertia::render('superadmin/Pantau'); });
    Route::get('/statistik', function () { return Inertia::render('superadmin/Statistik'); });
    Route::get('/buat-banjar', function () { return Inertia::render('superadmin/BuatBanjar'); });
});
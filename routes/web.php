<?php

use App\Http\Controllers\BanjarController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; // Tambahan Facade Auth agar VS Code tidak merah
use Inertia\Inertia;
use App\Models\Banjar;
use App\Models\Kegiatan;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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
// 2. JALUR HALAMAN AUTH (LOGIN, LOGOUT, & REGISTER)
// ==========================================
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::post('/login', [BanjarController::class, 'login']);

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');
Route::post('/register', [BanjarController::class, 'register']);

Route::post('/logout', [BanjarController::class, 'logout'])->name('logout');

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
        $kegiatan = Kegiatan::where('id_banjar', $banjar->id)
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();

        $totalUmkm = Umkm::where('id_banjar', $banjar->id)->count();

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

    // ------------------------------------------
    // MODUL BARU: MANAJEMEN KRAMA (WARGA)
    // ------------------------------------------
    Route::get('/warga', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $banjar = Banjar::where('admin_id', $user->id)->first();

        if (!$banjar) {
            return redirect('/admin/profil')->with('error', 'Silakan lengkapi profil banjar Anda terlebih dahulu.');
        }

        // Tarik data pengguna (warga) yang terdaftar di banjar ini. 
        // Menggunakan $banjar->id_banjar atau $banjar->id menyesuaikan primary key.
        // Mengecualikan admin itu sendiri dari daftar warga.
        $daftarWarga = User::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                           ->where('id', '!=', $user->id) 
                           ->get();

        return Inertia::render('admin/Warga', [
            'banjar' => [
                // Menarik data kode_verivikasi dari DB dengan ejaan "v" sesuai struktur Anda,
                // lalu mengirimkannya ke React dengan nama variabel "kode_verifikasi" (pakai f)
                'kode_verifikasi' => $banjar->kode_verivikasi ?? 'BELUM-DISET' 
            ],
            'warga' => $daftarWarga
        ]); 
    });

   // ------------------------------------------
    // MODUL PROFIL BANJAR
    // ------------------------------------------
    // 1. Menampilkan Halaman Profil beserta isinya
    Route::get('/profil', function () { 
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->first();

        // Kita ubah (map) nama kolom DB agar sesuai dengan variabel form di React Anda
        $banjarData = $banjar ? [
            'name'      => $banjar->nama_banjar,
            'deskripsi' => $banjar->deskripsi,
            'phone'     => $banjar->no_wa_pengelola,
            'email'     => $user->email, // Email diambil dari tabel users
            'adminName' => $user->name,  // Nama admin diambil dari tabel users
            'negara'    => $banjar->negara,
            'provinsi'  => $banjar->provinsi,
            'kota'      => $banjar->kota,
        ] : null;

        return Inertia::render('admin/Profil', [
            'banjar' => $banjarData
        ]); 
    });

    // 2. Menyimpan/Memperbarui Data Profil ke Database
    Route::patch('/profil/update', function (\Illuminate\Http\Request $request) {
        // 1. Tambahkan "komentar ajaib" ini agar VS Code tahu ini Model User
        /** @var \App\Models\User $user */
        $user = Auth::user();

        Banjar::updateOrCreate(
            ['admin_id' => $user->id], 
            [
                'nama_banjar'     => $request->name,
                'deskripsi'       => $request->deskripsi,
                'no_wa_pengelola' => $request->phone,
                'negara'          => $request->negara,
                'provinsi'        => $request->provinsi,
                'kota'            => $request->kota,
                
                // 2. Hapus tanda \ di depan DB::raw
                'status_akun'     => DB::raw('COALESCE(status_akun, "pending")'),
                'kode_verifikasi' => DB::raw('COALESCE(kode_verifikasi, SUBSTRING(MD5(RAND()), 1, 6))'),
            ]
        );

        if ($request->adminName || $request->email) {
            $user->update([
                'name'  => $request->adminName ?? $user->name,
                'email' => $request->email ?? $user->email,
            ]);
        }

        return redirect()->back();
    });
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
        
        // PERBAIKAN: Ubah 'status' menjadi 'status_akun' sesuai DB Anda
        $menungguModerasi = Banjar::where('status_akun', 'pending')->count(); 
        
        $totalAdmin = User::where('role', 'admin_banjar')->count();
        
        // Asumsi tabel Kegiatan sudah ada. Kalau belum, kita amankan dengan try-catch
        try {
            $totalKegiatan = Kegiatan::count();
        } catch (\Exception $e) {
            $totalKegiatan = 0;
        }

        // PERBAIKAN: Ubah 'status' menjadi 'status_akun'
        // Tarik 5 data pendaftaran banjar terbaru yang butuh moderasi
        $pendaftaranBaru = Banjar::where('status_akun', 'pending')
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
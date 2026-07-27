<?php

use App\Http\Controllers\BanjarController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Banjar;
use App\Models\Kegiatan;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

// --- HALAMAN BERANDA (HOME) ---
Route::get('/', function () {
    // 1. Ambil data statistik riil dari database
    $totalBanjar = Banjar::where('status_akun', 'aktif')->count();
    $kegiatanAktif = Kegiatan::where('status_moderasi', 'approved')->count();
    $totalUmkm = Umkm::where('status_moderasi', 'approved')->count();
    
    // Hitung jumlah kabupaten/kota yang berbeda (unik) yang sudah terdaftar
    $totalKabupaten = Banjar::where('status_akun', 'aktif')
                            ->whereNotNull('kota')
                            ->distinct('kota')
                            ->count('kota');

    // 2. Ambil 3 Banjar Unggulan (Berdasarkan jumlah views terbanyak)
    $banjarUnggulan = Banjar::where('status_akun', 'aktif')
                            ->orderBy('total_views', 'desc')
                            ->take(3)
                            ->get()
                            ->map(function($b) {
                                // Hitung rata-rata rating asli
                                $rating = $b->jumlah_perating > 0 
                                          ? round($b->total_bintang / $b->jumlah_perating, 1) 
                                          : 0;

                                return [
                                    'id' => $b->id_banjar ?? $b->id,
                                    'name' => $b->nama_banjar,
                                    'kecamatan' => $b->kecamatan ?? 'Bali', // Fallback jika kosong
                                    'kabupaten' => $b->kota ?? 'Indonesia',
                                   'img' => $b->foto_profil ? asset('storage/' . $b->foto_profil) : null, 
                                    'members' => $b->jumlah_kk ?? 0,
                                    'umkm' => Umkm::where('id_banjar', $b->id_banjar ?? $b->id)->where('status_moderasi', 'approved')->count(),
                                    'views' => $b->total_views ?? 0,
                                    'likes' => $b->total_likes ?? 0,
                                    'rating' => $rating, // Sekarang Bintangnya 100% dari Database
                                    'tags' => ['Terverifikasi'],
                                    'phone' => $b->no_wa_pengelola ?? ''
                                ];
                            });

    // 3. Ambil 1 Banjar untuk ditampilkan di Card Preview (Melayang)
    $banjarPreview = $banjarUnggulan->first();

    return Inertia::render('publik/Home', [
        'statistik' => [
            'banjar' => $totalBanjar,
            'kegiatan' => $kegiatanAktif,
            'umkm' => $totalUmkm,
            'kabupaten' => $totalKabupaten
        ],
        'banjarUnggulan' => $banjarUnggulan,
        'banjarPreview' => $banjarPreview
    ]);
});

// --- PROSES KLIK TOMBOL LIKE (HATI) ---
Route::post('/banjar/{id}/like', function ($id) {
    $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
    
    // Tambah 1 ke kolom total_likes
    $banjar->increment('total_likes');
    
    return back(); 
});

// --- PROSES SUBMIT RATING BINTANG 1-5 ---
Route::post('/banjar/{id}/rating', function (Request $request, $id) {
    // Validasi agar bintang yang dikirim hanya bernilai 1 sampai 5
    $request->validate([
        'bintang' => 'required|integer|min:1|max:5' 
    ]);

    $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
    
    // Tambahkan nilai bintang yang dikirim ke total_bintang
    $banjar->increment('total_bintang', $request->bintang);
    // Tambah 1 ke jumlah orang yang merating
    $banjar->increment('jumlah_perating');
    
    return back();
});

// --- HALAMAN PROFIL BANJAR (DETAIL) ---
Route::get('/banjar/{id}', function ($id) {
    $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
    
    // 1. LOGIKA VIEWS (Anti-Spam)
    $sessionView = 'view_banjar_' . $id;
    if (!session()->has($sessionView)) {
        $banjar->increment('total_views');
        session()->put($sessionView, true);
    }
    
    // Hitung rata-rata rating
    $rata_rata = $banjar->jumlah_perating > 0 
                 ? round($banjar->total_bintang / $banjar->jumlah_perating, 1) 
                 : 0;
    
    // Ambil data kegiatan
    $kegiatan = Kegiatan::where('id_banjar', $id)
                        ->where('status_moderasi', 'approved')
                        ->orderBy('created_at', 'desc')
                        ->get()
                        ->map(function($k) {
                            return [
                                'id_kegiatan'      => $k->id_kegiatan ?? $k->id,
                                'nama_kegiatan'    => $k->nama_kegiatan ?? $k->judul_kegiatan ?? 'Tanpa Judul',
                                'tanggal_kegiatan' => $k->tanggal_kegiatan ?? $k->tanggal ?? $k->created_at,
                                'deskripsi'        => $k->deskripsi ?? $k->deskripsi_kegiatan ?? '',
                                'no_wa_panitia'    => $k->no_wa_panitia ?? $k->no_wa ?? $k->telepon ?? '',
                            ];
                        });
    
    // Ambil data UMKM
    $umkm = Umkm::where('id_banjar', $id)
                ->where('status_moderasi', 'approved')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($u) {
                    return [
                        'id_umkm'          => $u->id_umkm ?? $u->id,
                        'nama_usaha'       => $u->nama_usaha ?? $u->nama_umkm,
                        'deskripsi_produk' => $u->deskripsi_produk ?? $u->deskripsi,
                        'harga'            => $u->harga,
                        'no_wa_penjual'    => $u->no_wa_penjual ?? $u->no_wa ?? $u->telepon ?? '',
                        'foto_url'         => $u->foto ? asset('storage/' . $u->foto) : null,
                    ];
                });

    $banjar->foto_url = $banjar->foto_profil ? asset('storage/' . $banjar->foto_profil) : null;
    
    return Inertia::render('publik/BanjarProfile', [
        'banjar' => $banjar,
        'rating' => $rata_rata, 
        'kegiatan' => $kegiatan,
        'umkm' => $umkm,
        // PENTING: Kirim info ke React apakah browser ini sudah pernah Like & Rating
        'hasLiked' => session()->has('like_banjar_' . $id),
        'hasRated' => session()->has('rating_banjar_' . $id)
    ]);
});

// --- PROSES KLIK TOMBOL LIKE (Bisa Batal Suka / Unlike) ---
Route::post('/banjar/{id}/like', function ($id) {
    $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
    $sessionKey = 'like_banjar_' . $id;
    
    if (session()->has($sessionKey)) {
        // Jika sebelumnya sudah klik Love, kurangi (Unlike)
        if ($banjar->total_likes > 0) {
            $banjar->decrement('total_likes');
        }
        session()->forget($sessionKey);
    } else {
        // Jika belum, tambahkan Love
        $banjar->increment('total_likes');
        session()->put($sessionKey, true);
    }
    
    return back(); 
});

// --- PROSES SUBMIT RATING BINTANG 1-5 (Anti-Spam) ---
Route::post('/banjar/{id}/rating', function (Request $request, $id) {
    $sessionKey = 'rating_banjar_' . $id;

    // Cek apakah browser ini sudah pernah memberi rating
    if (session()->has($sessionKey)) {
        return back()->withErrors(['rating' => 'Anda sudah memberikan penilaian untuk banjar ini.']);
    }

    $request->validate([
        'bintang' => 'required|integer|min:1|max:5' 
    ]);

    $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
    
    $banjar->increment('total_bintang', $request->bintang);
    $banjar->increment('jumlah_perating');
    
    // Kunci browser agar tidak bisa rating lagi
    session()->put($sessionKey, true);
    
    return back();
});

// --- HALAMAN PENCARIAN BANJAR ---
Route::get('/cari', function (\Illuminate\Http\Request $request) {
    // Ambil semua banjar yang aktif
    $banjars = \App\Models\Banjar::where('status_akun', 'aktif')->get()->map(function($b) {
        // Hitung rata-rata rating
        $rating = $b->jumlah_perating > 0 
                  ? round($b->total_bintang / $b->jumlah_perating, 1) 
                  : 0;

        return [
            'id' => $b->id_banjar ?? $b->id,
            'nama_banjar' => $b->nama_banjar,
            'kecamatan' => $b->kecamatan ?? '-',
            'kota' => $b->kota ?? '-',
            'provinsi' => $b->provinsi ?? '-',
            'negara' => $b->negara ?? 'Indonesia',
            'foto_url' => $b->foto_profil ? asset('storage/' . $b->foto_profil) : null,
            'jumlah_kk' => $b->jumlah_kk ?? 0,
            'umkm' => \App\Models\Umkm::where('id_banjar', $b->id_banjar ?? $b->id)->where('status_moderasi', 'approved')->count(),
            'total_views' => $b->total_views ?? 0,
            'total_likes' => $b->total_likes ?? 0,
            'rating' => $rating,
            'phone' => $b->no_wa_pengelola ?? ''
        ];
    });

    return Inertia::render('publik/Cari', [
        'banjarsData' => $banjars
    ]);
});

// --- HALAMAN PETA GLOBAL ---
Route::get('/peta', function (\Illuminate\Http\Request $request) {
    // Ambil data banjar yang aktif dan memiliki koordinat peta
    $banjars = \App\Models\Banjar::where('status_akun', 'aktif')
                                 ->whereNotNull('latitude')
                                 ->whereNotNull('longitude')
                                 ->get()
                                 ->map(function($b) {
                                     // Hitung rating
                                     $rating = $b->jumlah_perating > 0 
                                               ? round($b->total_bintang / $b->jumlah_perating, 1) 
                                               : 0;

                                     return [
                                         'id' => $b->id_banjar ?? $b->id,
                                         'nama_banjar' => $b->nama_banjar,
                                         'kecamatan' => $b->kecamatan ?? '-',
                                         'kota' => $b->kota ?? '-',
                                         'provinsi' => $b->provinsi ?? '-',
                                         'negara' => $b->negara ?? 'Indonesia',
                                         'lat' => (float) $b->latitude,
                                         'lng' => (float) $b->longitude,
                                         'foto_url' => $b->foto_profil ? asset('storage/' . $b->foto_profil) : null,
                                         'jumlah_kk' => $b->jumlah_kk ?? 0,
                                         'rating' => $rating
                                     ];
                                 });

    return Inertia::render('publik/Peta', [
        'banjarsData' => $banjars,
        'queryKota' => $request->query('kota') // Tangkap parameter dari URL profil banjar
    ]);
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
    
    // DASHBOARD
    Route::get('/dashboard', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $banjar = Banjar::where('admin_id', $user->id)->first();

        if (!$banjar) {
            return redirect('/admin/profil')->with('error', 'Silakan lengkapi profil banjar Anda terlebih dahulu.');
        }

        $kegiatan = Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();

        $totalUmkm = Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)->count();

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

   // MANAJEMEN WARGA (Dengan Fitur Auto-Rotate Kode Verifikasi)
    Route::get('/warga', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $banjar = Banjar::where('admin_id', $user->id)->first();

        if (!$banjar) {
            return redirect('/admin/profil')->with('error', 'Silakan lengkapi profil banjar Anda terlebih dahulu.');
        }

        // Tentukan durasi rotasi otomatis (contoh: 5 menit atau 10 menit)
        $durasiMenit = 5; 

        // Gunakan Laravel Cache untuk mengunci kode selama waktu yang ditentukan
        $cacheKey = 'kode_banjar_' . ($banjar->id_banjar ?? $banjar->id);
        $kodeSekarang = Illuminate\Support\Facades\Cache::remember($cacheKey, now()->addMinutes($durasiMenit), function () use ($banjar) {
            // Logika di sini HANYA berjalan jika waktu cache habis (setiap 5/10 menit)
            // Mengacak 6 karakter unik perpaduan huruf & angka kapital
            $kodeBaru = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
            
            // Perbarui kode verifikasi baru ke database banjar
            $banjar->update(['kode_verifikasi' => $kodeBaru]);
            
            return $kodeBaru;
        });

        $daftarWarga = User::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                           ->where('id', '!=', $user->id) 
                           ->get();

        return Inertia::render('admin/Warga', [
            'banjar' => [
                // DIPERBAIKI: Menggunakan variabel cache dan memperbaiki typo 'kode_verivikasi' menjadi 'kode_verifikasi'
                'kode_verifikasi' => $kodeSekarang 
            ],
            'warga' => $daftarWarga
        ]); 
    });

 // PROFIL BANJAR
    Route::get('/profil', function () { 
        $user = Auth::user();
        $banjar = App\Models\Banjar::where('admin_id', $user->id)->first();

        $banjarData = $banjar ? [
            'name'      => $banjar->nama_banjar,
            'deskripsi' => $banjar->deskripsi,
            'phone'     => $banjar->no_wa_pengelola,
            'email'     => $user->email, 
            'adminName' => $user->name,  
            'negara'    => $banjar->negara,
            'provinsi'  => $banjar->provinsi,
            'kota'      => $banjar->kota,
            // TAMBAHAN: Kirim juga data fotonya ke React agar bisa ditampilkan
            'foto_url'  => $banjar->foto_profil ? asset('storage/' . $banjar->foto_profil) : null
        ] : null;

        return Inertia::render('admin/Profil', [
            'banjar' => $banjarData
        ]); 
    });

    // UBAH DARI PATCH MENJADI POST !!!
    Route::post('/admin/profil/update', function (Illuminate\Http\Request $request) {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Siapkan data dasar yang akan di-update atau dibuat
        $dataBanjar = [
            'nama_banjar'     => $request->name,
            'deskripsi'       => $request->deskripsi,
            'no_wa_pengelola' => $request->phone,
            'negara'          => $request->negara,
            'provinsi'        => $request->provinsi,
            'kota'            => $request->kota,
            'status_akun'     => DB::raw('COALESCE(status_akun, "pending")'),
            'kode_verifikasi' => DB::raw('COALESCE(kode_verifikasi, SUBSTRING(MD5(RAND()), 1, 6))'),
        ];

        // LOGIKA PENYIMPANAN FOTO (Ini yang tadinya hilang)
        if ($request->hasFile('foto_profil')) {
            // Simpan foto ke folder public/storage/profil_banjar
            $path = $request->file('foto_profil')->store('profil_banjar', 'public');
            
            // Masukkan alamat fotonya ke dalam database
            $dataBanjar['foto_profil'] = $path;
        }

        // Simpan semua ke database (Text + Foto)
        App\Models\Banjar::updateOrCreate(
            ['admin_id' => $user->id], 
            $dataBanjar
        );

        if ($request->adminName || $request->email) {
            $user->update([
                'name'  => $request->adminName ?? $user->name,
                'email' => $request->email ?? $user->email,
            ]);
        }

        return redirect()->back();
    });
    
    // KONTEN BANJAR
    Route::get('/konten', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->first();
        
        if (!$banjar) {
            return redirect('/admin/profil');
        }

        $kegiatan = Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)->get();
        $umkm = Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)->get();

        return Inertia::render('admin/Konten', [
            'kegiatan' => $kegiatan,
            'umkm' => $umkm
        ]);
    });

    // PETA ADMIN 
    Route::get('/peta', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->first();
        
        return Inertia::render('admin/PetaAdmin', [
            'banjar' => $banjar
        ]); 
    });

    Route::patch('/peta/update', [BanjarController::class, 'updatePeta']);

   // ==========================================
    // HALAMAN SUBMIT KONTEN (Menampilkan Draft & Riwayat)
    // ==========================================
    Route::get('/submit', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->first();
        
        if (!$banjar) return redirect('/admin/profil');

        // 1. Ambil data Kegiatan & UMKM yang statusnya masih 'draft'
        $kegiatanDraft = Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                                 ->where('status_moderasi', 'draft')
                                 ->get()
                                 ->map(function($item) {
            return [
                'id' => 'kegiatan_' . $item->id_kegiatan, // Memakai id_kegiatan
                'title' => $item->judul_kegiatan ?? 'Kegiatan Tanpa Judul', // Memakai judul_kegiatan
                'type' => 'kegiatan'
            ];
        });

        $umkmDraft = Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                         ->where('status_moderasi', 'draft')
                         ->get()
                         ->map(function($item) {
            return [
                'id' => 'umkm_' . $item->id_umkm, // Memakai id_umkm
                'title' => $item->nama_usaha ?? 'UMKM Tanpa Nama', // Memakai nama_usaha
                'type' => 'umkm'
            ];
        });

        // Gabungkan array Kegiatan dan UMKM untuk dikirim sebagai 'drafts'
        $drafts = $kegiatanDraft->concat($umkmDraft);

        // 2. Ambil data Riwayat (yang statusnya 'pending', 'approved', atau 'rejected')
        $kegiatanHistory = Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                                   ->whereIn('status_moderasi', ['pending', 'approved', 'rejected']) 
                                   ->get()
                                   ->map(function($item) {
            return [
                'status' => $item->status_moderasi,
                'title' => $item->judul_kegiatan ?? 'Kegiatan', // Memakai judul_kegiatan
                'date' => $item->updated_at->format('d M Y'),
                'note' => '' // Jika ada kolom catatan penolakan dari Super Admin, taruh di sini
            ];
        });

        $umkmHistory = Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                           ->whereIn('status_moderasi', ['pending', 'approved', 'rejected']) 
                           ->get()
                           ->map(function($item) {
            return [
                'status' => $item->status_moderasi,
                'title' => $item->nama_usaha ?? 'UMKM', // Memakai nama_usaha
                'date' => $item->updated_at->format('d M Y'),
                'note' => '' 
            ];
        });

        $histories = $kegiatanHistory->concat($umkmHistory)->sortByDesc('date')->values();

        // --- TAMBAHKAN KODE INI SEMENTARA ---
        // dd([
        //     'id_banjar_yang_login' => $banjar->id_banjar ?? $banjar->id,
        //     'jumlah_draft' => count($drafts),
        //     'jumlah_riwayat' => count($histories),
        //     'data_draft' => $drafts,
        //     'data_riwayat' => $histories
        // ]);
        // ------------------------------------

        return Inertia::render('admin/Submit', [
            'banjar' => $banjar,
            'drafts' => $drafts,
            'histories' => $histories
        ]); 
    });

    // ==========================================
    // PROSES SUBMIT SATU KONTEN
    // ==========================================
    Route::post('/submit-konten/{id}', function ($id) {
        // Memecah ID gabungan dari React (contoh: 'kegiatan_5' menjadi 'kegiatan' dan '5')
        $parts = explode('_', $id);
        
        if (count($parts) == 2) {
            $type = $parts[0];
            $realId = $parts[1];

            // PENTING: Gunakan primary key yang benar (id_kegiatan / id_umkm)
            if ($type === 'kegiatan') {
                Kegiatan::where('id_kegiatan', $realId)->update(['status_moderasi' => 'pending']);
            } else if ($type === 'umkm') {
                Umkm::where('id_umkm', $realId)->update(['status_moderasi' => 'pending']);
            }
        }
        return back();
    });

    // ==========================================
    // PROSES SUBMIT SEMUA KONTEN SEKALIGUS
    // ==========================================
    Route::post('/submit-konten/semua', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->first();

        if ($banjar) {
            // Ubah semua yang 'draft' menjadi 'pending'
            Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                    ->where('status_moderasi', 'draft')
                    ->update(['status_moderasi' => 'pending']);
                    
            Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                ->where('status_moderasi', 'draft')
                ->update(['status_moderasi' => 'pending']);
        }
        return back();
    });

    // PASSWORD (Mengambil email pengguna yang login sebagai konfirmasi keamanan)
    Route::get('/password', function () { 
        $user = Auth::user();
        return Inertia::render('admin/Password', [
            'email' => $user->email
        ]); 
    });
    Route::post('/kegiatan', [BanjarController::class, 'storeKegiatan']);
    Route::post('/umkm', [BanjarController::class, 'storeUmkm']);
});

// ==========================================
// 4. JALUR HALAMAN SUPER ADMIN (Hanya untuk super_admin)
// ==========================================
Route::middleware(['auth', 'role:super_admin'])->prefix('superadmin')->group(function () {
    
   // DASHBOARD SUPER ADMIN
    Route::get('/dashboard', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Ambil data statistik mentah
        $totalBanjar = Banjar::where('status_akun', 'aktif')->count();
        $menungguModerasi = Banjar::where('status_akun', 'pending')->count();
        $banjarBaru = Banjar::whereMonth('created_at', date('m'))->count();
        $totalViews = Banjar::sum('total_views') ?? 0;
        
        $totalUmkm = Umkm::count();
        $totalPengguna = User::where('role', 'warga')->count();
        $kegiatanAktif = Kegiatan::where('status_moderasi', 'approved')->count();

        // 2. Format data antrian moderasi untuk React
        $pendaftaranBaru = Banjar::where('status_akun', 'pending')
                                 ->orderBy('created_at', 'desc')
                                 ->take(4)
                                 ->get()
                                 ->map(function ($item) {
                                     return [
                                         'title' => $item->nama_banjar,
                                         'subtitle' => $item->kota . ' · ' . $item->created_at->format('d M Y'),
                                         'type' => 'Pendaftaran Baru'
                                     ];
                                 });

        // 3. Format data sebaran wilayah untuk Bar Chart
        $banjarPerKota = Banjar::select('kota', DB::raw('count(*) as total'))
                               ->groupBy('kota')
                               ->orderByDesc('total')
                               ->take(5)
                               ->get();
                               
        $maxTotal = $banjarPerKota->max('total') ?: 1; // Mencegah pembagian 0
        $sebaranWilayah = $banjarPerKota->map(function ($item) use ($maxTotal) {
            return [
                'label' => $item->kota ?: 'Tidak Diketahui',
                'value' => $item->total,
                'percentage' => round(($item->total / $maxTotal) * 100) . '%'
            ];
        });

        // 4. Kirim ke Inertia
        return Inertia::render('superadmin/Dashboard', [
            'superadminName' => $user->name,
            'statistik' => [
                'total_banjar' => $totalBanjar,
                'total_umkm' => $totalUmkm,
                'total_pengguna' => $totalPengguna,
                'kegiatan_aktif' => $kegiatanAktif,
                'banjar_menunggu' => $menungguModerasi,
                'banjar_baru' => $banjarBaru,
                'total_views' => $totalViews,
            ],
            'antrian_moderasi' => $pendaftaranBaru,
            'sebaran_kabupaten' => $sebaranWilayah
        ]); 
    });

   // ==========================================
    // HALAMAN MODERASI
    // ==========================================
    Route::get('/moderasi', function () { 
        // 1. Ambil Antrian (Status: pending)
        $kegiatanPending = Kegiatan::where('status_moderasi', 'pending')->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return [
                'id' => $item->id_kegiatan, // Sesuaikan dengan primary key tabel kegiatan
                'type' => 'kegiatan',
                'title' => $item->nama_kegiatan ?? 'Kegiatan Tanpa Judul',
                'location' => ($banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui') . ' · ' . $item->created_at->format('d M Y'),
                'description' => $item->deskripsi,
                'badge' => 'Kegiatan',
            ];
        });

        $umkmPending = Umkm::where('status_moderasi', 'pending')->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return [
                'id' => $item->id_umkm, // Sesuaikan dengan primary key tabel umkm
                'type' => 'umkm',
                'title' => $item->nama_umkm ?? 'UMKM Tanpa Nama',
                'location' => ($banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui') . ' · ' . $item->created_at->format('d M Y'),
                'description' => $item->deskripsi_produk,
                'badge' => 'UMKM',
            ];
        });

        $antrian = $kegiatanPending->concat($umkmPending);

        // 2. Ambil Riwayat (Status: approved / rejected)
        $kegiatanRiwayat = Kegiatan::whereIn('status_moderasi', ['approved', 'rejected'])->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return [
                'id' => $item->id_kegiatan,
                'type' => 'kegiatan',
                'title' => $item->nama_kegiatan ?? 'Kegiatan',
                'location' => ($banjar ? $banjar->nama_banjar : 'Banjar') . ' · ' . $item->updated_at->format('d M Y'),
                'status' => $item->status_moderasi, // 'approved' atau 'rejected'
                'note' => $item->catatan_moderasi,
                'badge' => 'Kegiatan'
            ];
        });

        $umkmRiwayat = Umkm::whereIn('status_moderasi', ['approved', 'rejected'])->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return [
                'id' => $item->id_umkm,
                'type' => 'umkm',
                'title' => $item->nama_umkm ?? 'UMKM',
                'location' => ($banjar ? $banjar->nama_banjar : 'Banjar') . ' · ' . $item->updated_at->format('d M Y'),
                'status' => $item->status_moderasi,
                'note' => $item->catatan_moderasi,
                'badge' => 'UMKM'
            ];
        });

        $riwayat = $kegiatanRiwayat->concat($umkmRiwayat)->sortByDesc('location')->values();

        // 3. Hitung Statistik
        $stats = [
            'menunggu' => $antrian->count(),
            'disetujui' => $riwayat->where('status', 'approved')->count(),
            'ditolak' => $riwayat->where('status', 'rejected')->count(),
        ];

        return Inertia::render('superadmin/Moderasi', [
            'antrian' => $antrian,
            'riwayat' => $riwayat,
            'stats' => $stats
        ]); 
    });

    // ==========================================
    // PROSES MODERASI (TERIMA / TOLAK BESERTA ULASAN)
    // ==========================================
    Route::post('/moderasi/proses', function (Illuminate\Http\Request $request) {
        //dd($request->all());

        $type = $request->input('type');
        $id = $request->input('id');
        $status = $request->input('status'); // 'approved' atau 'rejected'
        $catatan = $request->input('catatan');

        if ($type === 'kegiatan') {
            Kegiatan::where('id_kegiatan', $id)->update(['status_moderasi' => $status, 'catatan_moderasi' => $catatan]);
        } elseif ($type === 'umkm') {
            Umkm::where('id_umkm', $id)->update(['status_moderasi' => $status, 'catatan_moderasi' => $catatan]);
        }
        
        return back();
    });

   // ==========================================
    // HALAMAN PANTAU PLATFORM
    // ==========================================

    Route::get('/pantau', function () { 
        \Carbon\Carbon::setLocale('id'); // Set bahasa waktu ke Indonesia
        $today = \Carbon\Carbon::today();

        // 1. MENGHITUNG METRIK HARI INI
        $kegiatanHariIni = Kegiatan::whereDate('created_at', $today)->count();
        $umkmHariIni = Umkm::whereDate('created_at', $today)->count();
        
        $metrics = [
            'total_admin' => User::where('role', 'admin_banjar')->count(),
            'konten_disubmit' => $kegiatanHariIni + $umkmHariIni,
            'profil_diperbarui' => Banjar::whereDate('updated_at', $today)->count(),
            'banjar_baru' => Banjar::whereDate('created_at', $today)->count(),
        ];

        // 2. MENGAMBIL AKTIVITAS REAL-TIME (5 Terbaru)
        
        // Ambil dari Kegiatan
        $recentKegiatan = Kegiatan::latest('updated_at')->take(5)->get()->map(function($k) {
            $banjar = Banjar::where('id_banjar', $k->id_banjar)->first();
            // PERBAIKAN: Parse string menjadi objek Carbon dulu
            $date = \Carbon\Carbon::parse($k->updated_at); 
            return [
                'title' => $banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui',
                'desc' => 'Submit kegiatan baru: ' . ($k->nama_kegiatan ?? 'Tanpa Judul'),
                'timestamp' => $date, 
                'time' => $date->diffForHumans(), // Sekarang aman!
                'dotColor' => '#C9861A', // gold
            ];
        });

        // Ambil dari UMKM
        $recentUmkm = Umkm::latest('updated_at')->take(5)->get()->map(function($u) {
            $banjar = Banjar::where('id_banjar', $u->id_banjar)->first();
            // PERBAIKAN: Parse string menjadi objek Carbon dulu
            $date = \Carbon\Carbon::parse($u->updated_at);
            return [
                'title' => $banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui',
                'desc' => 'UMKM baru ditambahkan: ' . ($u->nama_umkm ?? 'Tanpa Nama'),
                'timestamp' => $date,
                'time' => $date->diffForHumans(), // Sekarang aman!
                'dotColor' => '#4A9E60', // green
            ];
        });

        // Ambil dari Profil Banjar yang diupdate
        $recentBanjar = Banjar::latest('updated_at')->take(5)->get()->map(function($b) {
            // PERBAIKAN: Parse string menjadi objek Carbon dulu
            $date = \Carbon\Carbon::parse($b->updated_at);
            return [
                'title' => $b->nama_banjar ?? 'Banjar Baru',
                'desc' => 'Memperbarui profil banjar',
                'timestamp' => $date,
                'time' => $date->diffForHumans(), // Sekarang aman!
                'dotColor' => '#E6BA75', // goldLight
            ];
        });

        // Gabungkan semua aktivitas, urutkan, ambil 5 teratas
        $activities = collect()
            ->concat($recentKegiatan)
            ->concat($recentUmkm)
            ->concat($recentBanjar)
            ->sortByDesc('timestamp')
            ->values()
            ->take(5)
            ->map(function($item) {
                unset($item['timestamp']); // Hapus timestamp agar tidak error di React
                return $item;
            });

        return Inertia::render('superadmin/Pantau', [
            'metrics' => $metrics,
            'activities' => $activities
        ]); 
    });

   // STATISTIK GLOBAL SUPER ADMIN
    Route::get('/statistik', function () { 
        // 1. Data Top Stats (Kartu Kecil)
        $totalBanjar = \App\Models\Banjar::count();
        $banjarAktif = \App\Models\Banjar::where('status_akun', 'aktif')->count();
        $banjarPending = \App\Models\Banjar::where('status_akun', 'pending')->count();
        $totalUmkm = \App\Models\Umkm::count();
        $totalUsers = \App\Models\User::where('role', 'warga')->count();
        $banjarBaru = \App\Models\Banjar::whereMonth('created_at', date('m'))
                                        ->whereYear('created_at', date('Y'))
                                        ->count();

        // 2. Data Grafik Pertumbuhan (6 Bulan Terakhir)
        // Catatan: Ini mengambil data jumlah pendaftaran banjar per bulan di tahun ini
        $grafikPertumbuhan = \App\Models\Banjar::select(
            DB::raw('MONTH(created_at) as bulan'), 
            DB::raw('count(*) as total')
        )
        ->whereYear('created_at', date('Y'))
        ->groupBy('bulan')
        ->orderBy('bulan')
        ->pluck('total', 'bulan')->toArray();

        // Siapkan array 7 bulan terakhir (Jan-Jul misalnya, disesuaikan)
        $dataPertumbuhan = [];
        for ($i = 1; $i <= 7; $i++) {
            $dataPertumbuhan[] = [
                'bulan' => date('M', mktime(0, 0, 0, $i, 1)), // Menghasilkan Jan, Feb, dst
                'total' => $grafikPertumbuhan[$i] ?? 0 // Jika tidak ada data, isi 0
            ];
        }

        // 3. Data Sebaran Wilayah (Horizontal Bar)
        $banjarPerKota = \App\Models\Banjar::select('kota', DB::raw('count(*) as total'))
                               ->whereNotNull('kota')
                               ->groupBy('kota')
                               ->orderByDesc('total')
                               ->take(6)
                               ->get();

        $maxTotal = $banjarPerKota->max('total') ?: 1; // Untuk panjang bar kuning
        $totalSemuaKota = $banjarPerKota->sum('total') ?: 1; // Untuk persentase teks

        $sebaranWilayah = $banjarPerKota->map(function ($item) use ($maxTotal, $totalSemuaKota) {
            return [
                'label' => $item->kota,
                'value' => $item->total,
                'percentage' => round(($item->total / $maxTotal) * 100) . '%',
                'displayPct' => round(($item->total / $totalSemuaKota) * 100) . '%'
            ];
        });

        // Kirim data ke Inertia
        return Inertia::render('superadmin/Statistik', [
            'top_stats' => [
                'total_banjar' => $totalBanjar,
                'aktif' => $banjarAktif,
                'pending' => $banjarPending,
                'umkm' => $totalUmkm,
                'users' => $totalUsers,
                'baru_bulan_ini' => $banjarBaru,
            ],
            'pertumbuhan' => $dataPertumbuhan,
            'sebaran' => $sebaranWilayah
        ]); 
    });

  // 1. ROUTE GET: Untuk menampilkan halaman form Buat Banjar
Route::get('/buat-banjar', function () {
    return Inertia::render('superadmin/BuatBanjar');
});

// 2. ROUTE POST: Untuk memproses data yang dikirim dari React dan menyimpannya ke database
Route::post('/buat-banjar', function (Request $request) {
    // Validasi data yang masuk
    $request->validate([
        'nama_banjar' => 'required|string|max:255',
        'negara'      => 'required|string',
        'provinsi'    => 'required|string',
        'kota'        => 'required|string',
        'kecamatan'   => 'required|string',
        'deskripsi'   => 'nullable|string',
    ]);

    // Simpan data ke tabel banjar di database
    Banjar::create([
        'nama_banjar' => $request->nama_banjar,
        'negara'      => $request->negara,
        'provinsi'    => $request->provinsi,
        'kota'        => $request->kota,
        'kecamatan'   => $request->kecamatan,
        'deskripsi'   => $request->deskripsi,
        'status_akun' => 'aktif', // Sesuaikan jika Anda ingin statusnya 'pending' terlebih dahulu
    ]);

    // Kembalikan ke halaman yang sama (React akan menerima status onSuccess)
    return back();
    });

   
    // ... (Route Super Admin lainnya) ...

 // HALAMAN MANAJEMEN ADMIN 
    Route::get('/manajemen-admin', function () { 
        $admins = App\Models\User::where('role', 'admin_banjar')->orderBy('name', 'asc')->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'status' => $user->status_akun ?? 'pending' // Default pending untuk pendaftar baru
            ];
        });

        return Inertia::render('superadmin/ManajemenAdmin', [
            'admins' => $admins
        ]); 
    });

    // PROSES RESET PASSWORD (Tanpa awalan /superadmin karena sudah masuk Route Group)
    Route::patch('/reset-password/{id_user}', function ($id_user) {
        $admin = App\Models\User::findOrFail($id_user);
        $admin->update([
            'password' => Illuminate\Support\Facades\Hash::make('banjar123') 
        ]);
        return back();
    });

    // PROSES UBAH STATUS AKUN & BANJAR DENGAN LOGIKA SPESIFIK
    Route::post('/ubah-status-admin/{id_user}', function (Illuminate\Http\Request $request, $id_user) {
        $admin = App\Models\User::findOrFail($id_user);
        
        // Ambil data 'aksi' yang dikirim dari tombol React (aktif / tolak / suspend)
        $aksi = $request->input('aksi'); 
        
        $statusBaru = 'pending';

        if ($aksi === 'aktif') {
            $statusBaru = 'aktif';
        } elseif ($aksi === 'tolak') {
            $statusBaru = 'ditolak';
        } elseif ($aksi === 'suspend') {
            $statusBaru = 'suspend';
        }

        // 1. Update status Admin di tabel users
        $admin->update([
            'status' => $statusBaru
        ]);

        // 2. SINKRONISASI KE TABEL BANJAR 
        // Hanya tayang di publik jika statusnya 'aktif'
        $statusBanjar = ($statusBaru === 'aktif') ? 'aktif' : $statusBaru; 

        \App\Models\Banjar::where('admin_id', $id_user)->update([
            'status_akun' => $statusBanjar
        ]);

        return back();
    });
});
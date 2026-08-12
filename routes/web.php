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
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite; 

// ========================================================================
// 1. PENGATURAN BAHASA & FUNGSI TRANSLATE
// ========================================================================
Route::get('/language/{locale}', function ($locale) {
    $allowedLocales = ['id', 'en', 'es', 'de', 'ja', 'fr', 'pt', 'ru', 'it'];
    if (in_array($locale, $allowedLocales)) {
        session(['locale' => $locale]);
    }
    return redirect()->back();
});

if (!function_exists('translateContent')) {
    function translateContent($text, $locale) {
        if (empty($text) || $locale === 'id') {
            return $text;
        }
        $cacheKey = 'translate_stichoza_' . md5($text) . '_' . $locale;
        return Cache::remember($cacheKey, now()->addDays(30), function () use ($text, $locale) {
            try {
                $tr = new GoogleTranslate();
                $tr->setSource('id');
                $tr->setTarget($locale);
                return $tr->translate($text);
            } catch (\Exception $e) {
                return $text;
            }
        });
    }
}

// =========================================================================
// 1. ROUTE BERANDA UTAMA ( / )
// =========================================================================
Route::get('/', function () {
    $user = Auth::user();

    // Jika yang login adalah Anggota Banjar atau Admin Banjar, 
    // langsung arahkan ke Dashboard Admin!
    if ($user) {
        if ($user->role === 'super_admin') {
            return redirect()->to('/superadmin/dashboard');
        } elseif ($user->role === 'admin_banjar' || $user->role === 'anggota_banjar') {
            return redirect()->to('/admin/dashboard');
        }
    }

    $totalBanjar = Banjar::where('status_akun', 'aktif')->count();
    $kegiatanAktif = Kegiatan::where('status_moderasi', 'approved')->count();
    $totalUmkm = Umkm::where('status_moderasi', 'approved')->count();
    
    $totalKabupaten = Banjar::where('status_akun', 'aktif')
                        ->whereNotNull('kota')
                        ->distinct('kota')
                        ->count('kota');

    $banjarUnggulan = Banjar::where('status_akun', 'aktif')
                        ->orderBy('total_views', 'desc')
                        ->take(3)
                        ->get()
                        ->map(function($b) {
                            $banjarId = $b->id_banjar ?? $b->id;
                            
                            // HITUNG JUMLAH ANGGOTA TERDAFTAR SECARA REAL-TIME DARI TABEL USERS
                            $totalAnggota = User::where('id_banjar', $banjarId)
                                    ->where('role', '!=', 'admin_banjar')
                                    ->count();
                            $rating = $b->jumlah_perating > 0 
                                      ? round($b->total_bintang / $b->jumlah_perating, 1) 
                                      : 0;

                            return [
                                'id' => $banjarId,
                                'name' => $b->nama_banjar,
                                'kecamatan' => $b->provinsi ?? '-',
                                'kabupaten' => $b->kota ?? '-',
                                'img' => $b->foto_profil ? asset('storage/' . $b->foto_profil) : null, 
                                'members' => $totalAnggota, // Mengirim jumlah anggota asli
                                'jumlah_anggota' => $totalAnggota,
                                'umkm' => Umkm::where('id_banjar', $banjarId)->where('status_moderasi', 'approved')->count(),
                                'views' => $b->total_views ?? 0,
                                'likes' => $b->total_likes ?? 0,
                                'rating' => $rating,
                                'tags' => ['Terverifikasi'],
                                'phone' => $b->no_wa_pengelola ?? ''
                            ];
                        });

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


// =========================================================================
// 2. ROUTE CARI BANJAR ( /cari )
// =========================================================================
Route::get('/cari', function (Request $request) {
    // 1. AMBIL KESELURUHAN DATA WILAYAH UNTUK DROPDOWN
    $negaraTersedia = Banjar::where('status_akun', 'aktif')
                        ->whereNotNull('negara')
                        ->distinct()
                        ->pluck('negara');

    $provinsiTersedia = Banjar::where('status_akun', 'aktif')
                        ->whereNotNull('provinsi')
                        ->distinct()
                        ->pluck('provinsi');

    $kotaTersedia = Banjar::where('status_akun', 'aktif')
                        ->whereNotNull('kota')
                        ->distinct()
                        ->pluck('kota');

    // 2. QUERY UTAMA DENGAN FILTER DROPDOWN
    $query = Banjar::where('status_akun', 'aktif');

    if ($request->filled('negara')) {
        $query->where('negara', $request->negara);
    }
    if ($request->filled('provinsi')) {
        $query->where('provinsi', $request->provinsi);
    }
    if ($request->filled('kota')) {
        $query->where('kota', $request->kota);
    }
    
    // 3. FITUR PENCARIAN
    if ($request->filled('search')) {
        $searchTerm = $request->search;
        $query->where(function($q) use ($searchTerm) {
            $q->where('nama_banjar', 'like', '%' . $searchTerm . '%')
              ->orWhere('negara', 'like', '%' . $searchTerm . '%')
              ->orWhere('provinsi', 'like', '%' . $searchTerm . '%')
              ->orWhere('kota', 'like', '%' . $searchTerm . '%');
        });
    }

    // 4. PAGINATION (Batasi 10 data per halaman)
    $banjars = $query->paginate(10)->through(function($b) {
        $banjarId = $b->id_banjar ?? $b->id;
        
        // HITUNG JUMLAH ANGGOTA TERDAFTAR SECARA REAL-TIME DARI TABEL USERS
      $totalAnggota = User::where('id_banjar', $banjarId)
                    ->where('role', '!=', 'admin_banjar')
                    ->count();

        $rating = $b->jumlah_perating > 0 ? round($b->total_bintang / $b->jumlah_perating, 1) : 0;

        return [
            'id' => $banjarId,
            'nama_banjar' => $b->nama_banjar,
            'kota' => $b->kota ?? '-',
            'provinsi' => $b->provinsi ?? '-',
            'negara' => $b->negara ?? '-',
            'foto_url' => $b->foto_profil ? asset('storage/' . $b->foto_profil) : null,
            'jumlah_anggota' => $totalAnggota, // Mengirim jumlah anggota asli
            'jumlah_kk' => $totalAnggota,      // Backup agar tidak breaking change di frontend
            'umkm' => Umkm::where('id_banjar', $banjarId)->where('status_moderasi', 'approved')->count(),
            'total_views' => $b->total_views ?? 0,
            'total_likes' => $b->total_likes ?? 0,
            'rating' => $rating,
            'phone' => $b->no_wa_pengelola ?? ''
        ];
    });

    // Pertahankan parameter filter di URL saat pindah halaman
    $banjars->appends($request->all());

    return Inertia::render('publik/Cari', [
        'banjarsData' => $banjars,
        'dropdownWilayah' => [
            'negara' => $negaraTersedia,
            'provinsi' => $provinsiTersedia,
            'kota' => $kotaTersedia
        ],
        'filters' => $request->only(['search', 'negara', 'provinsi', 'kota'])
    ]);
});

// --- HALAMAN PETA INTERAKTIF ---
Route::get('/peta', function (\Illuminate\Http\Request $request) {
    $banjars = \App\Models\Banjar::where('status_akun', 'aktif')
                                 ->whereNotNull('latitude')
                                 ->whereNotNull('longitude')
                                 ->get()
                                 ->map(function($b) {
                                     $banjarId = $b->id_banjar ?? $b->id;
                                     
                                     // HITUNG JUMLAH ANGGOTA TERDAFTAR SECARA REAL-TIME DARI TABEL USERS
                                     $totalAnggota = User::where('id_banjar', $banjarId)
                                        ->where('role', '!=', 'admin_banjar')
                                        ->count();
                                     
                                     $rating = $b->jumlah_perating > 0 ? round($b->total_bintang / $b->jumlah_perating, 1) : 0;
                                     
                                     return [
                                         'id' => $banjarId,
                                         'nama_banjar' => $b->nama_banjar,
                                         'kecamatan' => $b->provinsi ?? '-', // Antisipasi agar tidak muncul fallback aneh
                                         'kota' => $b->kota ?? '-',
                                         'provinsi' => $b->provinsi ?? '-',
                                         'negara' => $b->negara ?? '-',
                                         'lat' => (float) $b->latitude,
                                         'lng' => (float) $b->longitude,
                                         'foto_url' => $b->foto_profil ? asset('storage/' . $b->foto_profil) : null,
                                         'jumlah_anggota' => $totalAnggota, // Data Anggota Real-time
                                         'rating' => $rating
                                     ];
                                 });

    return Inertia::render('publik/Peta', [
        'banjarsData' => $banjars,
        'queryKota' => $request->query('kota')
    ]);
});

// =========================================================================
// 2.5. ROUTE DETAIL PROFIL BANJAR ( /banjar/{id} )
// =========================================================================
Route::get('/banjar/{id}', function ($id) {
    // PERBAIKAN 404: Cari berdasarkan id_banjar ATAU id biasa
    $banjar = App\Models\Banjar::where('id_banjar', $id)->firstOrFail();
    
    $locale = session('locale', 'id');

    $banjar->deskripsi = translateContent($banjar->deskripsi, $locale);
    
    $sessionView = 'view_banjar_' . $id;
    if (!session()->has($sessionView)) {
        $banjar->increment('total_views');
        session()->put($sessionView, true);
    }
    
    $rata_rata = $banjar->jumlah_perating > 0 ? round($banjar->total_bintang / $banjar->jumlah_perating, 1) : 0;
    
    $kegiatan = App\Models\Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
        ->where('status_moderasi', 'approved')
        ->orderBy('created_at', 'desc')
        ->get()->map(function($k) use ($locale) {
        return [
            'id_kegiatan'      => $k->id_kegiatan ?? $k->id,
            'nama_kegiatan'    => translateContent($k->judul_kegiatan ?? 'Tanpa Judul', $locale),
            'tanggal_kegiatan' => $k->tanggal ?? $k->created_at,
            'deskripsi'        => translateContent($k->deskripsi ?? '', $locale),
            'no_wa_panitia'    => $k->no_wa_panitia ?? '',
            'lokasi'           => $k->lokasi ?? 'Lokasi tidak disebutkan',
            'foto_url'         => $k->foto_kegiatan ? asset('storage/' . $k->foto_kegiatan) : null,
        ];
    });
    
    $umkm = App\Models\Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
        ->where('status_moderasi', 'approved')
        ->orderBy('created_at', 'desc')
        ->get()->map(function($u) use ($locale) {
        return [
            'id_umkm'          => $u->id_umkm ?? $u->id,
            'nama_usaha'       => translateContent($u->nama_usaha, $locale),
            'deskripsi_produk' => translateContent($u->deskripsi_produk, $locale),
            'harga'            => $u->harga, 
            'no_wa_penjual'    => $u->no_wa_penjual ?? '',
            'lokasi'           => $u->lokasi ?? 'Alamat tidak disebutkan',
            'foto_url'         => $u->foto_produk ? asset('storage/' . $u->foto_produk) : null,
        ];
    });

    $daftar_rating = Illuminate\Support\Facades\DB::table('ratings')
        ->join('users', 'ratings.user_id', '=', 'users.id')
        ->where('ratings.id_banjar', $banjar->id_banjar ?? $banjar->id) 
        ->select('ratings.bintang', 'ratings.komentar', 'ratings.created_at', 'users.name')
        ->orderBy('ratings.created_at', 'desc')
        ->get()
        ->map(function($r) {
            return [
                'nama' => $r->name,
                'bintang' => $r->bintang,
                'komentar' => $r->komentar,
                'tanggal' => \Carbon\Carbon::parse($r->created_at)->diffForHumans()
            ];
        });

    $banjar->foto_url = $banjar->foto_profil ? asset('storage/' . $banjar->foto_profil) : null;
    
    $hasLiked = false;
    $hasRated = false;
    
    if (Illuminate\Support\Facades\Auth::check()) {
        $user_id = Illuminate\Support\Facades\Auth::id();
        $hasLiked = session()->has('like_banjar_' . ($banjar->id_banjar ?? $banjar->id) . '_user_' . $user_id);
        $hasRated = Illuminate\Support\Facades\DB::table('ratings')->where('user_id', $user_id)->where('id_banjar', $banjar->id_banjar ?? $banjar->id)->exists();
    }

    return Inertia::render('publik/BanjarProfile', [
        'banjar' => $banjar,
        'rating' => $rata_rata, 
        'kegiatan' => $kegiatan,
        'umkm' => $umkm,
        'daftar_rating' => $daftar_rating,
        'hasLiked' => $hasLiked,
        'hasRated' => $hasRated
    ]);
});

// ========================================================================
// 3. FITUR INTERAKSI PUBLIK (WAJIB LOGIN)
// ========================================================================
Route::middleware('auth')->group(function () {
    
    Route::post('/banjar/{id}/like', function ($id) {
        $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
        $user_id = Auth::id(); 
        
        $sessionKey = 'like_banjar_' . $id . '_user_' . $user_id;
        
        if (session()->has($sessionKey)) {
            if ($banjar->total_likes > 0) {
                $banjar->decrement('total_likes');
            }
            session()->forget($sessionKey);
        } else {
            $banjar->increment('total_likes');
            session()->put($sessionKey, true);
        }
        
        return back(); 
    });

    Route::post('/banjar/{id}/rating', function (Request $request, $id) {
        $user_id = Auth::id();
        
        $request->validate([
            'bintang' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500' 
        ]);

        $sudahRating = DB::table('ratings')->where('user_id', $user_id)->where('id_banjar', $id)->exists();

        if ($sudahRating) {
            return back()->withErrors(['rating' => 'Anda sudah memberikan penilaian untuk banjar ini.']);
        }

        DB::table('ratings')->insert([
            'user_id' => $user_id,
            'id_banjar' => $id,
            'bintang' => $request->bintang,
            'komentar' => $request->komentar,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $banjar = Banjar::where('id_banjar', $id)->firstOrFail();
        $banjar->increment('total_bintang', $request->bintang);
        $banjar->increment('jumlah_perating');
        
        return back();
    });
});

// ========================================================================
// 4. JALUR HALAMAN AUTH
// ========================================================================
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::post('/login', [BanjarController::class, 'login']);

Route::get('/register', [BanjarController::class, 'showRegister'])->name('register');
Route::post('/register', [BanjarController::class, 'register']);

// --- FITUR LUPA SANDI ---
Route::get('/lupa-sandi', function () {
    return Inertia::render('Auth/LupaSandi');
})->name('lupa-sandi');

Route::post('/lupa-sandi', [BanjarController::class, 'sendResetToken']);

// Halaman Profil Warga
    Route::get('/profil-saya', function () {
        return Inertia::render('warga/ProfilWarga');
    })->name('profil.warga');

    // Proses Simpan Ubah Sandi Warga
    Route::put('/profil-saya/ubah-sandi', [BanjarController::class, 'updatePasswordWarga']);

    // --- JALUR HALAMAN INFORMASI PUBLIK ---
Route::get('/tentang-kami', function () {
    return Inertia::render('publik/TentangKami');
});

Route::get('/kebijakan-privasi', function () {
    return Inertia::render('publik/KebijakanPrivasi');
});

Route::get('/kontak', function () {
    return Inertia::render('publik/Kontak');
});

// Logout
Route::post('/logout', [BanjarController::class, 'logout'])->name('logout');

// --- FITUR LOGIN DENGAN GOOGLE ---
Route::get('/auth/google', function () {
    /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
    $provider = Socialite::driver('google');
    return $provider->redirect();
})->name('google.login');

Route::get('/auth/google/callback', function () {
    try {
        /** @var \Laravel\Socialite\Two\GoogleProvider $provider */
        $provider = Socialite::driver('google');
        $googleUser = $provider->stateless()->user();

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            Auth::login($user);
        } else {
            // Buat akun baru jika email belum terdaftar
            $user = User::create([
                'name' => $googleUser->getName(),
                'username' => 'user_' . substr(md5(uniqid()), 0, 8), 
                'email' => $googleUser->getEmail(),
                'password' => Hash::make(uniqid()), // Password sementara
                'role' => 'warga', 
                'status_akun' => 'aktif',
            ]);
            Auth::login($user);
        }
        
        // --- LOGIKA REDIRECT SETELAH BERHASIL LOGIN ---
        if ($user->role === 'super_admin') {
            return redirect()->to('/superadmin/dashboard');
        } elseif ($user->role === 'admin_banjar' || $user->role === 'anggota_banjar') {
            return redirect()->to('/admin/dashboard');
        } else {
            // KHUSUS WARGA: Cek apakah id_banjar masih kosong (belum gabung banjar)
            if (empty($user->id_banjar)) {
                return redirect()->to('/gabung-banjar'); // Lempar ke halaman input kode & buat password
            }
            return redirect()->to('/'); // Jika sudah punya banjar, langsung ke beranda
        }

    } catch (\Exception $e) {
        // Jika error (misal jaringan putus / ditolak Google), kembalikan ke halaman login
       // return redirect('/login')->withErrors(['email' => 'Gagal login menggunakan Google. Silakan coba lagi.']);
        dd($e->getMessage());
    }
});

// ========================================================================
// 3. FITUR INTERAKSI PUBLIK (WAJIB LOGIN)
// ========================================================================
Route::middleware('auth')->group(function () {
    
  // --- RUTE GABUNG BANJAR (DIUPDATE UNTUK DESAIN BARU) ---
    Route::get('/gabung-banjar', function () {
        // Cegah akses jika user sudah punya id_banjar (sudah tergabung sebagai anggota)
        if (Auth::user()->id_banjar && Auth::user()->role === 'anggota_banjar') {
            return redirect('/');
        }
        
        // 1. Ambil data semua banjar yang aktif untuk ditampilkan di list pencarian desain UI Anda
        $banjars = \App\Models\Banjar::where('status_akun', 'aktif')->get();

        return Inertia::render('Auth/GabungBanjar', [
            'banjars' => $banjars
        ]);
    });

    Route::post('/gabung-banjar', function (\Illuminate\Http\Request $request) {
        // 1. Validasi input berdasarkan desain yang baru (tanpa password)
        $request->validate([
            'role' => 'required|in:warga,anggota_banjar',
            'selectedBanjarId' => 'nullable|exists:banjar,id_banjar',
            'inviteCode' => 'nullable|string'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $role = $request->role;
        $banjarId = null;

        // 2. Jika memilih Anggota Banjar, validasi id banjar dan kodenya
        if ($role === 'anggota_banjar' && $request->selectedBanjarId) {
            $banjar = \Illuminate\Support\Facades\DB::table('banjar')->where('id_banjar', $request->selectedBanjarId)->first();
            
            // Cocokkan kode verifikasi (abaikan huruf besar/kecil)
            if ($banjar && strcasecmp(trim($banjar->kode_verifikasi), trim($request->inviteCode)) === 0) {
                $banjarId = $request->selectedBanjarId;
            } else {
                return back()->withErrors([
                    'inviteCode' => 'Kode verifikasi yang Anda masukkan salah untuk Banjar ini.'
                ])->withInput();
            }
        }

        // 3. Update role dan id_banjar user di database
        $user->update([
            'role' => $role,
            'id_banjar' => $banjarId
        ]);

        // 4. Arahkan ke halaman yang sesuai
        if ($role === 'anggota_banjar') {
            return redirect('/admin/dashboard')->with('success', 'Berhasil bergabung dengan Banjar!');
        } else {
            return redirect('/')->with('success', 'Berhasil masuk sebagai Pengguna Publik.');
        }
    });

    Route::post('/batal-gabung', function (\Illuminate\Http\Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Lempar kembali ke halaman register (langkah sebelumnya)
        return redirect('/register'); 
    });
});

// ========================================================================
// 5. JALUR HALAMAN ADMIN & ANGGOTA BANJAR
// ========================================================================
Route::middleware(['auth'])->prefix('admin')->group(function () {
    
    // ====================================================================
    // A. AREA BACA (READ-ONLY) - BISA DIAKSES ADMIN & ANGGOTA BANJAR
    // ====================================================================
    Route::get('/dashboard', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if ($user->role !== 'admin_banjar' && $user->role !== 'anggota_banjar') {
            abort(403, 'Unauthorized action.');
        }

        $banjar = Banjar::where('admin_id', $user->id)->orWhere('id_banjar', $user->id_banjar)->first();

        if (!$banjar) {
            return redirect('/')->with('error', 'Data banjar tidak ditemukan.');
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

    Route::get('/profil', function () {
        $user = Auth::user();
        $banjar = \App\Models\Banjar::where('admin_id', $user->id)->orWhere('id_banjar', $user->id_banjar)->first();

        return Inertia::render('admin/Profil', [
            'banjar' => $banjar ? [
                'name'      => $banjar->nama_banjar,
                'deskripsi' => $banjar->deskripsi,
                'phone'     => $banjar->no_wa_pengelola,
                'negara'    => $banjar->negara,
                'provinsi'  => $banjar->provinsi,
                'kota'      => $banjar->kota,
                'foto_url'  => $banjar->foto_profil ? asset('storage/' . $banjar->foto_profil) : null,
                'adminName' => $user->name,
                'email'     => $user->email,
                'username'  => $user->username ?? '',
            ] : null
        ]);
    });

    Route::get('/konten', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->orWhere('id_banjar', $user->id_banjar)->first();
        
        if (!$banjar) return redirect('/admin/profil');

        $kegiatan = Kegiatan::where('id_banjar', $banjar->id_banjar ?? $banjar->id)->get();
        $umkm = Umkm::where('id_banjar', $banjar->id_banjar ?? $banjar->id)->get();

        return Inertia::render('admin/Konten', [
            'kegiatan' => $kegiatan,
            'umkm' => $umkm
        ]);
    });

    Route::get('/peta', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->orWhere('id_banjar', $user->id_banjar)->first();
        
        return Inertia::render('admin/PetaAdmin', [
            'banjar' => $banjar
        ]); 
    });

    Route::get('/submit', function () { 
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Ambil SEMUA record banjar yang terikat dengan admin ini
        $banjarRecords = Banjar::where('admin_id', $user->id)->orWhere('id_banjar', $user->id_banjar)->get();
        
        $banjarIds = [];
        foreach ($banjarRecords as $b) {
            if (isset($b->id_banjar)) $banjarIds[] = $b->id_banjar;
            if (isset($b->id)) $banjarIds[] = $b->id;
        }
        if ($user->id_banjar) $banjarIds[] = $user->id_banjar;
        $banjarIds = array_unique(array_filter($banjarIds));

        $banjar = $banjarRecords->first();
        if (!$banjar && empty($banjarIds)) return redirect('/admin/profil');

        $kegiatanDraft = Kegiatan::whereIn('id_banjar', $banjarIds)->where('status_moderasi', 'draft')->get()->map(function($item) {
            return ['id' => 'kegiatan_' . $item->id_kegiatan, 'title' => $item->judul_kegiatan ?? 'Kegiatan Tanpa Judul', 'type' => 'kegiatan'];
        });

        $umkmDraft = Umkm::whereIn('id_banjar', $banjarIds)->where('status_moderasi', 'draft')->get()->map(function($item) {
            return ['id' => 'umkm_' . $item->id_umkm, 'title' => $item->nama_usaha ?? 'UMKM Tanpa Nama', 'type' => 'umkm'];
        });

        $drafts = $kegiatanDraft->concat($umkmDraft);

        $kegiatanHistory = Kegiatan::whereIn('id_banjar', $banjarIds)->whereIn('status_moderasi', ['pending', 'approved', 'rejected'])->get()->map(function($item) {
            return ['status' => $item->status_moderasi, 'title' => $item->judul_kegiatan ?? 'Kegiatan', 'date' => $item->updated_at->format('d M Y'), 'note' => ''];
        });

        $umkmHistory = Umkm::whereIn('id_banjar', $banjarIds)->whereIn('status_moderasi', ['pending', 'approved', 'rejected'])->get()->map(function($item) {
            return ['status' => $item->status_moderasi, 'title' => $item->nama_usaha ?? 'UMKM', 'date' => $item->updated_at->format('d M Y'), 'note' => ''];
        });

        $histories = $kegiatanHistory->concat($umkmHistory)->sortByDesc('date')->values();

        return Inertia::render('admin/Submit', [
            'banjar' => $banjar,
            'drafts' => $drafts,
            'histories' => $histories
        ]); 
    });

    Route::get('/password', function () { 
        $user = Auth::user();
        return Inertia::render('admin/Password', [
            'email' => $user->email
        ]); 
    });

    Route::put('/password', function (Illuminate\Http\Request $request) {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Password saat ini yang Anda masukkan salah.']);
        }

        $user->update([
            'password' => Illuminate\Support\Facades\Hash::make($request->password)
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    });

    // ====================================================================
    // B. AREA TULIS (WRITE) - KHUSUS HANYA UNTUK ADMIN BANJAR
    // ====================================================================
    Route::middleware(['role:admin_banjar'])->group(function () {
        
       // 1. MANAJEMEN WARGA (Melihat Data Warga & Kode Verifikasi)
        Route::get('/warga', function () { 
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $banjar = Banjar::where('admin_id', $user->id)->first();

            if (!$banjar) {
                return redirect('/admin/profil')->with('error', 'Silakan lengkapi profil banjar Anda terlebih dahulu.');
            }

            $durasiMenit = 5; 
            $cacheKey = 'kode_banjar_' . ($banjar->id_banjar ?? $banjar->id);
            $kodeSekarang = Illuminate\Support\Facades\Cache::remember($cacheKey, now()->addMinutes($durasiMenit), function () use ($banjar) {
                $kodeBaru = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
                $banjar->update(['kode_verifikasi' => $kodeBaru]);
                return $kodeBaru;
            });

            $daftarWarga = User::where('id_banjar', $banjar->id_banjar ?? $banjar->id)
                               ->where('id', '!=', $user->id) 
                               ->get();

            return Inertia::render('admin/Warga', [
                'banjar' => [
                    'kode_verifikasi' => $kodeSekarang 
                ],
                'warga' => $daftarWarga
            ]); 
        });

        // ====================================================================
        // TAMBAHKAN RUTE AKSI WARGA DI SINI (UNTUK TOMBOL EDIT, SUSPEND, HAPUS)
        // ====================================================================

        // A. Edit Data Warga
        Route::put('/warga/{id}', function (Illuminate\Http\Request $request, $id) {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $id,
            ]);

            $warga = User::findOrFail($id);
            $warga->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            return back()->with('success', 'Data warga berhasil diperbarui.');
        });

        // B. Ubah Status / Suspend Warga
        Route::patch('/warga/{id}/status', function (Illuminate\Http\Request $request, $id) {
            $warga = User::findOrFail($id);
            // Toggle atau ubah status (misal dari aktif ke suspend/pending)
            $statusBaru = $request->input('status_akun', 'aktif');
            $warga->update(['status_akun' => $statusBaru]);

            return back()->with('success', 'Status akun warga berhasil diubah.');
        });

        // C. Hapus Warga dari Banjar
        Route::delete('/warga/{id}', function ($id) {
            $warga = User::findOrFail($id);
            // Opsional: Jika ingin benar-benar hapus akun atau melepas ikatan banjar
            // $warga->delete(); // Jika ingin hapus permanen akunnya
            
            // Atau cukup keluarkan dari banjar:
            $warga->update(['id_banjar' => null]);

            return back()->with('success', 'Warga berhasil dihapus dari daftar.');
        });

        // 2. SIMPAN & UPDATE PROFIL
        Route::post('/profil/update', function (Illuminate\Http\Request $request) {
            /** @var \App\Models\User $user */
            $user = Auth::user();

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

            if ($request->hasFile('foto_profil')) {
                $path = $request->file('foto_profil')->store('profil_banjar', 'public');
                $dataBanjar['foto_profil'] = $path;
            }

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

            return back();
        });
        
        // 3. UPDATE PETA
        Route::patch('/peta/update', [BanjarController::class, 'updatePeta']);

        // 4. SUBMIT KONTEN KE SUPER ADMIN
        Route::post('/submit-konten/{id}', function ($id) {
            $parts = explode('_', $id);
            if (count($parts) == 2) {
                $type = $parts[0];
                $realId = $parts[1];
                if ($type === 'kegiatan') Kegiatan::where('id_kegiatan', $realId)->update(['status_moderasi' => 'pending']);
                else if ($type === 'umkm') Umkm::where('id_umkm', $realId)->update(['status_moderasi' => 'pending']);
            }
            return back();
        });
        

        // 5. TAMBAH & EDIT KEGIATAN 
        Route::post('/kegiatan', function (Illuminate\Http\Request $request) {
            $user = Auth::user();
            $banjar = Banjar::where('admin_id', $user->id)->first();
            
            $request->validate([
                'judul_kegiatan' => 'required|string|max:255', 
                'tanggal'        => 'required|date',          
                'deskripsi'      => 'nullable|string', 
                'no_wa_panitia'  => 'nullable|string',
                'lokasi'         => 'nullable|string|max:255', 
                'foto_kegiatan'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048' 
            ]);

            $data = $request->only(['judul_kegiatan', 'tanggal', 'deskripsi', 'lokasi']);
            if ($request->filled('no_wa_panitia')) {
                $data['no_wa_panitia'] = $request->no_wa_panitia; 
            }
            $data['id_banjar'] = $banjar->id_banjar ?? $banjar->id;
            $data['status_moderasi'] = 'draft';

            if ($request->hasFile('foto_kegiatan')) {
                $data['foto_kegiatan'] = $request->file('foto_kegiatan')->store('kegiatan_foto', 'public');
            }

            Kegiatan::create($data);
            return back();
        });

      Route::post('/kegiatan/{id}', function (Illuminate\Http\Request $request, $id) {
            $request->validate([
                'judul_kegiatan' => 'required|string|max:255', 
                'tanggal'        => 'required|date',          
                'deskripsi'      => 'nullable|string', 
                'no_wa_panitia'  => 'nullable|string',
                'lokasi'         => 'nullable|string|max:255', 
                'foto_kegiatan'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048' 
            ]);

            $kegiatan = Kegiatan::findOrFail($id);
            $data = $request->only(['judul_kegiatan', 'tanggal', 'deskripsi', 'lokasi']);
            if ($request->filled('no_wa_panitia')) {
                $data['no_wa_panitia'] = $request->no_wa_panitia; 
            }

            if ($request->hasFile('foto_kegiatan')) {
                $data['foto_kegiatan'] = $request->file('foto_kegiatan')->store('kegiatan_foto', 'public');
            }

            $kegiatan->update($data);
            return back();
        });

        // 6. TAMBAH & EDIT UMKM
        Route::post('/umkm', function (Illuminate\Http\Request $request) {
            $user = Auth::user();
            $banjar = Banjar::where('admin_id', $user->id)->first();
            
            $request->validate([
                'nama_usaha'       => 'required|string|max:255',
                'deskripsi_produk' => 'nullable|string', 
                'harga'            => 'nullable|numeric',
                'no_wa_penjual'    => 'nullable|string',
                'lokasi'           => 'nullable|string|max:255',
                'foto_produk'      => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
            ]);

            $data = $request->only(['nama_usaha', 'deskripsi_produk', 'harga', 'no_wa_penjual', 'lokasi']);
            $data['id_banjar'] = $banjar->id_banjar ?? $banjar->id;
            $data['status_moderasi'] = 'draft';

            if ($request->hasFile('foto_produk')) {
                $data['foto_produk'] = $request->file('foto_produk')->store('umkm_foto', 'public');
            }

            Umkm::create($data);
            return back();
        });

       Route::post('/umkm/{id}', function (Illuminate\Http\Request $request, $id) {
            $request->validate([
                'nama_usaha'       => 'required|string|max:255',
                'deskripsi_produk' => 'nullable|string', 
                'harga'            => 'nullable|numeric',
                'no_wa_penjual'    => 'nullable|string',
                'lokasi'           => 'nullable|string|max:255',
                'foto_produk'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
            ]);

            $umkm = Umkm::findOrFail($id);
            $data = $request->only(['nama_usaha', 'deskripsi_produk', 'harga', 'no_wa_penjual', 'lokasi']);

            if ($request->hasFile('foto_produk')) {
                $data['foto_produk'] = $request->file('foto_produk')->store('umkm_foto', 'public');
            }

            $umkm->update($data);
            return back();
        });
    }); // <-- PENUTUP GRUP KHUSUS ADMIN BANJAR
});

// ========================================================================
// 6. JALUR HALAMAN SUPER ADMIN (Hanya untuk super_admin)
// ========================================================================
Route::middleware(['auth', 'role:super_admin'])->prefix('superadmin')->group(function () {
    
    // DASHBOARD SUPER ADMIN
    Route::get('/dashboard', function () { 
        /** @var \App\Models\User $user */
        $user = \Illuminate\Support\Facades\Auth::user();

        $totalBanjar = \App\Models\Banjar::where('status_akun', 'aktif')->count();
        $menungguModerasi = \App\Models\Banjar::where('status_akun', 'pending')->count();
        $banjarBaru = \App\Models\Banjar::whereMonth('created_at', date('m'))->count();
        $totalViews = \App\Models\Banjar::sum('total_views') ?? 0;
        
        $totalUmkm = \App\Models\Umkm::count();
        $totalPengguna = \App\Models\User::where('role', 'warga')->count(); 
        $kegiatanAktif = \App\Models\Kegiatan::where('status_moderasi', 'approved')->count();

        $pendaftaranBaru = \App\Models\Banjar::where('status_akun', 'pending')
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

        $banjarPerKota = \App\Models\Banjar::select('kota', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                               ->groupBy('kota')
                               ->orderByDesc('total')
                               ->take(5)
                               ->get();
                               
        $maxTotal = $banjarPerKota->max('total') ?: 1; 
        $sebaranWilayah = $banjarPerKota->map(function ($item) use ($maxTotal) {
            return [
                'label' => $item->kota ?: 'Tidak Diketahui',
                'value' => $item->total,
                'percentage' => round(($item->total / $maxTotal) * 100) . '%'
            ];
        });

        return inertia('superadmin/Dashboard', [
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
    })->name('superadmin.dashboard');

    // MODERASI
    Route::get('/moderasi', function () { 
        $kegiatanPending = Kegiatan::where('status_moderasi', 'pending')->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return [
                'id' => $item->id_kegiatan, 
                'type' => 'kegiatan', 
                'title' => $item->judul_kegiatan ?? 'Kegiatan Tanpa Judul', 
                'location' => ($banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui') . ' · ' . $item->created_at->format('d M Y'), 
                'description' => $item->deskripsi, 
                'badge' => 'Kegiatan',
                'lokasi_spesifik' => $item->lokasi,
                'foto_url' => $item->foto_kegiatan ? asset('storage/' . $item->foto_kegiatan) : null
            ];
        });

        $umkmPending = Umkm::where('status_moderasi', 'pending')->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return [
                'id' => $item->id_umkm, 
                'type' => 'umkm', 
                'title' => $item->nama_usaha ?? 'UMKM Tanpa Nama',
                'location' => ($banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui') . ' · ' . $item->created_at->format('d M Y'), 
                'description' => $item->deskripsi_produk, 
                'badge' => 'UMKM',
                'lokasi_spesifik' => $item->lokasi,
                'foto_url' => $item->foto_produk ? asset('storage/' . $item->foto_produk) : null
            ];
        });

        $antrian = $kegiatanPending->concat($umkmPending);

        $kegiatanRiwayat = Kegiatan::whereIn('status_moderasi', ['approved', 'rejected'])->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return ['id' => $item->id_kegiatan, 'type' => 'kegiatan', 'title' => $item->judul_kegiatan ?? 'Kegiatan', 'location' => ($banjar ? $banjar->nama_banjar : 'Banjar') . ' · ' . $item->updated_at->format('d M Y'), 'status' => $item->status_moderasi, 'note' => $item->catatan_moderasi, 'badge' => 'Kegiatan'];
        });

        $umkmRiwayat = Umkm::whereIn('status_moderasi', ['approved', 'rejected'])->get()->map(function($item) {
            $banjar = Banjar::where('id_banjar', $item->id_banjar)->first();
            return ['id' => $item->id_umkm, 'type' => 'umkm', 'title' => $item->nama_usaha ?? 'UMKM', 'location' => ($banjar ? $banjar->nama_banjar : 'Banjar') . ' · ' . $item->updated_at->format('d M Y'), 'status' => $item->status_moderasi, 'note' => $item->catatan_moderasi, 'badge' => 'UMKM'];
        });

        $riwayat = $kegiatanRiwayat->concat($umkmRiwayat)->sortByDesc('location')->values();

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

    Route::post('/moderasi/proses', function (Illuminate\Http\Request $request) {
        $type = $request->input('type');
        $id = $request->input('id');
        $status = $request->input('status'); 
        $catatan = $request->input('catatan');

        if ($type === 'kegiatan') Kegiatan::where('id_kegiatan', $id)->update(['status_moderasi' => $status, 'catatan_moderasi' => $catatan]);
        elseif ($type === 'umkm') Umkm::where('id_umkm', $id)->update(['status_moderasi' => $status, 'catatan_moderasi' => $catatan]);
        
        return back();
    });

    // PANTAU PLATFORM 
    Route::get('/pantau', function () { 
        \Carbon\Carbon::setLocale('id'); 
        $today = \Carbon\Carbon::today();

        $kegiatanHariIni = Kegiatan::whereDate('created_at', $today)->count();
        $umkmHariIni = Umkm::whereDate('created_at', $today)->count();
        
        $metrics = [
            'total_admin' => User::where('role', 'admin_banjar')->count(),
            'konten_disubmit' => $kegiatanHariIni + $umkmHariIni,
            'profil_diperbarui' => Banjar::whereDate('updated_at', $today)->count(),
            'banjar_baru' => Banjar::whereDate('created_at', $today)->count(),
        ];
        
        $recentKegiatan = Kegiatan::latest('updated_at')->take(5)->get()->map(function($k) {
            $banjar = Banjar::where('id_banjar', $k->id_banjar)->first();
            $date = \Carbon\Carbon::parse($k->updated_at); 
            return ['title' => $banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui', 'desc' => 'Submit kegiatan baru: ' . ($k->judul_kegiatan ?? 'Tanpa Judul'), 'timestamp' => $date, 'time' => $date->diffForHumans(), 'dotColor' => '#C9861A'];
        });

        $recentUmkm = Umkm::latest('updated_at')->take(5)->get()->map(function($u) {
            $banjar = Banjar::where('id_banjar', $u->id_banjar)->first();
            $date = \Carbon\Carbon::parse($u->updated_at);
            return ['title' => $banjar ? $banjar->nama_banjar : 'Banjar Tidak Diketahui', 'desc' => 'UMKM baru ditambahkan: ' . ($u->nama_usaha ?? 'Tanpa Nama'), 'timestamp' => $date, 'time' => $date->diffForHumans(), 'dotColor' => '#4A9E60'];
        });

        $recentBanjar = Banjar::latest('updated_at')->take(5)->get()->map(function($b) {
            $date = \Carbon\Carbon::parse($b->updated_at);
            return ['title' => $b->nama_banjar ?? 'Banjar Baru', 'desc' => 'Memperbarui profil banjar', 'timestamp' => $date, 'time' => $date->diffForHumans(), 'dotColor' => '#E6BA75'];
        });

        $activities = collect()->concat($recentKegiatan)->concat($recentUmkm)->concat($recentBanjar)->sortByDesc('timestamp')->values()->take(5)->map(function($item) {
            unset($item['timestamp']); 
            return $item;
        });

        return Inertia::render('superadmin/Pantau', [
            'metrics' => $metrics,
            'activities' => $activities
        ]); 
    });

    // STATISTIK GLOBAL SUPER ADMIN
    Route::get('/statistik', function () { 
        $totalBanjar = \App\Models\Banjar::count();
        $banjarAktif = \App\Models\Banjar::where('status_akun', 'aktif')->count();
        $banjarPending = \App\Models\Banjar::where('status_akun', 'pending')->count();
        $totalUmkm = \App\Models\Umkm::count();
        $totalUsers = \App\Models\User::where('role', 'warga')->count(); 
        $banjarBaru = \App\Models\Banjar::whereMonth('created_at', date('m'))->whereYear('created_at', date('Y'))->count();

        $grafikPertumbuhan = \App\Models\Banjar::select(DB::raw('MONTH(created_at) as bulan'), DB::raw('count(*) as total'))
        ->whereYear('created_at', date('Y'))
        ->groupBy('bulan')
        ->orderBy('bulan')
        ->pluck('total', 'bulan')->toArray();

        $dataPertumbuhan = [];
        for ($i = 1; $i <= 7; $i++) {
            $dataPertumbuhan[] = [
                'bulan' => date('M', mktime(0, 0, 0, $i, 1)), 
                'total' => $grafikPertumbuhan[$i] ?? 0 
            ];
        }

        $banjarPerKota = \App\Models\Banjar::select('kota', DB::raw('count(*) as total'))
                               ->whereNotNull('kota')
                               ->groupBy('kota')
                               ->orderByDesc('total')
                               ->take(6)
                               ->get();

        $maxTotal = $banjarPerKota->max('total') ?: 1; 
        $totalSemuaKota = $banjarPerKota->sum('total') ?: 1; 

        $sebaranWilayah = $banjarPerKota->map(function ($item) use ($maxTotal, $totalSemuaKota) {
            return [
                'label' => $item->kota,
                'value' => $item->total,
                'percentage' => round(($item->total / $maxTotal) * 100) . '%',
                'displayPct' => round(($item->total / $totalSemuaKota) * 100) . '%'
            ];
        });

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

    Route::get('/buat-banjar', function () {
        return Inertia::render('superadmin/BuatBanjar');
    });

   Route::post('/buat-banjar', function (\Illuminate\Http\Request $request) {
        // 1. Validasi Inputan Lengkap (Banjar & Admin)
        $request->validate([
            // Validasi Wilayah Banjar
            'nama_banjar'    => 'required|string|max:255',
            'negara'         => 'required|string',
            'provinsi'       => 'required|string',
            'kota'           => 'required|string',
            'kecamatan'      => 'required|string',
            'deskripsi'      => 'nullable|string',

            // Validasi Akun Admin
            'admin_name'     => 'required|string|max:255',
            'admin_username' => 'required|string|max:50|unique:users,username',
            'admin_email'    => 'required|email|max:255|unique:users,email',
            'password'       => 'required|string|min:6',
        ]);

        // Gunakan DB Transaction agar jika salah satu gagal, semua dibatalkan (Rollback)
        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            // 2. Simpan Data Banjar Terlebih Dahulu
            $banjar = \App\Models\Banjar::create([
                'nama_banjar' => $request->nama_banjar,
                'negara'      => $request->negara,
                'provinsi'    => $request->provinsi,
                'kota'        => $request->kota,
                'kecamatan'   => $request->kecamatan,
                'deskripsi'   => $request->deskripsi,
                'status_akun' => 'aktif', 
            ]);

            // Ambil ID Banjar yang baru dibuat
            $banjarId = $banjar->id_banjar ?? $banjar->id;

            // 3. Simpan Akun Admin Banjar
            $admin = \App\Models\User::create([
                'name'        => $request->admin_name,
                'username'    => $request->admin_username,
                'email'       => $request->admin_email,
                'password'    => \Illuminate\Support\Facades\Hash::make($request->password), // Enkripsi Sandi
                'role'        => 'admin_banjar',
                'id_banjar'   => $banjarId, // Hubungkan Admin ini ke Banjar tadi
                'status_akun' => 'aktif', 
            ]);

            // 4. Update kolom admin_id di tabel Banjar
            \App\Models\Banjar::where('id_banjar', $banjarId)->update([
                'admin_id' => $admin->id
            ]);

            // Jika semua berhasil, simpan permanen ke Database
            \Illuminate\Support\Facades\DB::commit();

            return back()->with('success', 'Banjar & Akun Admin berhasil didaftarkan!');

        } catch (\Exception $e) {
            // Jika ada error (misal database mati di tengah jalan), batalkan semua inputan
            \Illuminate\Support\Facades\DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    });

   // ====================================================================
    // MANAJEMEN ADMIN (Tampilkan Detail untuk Direview Super Admin)
    // ====================================================================
    Route::get('/manajemen-admin', function () { 
        $admins = \App\Models\User::where('role', 'admin_banjar')
            ->orderBy('created_at', 'desc') // Urutkan dari pendaftar paling baru
            ->get()
            ->map(function($user) {
                // Tarik data profil Banjar untuk direview Super Admin
                $banjar = \App\Models\Banjar::where('admin_id', $user->id)->first();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'status_akun' => $user->status_akun ?? 'pending',
                    // --- TAMBAHAN DETAIL PROFIL BANJAR ---
                    'nama_banjar' => $banjar ? $banjar->nama_banjar : 'Belum ada data',
                    'provinsi' => $banjar ? $banjar->provinsi : '-',
                    'kota' => $banjar ? $banjar->kota : '-',
                    'kecamatan' => $banjar ? $banjar->kecamatan : '-',
                    'no_wa_pengelola' => $banjar ? $banjar->no_wa_pengelola : '-'
                ];
            });

        return inertia('superadmin/ManajemenAdmin', [
            'admins' => $admins
        ]); 
    })->name('superadmin.manajemen-admin');

    // ====================================================================
    // AKSI VALIDASI OLEH SUPER ADMIN
    // ====================================================================
    Route::post('/ubah-status-admin/{id_user}', function (\Illuminate\Http\Request $request, $id_user) {
        $admin = \App\Models\User::findOrFail($id_user);
        $banjar = \App\Models\Banjar::where('admin_id', $id_user)->first();
        
        $aksi = $request->input('aksi'); 
        
        if ($aksi === 'aktif') {
            // Cukup ubah status jadi aktif. Password sudah dikirim via email saat mendaftar.
            $admin->update(['status_akun' => 'aktif']);
            if ($banjar) $banjar->update(['status_akun' => 'aktif']);
            
            return back()->with('success', 'Akun divalidasi! Admin Banjar sekarang bisa login.');

        } elseif ($aksi === 'tolak') {
            $admin->update(['status_akun' => 'ditolak']);
            if ($banjar) $banjar->update(['status_akun' => 'ditolak']);
            
            return back()->with('success', 'Pendaftaran berhasil ditolak.');

        } elseif ($aksi === 'suspend') {
            $admin->update(['status_akun' => 'suspend']);
            if ($banjar) $banjar->update(['status_akun' => 'suspend']);
            
            return back()->with('success', 'Akun berhasil ditangguhkan.');
        }

        return back();
    });

    // ====================================================================
    // RESET PASSWORD ADMIN BANJAR (Hanya untuk Super Admin)
    // ====================================================================
    Route::patch('/reset-password/{id_user}', function ($id_user) {
        $admin = \App\Models\User::findOrFail($id_user);
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
        $sandiBaru = substr(str_shuffle($chars), 0, 8);
        $admin->update(['password' => \Illuminate\Support\Facades\Hash::make($sandiBaru)]);
        return back()->with('flash_sandi_baru', "Sandi baru untuk {$admin->name} adalah: $sandiBaru");
    });
});
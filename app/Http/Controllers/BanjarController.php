<?php

namespace App\Http\Controllers;

use App\Models\Banjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Kegiatan;
use App\Models\Umkm;
use Inertia\Inertia;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Mail; // Tambahan untuk email
use Illuminate\Support\Str; // Tambahan untuk random string

class BanjarController
{
    public function index() {
        return Banjar::all();
    }

    public function show($id) {
        return Banjar::findOrFail($id);
    }

    public function login(Request $request) {
        // 1. Validasi input wajib diisi
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Buat kunci gembok unik berdasarkan Email + IP Address pengguna
        $throttleKey = strtolower($request->email) . '|' . $request->ip();

        // 3. Cek apakah orang ini sudah gagal login 5 kali berturut-turut?
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            
            return back()->withErrors([
                'email' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam ' . $seconds . ' detik.',
            ])->withInput();
        }

        $credentials = $request->only('email', 'password');

        // 4. Proses pencocokan ke Database
        if (Auth::attempt($credentials, true)) {
            $user = Auth::user();

            // --- PROTEKSI STATUS AKUN ---
            if ($user->status_akun === 'pending') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return back()->withErrors(['email' => 'Akun Anda sedang diverifikasi oleh Super Admin. Harap tunggu persetujuan.']);
            }
            if ($user->status_akun === 'ditolak') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return back()->withErrors(['email' => 'Maaf, pendaftaran Banjar Anda ditolak oleh Super Admin.']);
            }
            if ($user->status_akun === 'suspend') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return back()->withErrors(['email' => 'Akun Anda sedang ditangguhkan. Silakan hubungi Super Admin.']);
            }
            // -----------------------------

            // Yey berhasil dan akun aktif! Hapus rekam jejak kegagalannya
            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            // Pengarahan berdasarkan role
            if ($user->role === 'super_admin') {
                return redirect()->to('/superadmin/dashboard');
            } elseif ($user->role === 'admin_banjar' || $user->role === 'anggota_banjar') {
                return redirect()->to('/admin/dashboard'); 
            } else {
                return redirect()->to('/'); 
            }
        }

        // 5. Jika password salah, catat sebagai 1x pelanggaran.
        RateLimiter::hit($throttleKey, 60);

        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ])->withInput();
    }

    public function showRegister()
    {
        $banjars = Banjar::where('status_akun', 'aktif')->get();
        return Inertia::render('Auth/Register', [
            'banjars' => $banjars
        ]);
    }

    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:warga,admin_banjar',
            'banjarName' => 'required_if:role,admin_banjar|nullable|string|max:255',
            'negara' => 'nullable|string|max:100',
            'provinsi' => 'nullable|string|max:100',
            'kota' => 'nullable|string|max:100',
            'kecamatan' => 'required_if:role,admin_banjar|nullable|string|max:100',
            'deskripsi' => 'nullable|string',
            'selectedBanjarId' => 'nullable|exists:banjar,id_banjar',
            'inviteCode' => 'nullable|string',
            'phone' => 'nullable|string|max:20'
        ]);

        $banjarId = null;
        $userRole = $request->role; 

        // 1. JIKA MENDAFTAR SEBAGAI ADMIN BANJAR (Membuat Banjar Baru)
        if ($userRole === 'admin_banjar') {
            $newBanjar = Banjar::create([
                'nama_banjar' => $request->banjarName,
                'negara' => $request->negara,
                'provinsi' => $request->provinsi,
                'kota' => $request->kota,
                'kecamatan' => $request->kecamatan,
                'deskripsi' => $request->deskripsi,
                'status_akun' => 'pending', // Menunggu verifikasi super admin
                'no_wa_pengelola' => $request->phone,
            ]);
            $banjarId = $newBanjar->id_banjar ?? $newBanjar->id;
        }

        // 2. JIKA MENDAFTAR SEBAGAI WARGA DENGAN KODE UNDANGAN
        if (!empty($request->selectedBanjarId)) {
            $banjar = DB::table('banjar')->where('id_banjar', $request->selectedBanjarId)->first();
            
            if ($banjar && strcasecmp(trim($banjar->kode_verifikasi), trim($request->inviteCode)) === 0) {
                $banjarId = $request->selectedBanjarId;
                if ($userRole === 'warga') {
                    $userRole = 'anggota_banjar';
                }
            } else {
                return back()->withErrors([
                    'inviteCode' => 'Kode undangan yang Anda masukkan salah untuk Banjar ini.'
                ])->withInput();
            }
        }

        // 3. BUAT AKUN USER BARU (DAN GENERATE PASSWORD UNTUK ADMIN BANJAR)
        $passwordToSave = $request->password; // Default: apa yang diketik oleh warga
        $passwordAcak = null;

        if ($userRole === 'admin_banjar') {
            $passwordAcak = Str::random(8); // Override password yang diketik dengan yang acak!
            $passwordToSave = $passwordAcak;
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($passwordToSave), 
            'role' => $userRole,
            'id_banjar' => $banjarId,
            'status_akun' => $userRole === 'admin_banjar' ? 'pending' : 'aktif',
        ]);

        if ($userRole === 'admin_banjar' && $banjarId) {
            Banjar::where('id_banjar', $banjarId)->update(['admin_id' => $user->id]);
            
            // --- KIRIM EMAIL PASSWORD OTOMATIS KE ADMIN BANJAR ---
            try {
                Mail::html("
                    <div style='font-family: sans-serif; padding: 20px;'>
                        <h2 style='color: #C9861A;'>Pendaftaran Banjar.id Sedang Diproses</h2>
                        <p>Halo <strong>{$user->name}</strong>,</p>
                        <p>Terima kasih telah mendaftarkan <strong>{$request->banjarName}</strong>.</p>
                        <p>Saat ini akun Anda sedang <strong>menunggu verifikasi</strong> oleh tim Super Admin kami.</p>
                        <p>Berikut adalah informasi akses Anda nanti setelah disetujui:</p>
                        <div style='background: #FAF4EC; padding: 15px; border-radius: 8px; border: 1px solid #7B2D1E;'>
                            Email: <strong>{$user->email}</strong><br>
                            Password Anda: <strong>{$passwordAcak}</strong>
                        </div>
                        <p>Harap simpan password ini. Anda baru bisa masuk setelah Super Admin memvalidasi data Banjar Anda.</p>
                    </div>
                ", function ($message) use ($user) {
                    $message->to($user->email)
                            ->subject('Pendaftaran Banjar Anda Sedang Diproses');
                });
            } catch (\Exception $e) {
                // Abaikan jika email gagal terkirim agar data tetap masuk ke database
            }

            // Lempar kembali ke halaman login, JANGAN LANGSUNG LOGIN!
            return redirect('/login')->with('success', 'Pendaftaran berhasil dikirim! Silakan cek email Anda untuk mendapatkan Password. Akun sedang diverifikasi.');
        }

        // JIKA YANG DAFTAR ADALAH WARGA: Langsung Login
        Auth::login($user);

        if ($user->role === 'admin_banjar' || $user->role === 'anggota_banjar') {
            return redirect('/admin/dashboard');
        } else {
            return redirect('/');
        }
    }

    public function sendResetToken(Request $request)
{
    // 1. Validasi Input Email
    $request->validate([
        'email' => 'required|email|exists:users,email'
    ], [
        'email.exists' => 'Email ini tidak terdaftar di sistem kami.'
    ]);

    // Cari data user berdasarkan email
    $user = User::where('email', $request->email)->first();

    // =========================================================
    // 2. BLOKIR SUPER ADMIN DARI FITUR INI
    // =========================================================
    if ($user->role === 'super_admin') {
        return back()->withErrors([
            'email' => 'Akun Super Admin tidak dapat mereset sandi melalui halaman ini demi keamanan. Silakan hubungi Database Administrator.'
        ]);
    }

    // =========================================================
    // 3. GEMBOK ANTI-SPAM UNTUK PENGGUNA LAIN (Admin Banjar & Warga)
    // =========================================================
    // Orang hanya bisa request lupa sandi 1 kali setiap 30 menit per email
    $throttleKey = 'reset-password:' . strtolower($request->email);

    if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
        $seconds = RateLimiter::availableIn($throttleKey);
        $minutes = ceil($seconds / 60);
        return back()->withErrors([
            'email' => 'Permintaan sandi baru sudah dikirim sebelumnya. Silakan cek email Anda atau tunggu ' . $minutes . ' menit lagi.'
        ]);
    }
    
    // 4. Buat sandi sementara acak 8 karakter
    $sandiBaru = Str::random(8);
    
    // 5. Simpan ke database dengan di-hash
    $user->update([
        'password' => Hash::make($sandiBaru)
    ]);

    try {
        // 6. Kirim email berisi sandi sementara
        Mail::html("
            <div style='font-family: sans-serif; padding: 20px; color: #1E1208;'>
                <h2 style='color: #7B2D1E;'>Permintaan Sandi Baru - banjar.id</h2>
                <p>Halo <strong>{$user->name}</strong>,</p>
                <p>Kami menerima permintaan untuk mereset kata sandi akun Anda.</p>
                <p>Berikut adalah kata sandi sementara Anda:</p>
                <div style='background: #FAF4EC; padding: 15px; border-radius: 8px; border: 1px solid #7B2D1E; font-size: 20px; font-weight: bold; letter-spacing: 2px;'>
                    {$sandiBaru}
                </div>
                <p style='margin-top: 15px;'>Silakan masuk menggunakan kata sandi ini, lalu segera ubah kata sandi Anda melalui menu profil demi keamanan akun.</p>
                <p style='font-size: 12px; color: #7A6555; margin-top: 20px;'>Jika Anda tidak merasa meminta perubahan sandi ini, abaikan email ini atau hubungi pengurus Banjar Anda.</p>
            </div>
        ", function ($message) use ($user) {
            $message->to($user->email)->subject('Reset Kata Sandi Banjar.id');
        });

        // 7. Kunci fitur ini untuk email tersebut selama 30 menit (1800 detik) agar tidak dis-spam
        RateLimiter::hit($throttleKey, 1800);

        return back()->with('success', 'Kata sandi sementara telah dikirim ke email Anda. Silakan cek kotak masuk.');
    } catch (\Exception $e) {
        return back()->withErrors(['email' => 'Gagal mengirim email. Pastikan konfigurasi mail server aktif.']);
    }
}

public function updatePasswordWarga(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
            'password.min' => 'Kata sandi baru minimal harus 8 karakter.',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Cek apakah kata sandi saat ini (atau sandi sementara) benar
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Kata sandi saat ini yang Anda masukkan salah.'
            ]);
        }

        // 2. Perbarui dengan kata sandi baru yang di-hash
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return back()->with('success', 'Kata sandi berhasil diperbarui! Silakan gunakan kata sandi baru Anda ke depannya.');
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function updatePeta(Request $request)
    {
        $request->validate([
            'lat' => 'nullable|string',
            'lng' => 'nullable|string',
            'link_peta' => 'nullable|string',
        ]);

        $banjar = Banjar::where('admin_id', Auth::id())->firstOrFail();
        
        $banjar->update([
            'latitude' => $request->lat,
            'longitude' => $request->lng,
            'link_peta' => $request->link_peta,
        ]);

        return back()->with('success', 'Lokasi berhasil diperbarui!');
    }

   public function storeKegiatan(Request $request)
    {
        $request->validate([
            'judul_kegiatan' => 'required|string|max:150',
            'deskripsi'      => 'nullable|string',
            'tanggal'        => 'nullable|date',
            'lokasi'         => 'nullable|string|max:255',
            'foto_kegiatan'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
        ]);

        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->firstOrFail();

        $fotoUrl = null;
        if ($request->hasFile('foto_kegiatan')) {
            $path = $request->file('foto_kegiatan')->store('kegiatan', 'public');
            $fotoUrl = '/storage/' . $path; 
        }

        Kegiatan::create([
            'id_banjar'       => $banjar->id_banjar ?? $banjar->id, 
            'judul_kegiatan'  => $request->judul_kegiatan,
            'deskripsi'       => $request->deskripsi,
            'tanggal'         => $request->tanggal,
            'lokasi'          => $request->lokasi,
            'foto_kegiatan'   => $fotoUrl,
            'status_moderasi' => 'draft'
        ]);

        return back()->with('success', 'Kegiatan berhasil disimpan sebagai draf.');
    }

    public function storeUmkm(Request $request)
    {
        $request->validate([
            'nama_usaha'       => 'required|string|max:150',
            'deskripsi_produk' => 'nullable|string',
            'harga'            => 'nullable|integer',
            'no_wa_penjual'    => 'nullable|string|max:20',
            'lokasi'           => 'nullable|string|max:255',
            'foto_produk'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = Auth::user();
        $banjar = Banjar::where('admin_id', $user->id)->firstOrFail();

        $fotoUrl = null;
        if ($request->hasFile('foto_produk')) {
            $path = $request->file('foto_produk')->store('umkm', 'public');
            $fotoUrl = '/storage/' . $path;
        }

        umkm::create([
            'id_banjar'        => $banjar->id_banjar ?? $banjar->id, 
            'nama_usaha'       => $request->nama_usaha,
            'deskripsi_produk' => $request->deskripsi_produk,
            'harga'            => $request->harga,
            'no_wa_penjual'    => $request->no_wa_penjual,
            'lokasi'           => $request->lokasi,
            'foto_produk'      => $fotoUrl,
            'status_moderasi'  => 'draft'
        ]);

        return back()->with('success', 'Data UMKM berhasil disimpan sebagai draf.');
    }

    public function updateKegiatan(Request $request, $id)
    {
        $kegiatan = Kegiatan::findOrFail($id);
        
        $request->validate([
            'judul_kegiatan' => 'required|string|max:150',
            'deskripsi'      => 'nullable|string',
            'tanggal'        => 'nullable|date',
            'lokasi'         => 'nullable|string|max:255',
            'foto_kegiatan'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('foto_kegiatan')) {
            $path = $request->file('foto_kegiatan')->store('kegiatan', 'public');
            $kegiatan->foto_kegiatan = '/storage/' . $path; 
        }

        $kegiatan->judul_kegiatan = $request->judul_kegiatan;
        $kegiatan->deskripsi = $request->deskripsi;
        $kegiatan->tanggal = $request->tanggal;
        $kegiatan->lokasi = $request->lokasi;
        $kegiatan->save();

        return back()->with('success', 'Kegiatan berhasil diperbarui.');
    }

    public function updateUmkm(Request $request, $id)
    {
        $umkm = Umkm::findOrFail($id);

        $request->validate([
            'nama_usaha'       => 'required|string|max:150',
            'deskripsi_produk' => 'nullable|string',
            'harga'            => 'nullable|integer',
            'no_wa_penjual'    => 'nullable|string|max:20',
            'lokasi'           => 'nullable|string|max:255',
            'foto_produk'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('foto_produk')) {
            $path = $request->file('foto_produk')->store('umkm', 'public');
            $umkm->foto_produk = '/storage/' . $path;
        }

        $umkm->nama_usaha = $request->nama_usaha;
        $umkm->deskripsi_produk = $request->deskripsi_produk;
        $umkm->harga = $request->harga;
        $umkm->no_wa_penjual = $request->no_wa_penjual;
        $umkm->lokasi = $request->lokasi;
        $umkm->save();

        return back()->with('success', 'Data UMKM berhasil diperbarui.');
    }
}
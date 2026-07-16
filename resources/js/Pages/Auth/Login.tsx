import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { MapPin, Eye, EyeOff, ShieldCheck, Building2, Globe } from "lucide-react";

type Role = "superadmin" | "admin" | "publik";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  // 1. INERTIA: Menggunakan useForm untuk menangani input dan submit ke Laravel
  const { data, setData, post, processing, errors } = useForm({
    role: "admin" as Role, // Menyimpan role agar backend tahu user mau login sebagai apa
    email: "",
    password: "",
  });

  const roles: { id: Role; label: string; icon: typeof ShieldCheck; color: string; bg: string; placeholder: string; hint: string }[] = [
    { id: "superadmin", label: "Super Admin", icon: ShieldCheck, color: "#7B2D1E", bg: "rgba(123,45,30,0.08)", placeholder: "admin@banjar.id", hint: "Akses penuh sistem" },
    { id: "admin", label: "Admin Banjar", icon: Building2, color: "#C9861A", bg: "rgba(201,134,26,0.08)", placeholder: "banjar@banjar.id", hint: "Kelola banjar Anda" },
    { id: "publik", label: "Pengguna", icon: Globe, color: "#4A6741", bg: "rgba(74,103,65,0.08)", placeholder: "saya@email.com", hint: "Jelajah komunitas" },
  ];

  const selected = roles.find((r) => r.id === data.role)!;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 2. INERTIA: Mengirim request POST ke route /login di Laravel
    // Di Laravel (Controller), Anda bisa mengecek $request->role untuk menentukan arah redirect setelah login sukses
    post('/login', {
      preserveScroll: true,
      onError: () => {
        // Opsional: Jika password salah, reset kolom password agar user mengetik ulang
        setData('password', ''); 
      }
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE0" }}>
      {/* 3. INERTIA: Judul tab browser dinamis */}
      <Head title="Masuk ke Sistem | banjar.id" />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #2A1208 0%, #7B2D1E 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <circle cx="200" cy="300" r="180" stroke="#C9861A" strokeWidth="1" fill="none" />
            <circle cx="200" cy="300" r="130" stroke="#C9861A" strokeWidth="0.5" fill="none" />
            <path d="M200 100 L230 190 L320 190 L250 245 L275 335 L200 280 L125 335 L150 245 L80 190 L170 190Z" stroke="#C9861A" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 p-10">
          {/* INERTIA LINK */}
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(201,134,26,0.3)" }}>
              <MapPin size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
              banjar<span style={{ color: "#F0C060" }}>.id</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
            Platform Digital<br />Komunitas Banjar Bali
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(253,248,242,0.6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Masuk untuk mengelola banjar, memantau statistik, dan terhubung dengan komunitas se-Bali.
          </p>
        </div>
        <div className="relative z-10 p-10">
          <p className="text-xs" style={{ color: "rgba(253,248,242,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: "#C9861A" }}>Om</span> Swastiastu
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo - INERTIA LINK */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#7B2D1E" }}>
              <MapPin size={14} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#7B2D1E" }}>
              banjar<span style={{ color: "#C9861A" }}>.id</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            Masuk ke Sistem
          </h1>
          <p className="text-sm mb-8" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pilih peran Anda untuk melanjutkan
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setData('role', r.id)}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: data.role === r.id ? r.color : "rgba(123,45,30,0.1)",
                  background: data.role === r.id ? r.bg : "transparent",
                }}
              >
                <r.icon size={18} style={{ color: data.role === r.id ? r.color : "#7A6555" }} />
                <span className="text-xs font-semibold text-center leading-tight" style={{ color: data.role === r.id ? r.color : "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          {/* Role hint */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6" style={{ background: selected.bg }}>
            <selected.icon size={13} style={{ color: selected.color }} />
            <span className="text-xs font-medium" style={{ color: selected.color, fontFamily: "'JetBrains Mono', monospace" }}>
              {selected.hint}
            </span>
          </div>

          {/* Menampilkan error umum (seperti kredensial salah) dari Laravel */}
          {errors.email && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{ background: "rgba(192,57,43,0.1)", color: "#C0392B", border: "1px solid rgba(192,57,43,0.2)" }}>
              {errors.email}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder={selected.placeholder}
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                style={{
                  background: "#EFE6D8",
                  color: "#1E1208",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: errors.email ? "1.5px solid #C0392B" : `1.5px solid rgba(123,45,30,0.15)`,
                }}
                onFocus={(e) => { if(!errors.email) e.target.style.borderColor = selected.color }}
                onBlur={(e) => { if(!errors.email) e.target.style.borderColor = "rgba(123,45,30,0.15)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11 transition-all"
                  style={{
                    background: "#EFE6D8",
                    color: "#1E1208",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    border: errors.password ? "1.5px solid #C0392B" : "1.5px solid rgba(123,45,30,0.15)",
                  }}
                  onFocus={(e) => { if(!errors.password) e.target.style.borderColor = selected.color }}
                  onBlur={(e) => { if(!errors.password) e.target.style.borderColor = "rgba(123,45,30,0.15)" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none">
                  {showPass ? <EyeOff size={14} style={{ color: "#7A6555" }} /> : <Eye size={14} style={{ color: "#7A6555" }} />}
                </button>
              </div>
              {errors.password && <div className="text-red-500 text-[10px] mt-1">{errors.password}</div>}
            </div>

            <button
              type="submit"
              disabled={processing} // Tombol otomatis mati saat data sedang dikirim
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: selected.color,
                color: data.role === "admin" ? "#1E1208" : "#FDF8F2",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {processing ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                `Masuk sebagai ${selected.label}`
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Belum punya akun?{" "}
              {/* INERTIA LINK */}
              <Link href="/register" className="font-semibold underline" style={{ color: "#7B2D1E" }}>
                Daftar sekarang
              </Link>
            </p>
            <Link href="/" className="block text-xs hover:underline" style={{ color: "#C9B8A8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
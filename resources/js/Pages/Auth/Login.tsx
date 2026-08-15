import { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react"; // <-- Tambahkan usePage
import { MapPin, Eye, EyeOff, ShieldCheck, Building2, Globe, AlertCircle, CheckCircle2 } from "lucide-react"; // <-- Tambahkan CheckCircle2

type Role = "super_admin" | "admin_banjar" | "warga";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  // Menangkap pesan flash (success/error umum) dari backend Laravel
  const { flash }: any = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    role: "admin_banjar" as Role, 
    email: "",
    password: "",
  });

  const roles: { id: Role; label: string; icon: typeof ShieldCheck; color: string; bg: string; placeholder: string; hint: string }[] = [
    { id: "super_admin", label: "Super Admin", icon: ShieldCheck, color: "#7B2D1E", bg: "rgba(123,45,30,0.08)", placeholder: "admin@banjar.id", hint: "Akses penuh sistem" },
    { id: "admin_banjar", label: "Admin Banjar", icon: Building2, color: "#C9861A", bg: "rgba(201,134,26,0.08)", placeholder: "banjar@banjar.id", hint: "Kelola banjar Anda" },
    { id: "warga", label: "Pengguna", icon: Globe, color: "#4A6741", bg: "rgba(74,103,65,0.08)", placeholder: "saya@email.com", hint: "Jelajah komunitas" },
  ];

  const selected = roles.find((r) => r.id === data.role)!;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      preserveScroll: true,
      onError: () => {
        setData('password', ''); 
      }
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE0" }}>
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
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
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
          <p className="text-sm mb-6" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pilih peran Anda untuk melanjutkan
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setData('role', r.id)}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 focus:outline-none hover:shadow-sm"
                style={{
                  borderColor: data.role === r.id ? r.color : "rgba(123,45,30,0.1)",
                  background: data.role === r.id ? r.bg : "transparent",
                }}
              >
                <r.icon size={18} style={{ color: data.role === r.id ? r.color : "#7A6555" }} />
                <span className="text-[11px] font-bold text-center leading-tight" style={{ color: data.role === r.id ? r.color : "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          {/* ======================================================== */}
          {/* MENAMPILKAN PESAN SUKSES (DARI PROSES SEBELUMNYA) */}
          {/* ======================================================== */}
          {flash?.success && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in" style={{ background: "rgba(74,103,65,0.08)", border: "1px solid rgba(74,103,65,0.3)" }}>
              <CheckCircle2 size={18} color="#4A6741" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#4A6741", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {flash.success}
              </p>
            </div>
          )}

          {/* Menampilkan pesan Error Utama */}
          {errors.email && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in" style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)" }}>
              <AlertCircle size={18} color="#C0392B" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#C0392B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {errors.email}
              </p>
            </div>
          )}

          {/* FITUR LOGIN GOOGLE KHUSUS WARGA */}
          {data.role === "warga" && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <a
                href="/auth/google"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-colors hover:bg-black/5 shadow-sm hover:shadow-md"
                style={{ borderColor: "rgba(123,45,30,0.15)", color: "#1E1208", background: "#FAF4EC" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.2 21.34 7.22 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.4l4.08-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.2 2.66 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
                </svg>
                <span className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masuk dengan Google</span>
              </a>

              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-[#7A6555]" style={{ opacity: 0.2 }}></div>
                <span className="flex-shrink-0 mx-4 text-[11px] uppercase tracking-wider font-bold" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Atau dengan email</span>
                <div className="flex-grow border-t border-[#7A6555]" style={{ opacity: 0.2 }}></div>
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Password
                </label>
                <Link href="/lupa-sandi" className="text-xs font-semibold hover:underline" style={{ color: selected.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Lupa sandi?
                </Link>
              </div>
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
              {errors.password && <div className="text-[#C0392B] text-xs mt-1.5 font-medium">{errors.password}</div>}
            </div>

            <button
              type="submit"
              disabled={processing} 
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: selected.color,
                color: data.role === "admin_banjar" ? "#1E1208" : "#FDF8F2", 
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

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold underline hover:opacity-80" style={{ color: "#7B2D1E" }}>
                Daftar sekarang
              </Link>
            </p>
            <Link href="/" className="block text-xs font-semibold hover:underline" style={{ color: "#C9B8A8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
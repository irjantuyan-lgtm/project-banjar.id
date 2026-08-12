import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, MapPin } from "lucide-react";

export default function LupaSandi() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  // Ambil flash message dengan benar dari props Inertia
  const { flash } = usePage().props as { flash?: { success?: string } };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/lupa-sandi");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE0" }}>
      <Head title="Atur Ulang Sandi | banjar.id" />

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
            Pemulihan Akun<br />Komunitas Banjar
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(253,248,242,0.6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Jangan khawatir, kami akan membantu Anda mendapatkan kembali akses ke akun Anda dengan aman.
          </p>
        </div>
        <div className="relative z-10 p-10">
          <p className="text-xs" style={{ color: "rgba(253,248,242,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: "#C9861A" }}>Om</span> Swastiastu
          </p>
        </div>
      </div>

      {/* Right: Form Lupa Sandi */}
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

          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(123,45,30,0.08)", border: "1px solid rgba(123,45,30,0.15)" }}>
              <Mail size={22} style={{ color: "#7B2D1E" }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
              Atur Ulang Sandi
            </h1>
            <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Masukkan email yang terdaftar. Kami akan mengirimkan sandi sementara langsung ke email Anda.
            </p>
          </div>

          {/* Kotak Notifikasi Sukses */}
          {flash?.success && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in" style={{ background: "rgba(74,103,65,0.08)", border: "1px solid rgba(74,103,65,0.2)" }}>
              <CheckCircle2 size={18} className="text-[#4A6741] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#4A6741] font-medium leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {flash.success}
              </p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Email Terdaftar
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
                style={{
                  background: "#EFE6D8",
                  color: "#1E1208",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: errors.email ? "1.5px solid #C0392B" : "1.5px solid rgba(123,45,30,0.15)",
                }}
                onFocus={(e) => { if(!errors.email) e.target.style.borderColor = "#7B2D1E" }}
                onBlur={(e) => { if(!errors.email) e.target.style.borderColor = "rgba(123,45,30,0.15)" }}
              />
              {errors.email && <p className="text-xs text-[#C0392B] mt-1.5 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              style={{
                background: "#7B2D1E",
                color: "#FDF8F2",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {processing ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Kirim Sandi Sementara <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80" style={{ color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ArrowLeft size={14} /> Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
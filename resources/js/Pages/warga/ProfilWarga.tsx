import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Lock, User, ArrowLeft, CheckCircle2, Mail, ShieldCheck, MapPin } from "lucide-react";

export default function ProfilWarga() {
  const { auth, flash }: any = usePage().props;
  const user = auth?.user;

  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put("/profil-saya/ubah-sandi", {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans" style={{ background: "#F5EDE0" }}>
      <Head title="Profil & Keamanan | banjar.id" />

      {/* Header Sederhana */}
      <div className="w-full bg-white border-b border-[rgba(123,45,30,0.1)] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#7B2D1E" }}>
              <MapPin size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Libre Baskerville', serif", color: "#7B2D1E" }}>
              banjar<span style={{ color: "#C9861A" }}>.id</span>
            </span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A6555] hover:text-[#7B2D1E] transition-colors">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="max-w-4xl mx-auto w-full px-4 py-10 flex-grow">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Profil & Keamanan Akun
          </h1>
          <p className="text-sm text-[#7A6555] mt-1">
            Kelola informasi pribadi dan perbarui kata sandi akun warga Anda di sini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Informasi Akun */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)] text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-inner" style={{ background: "#C9861A" }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
              </div>
              <h2 className="font-bold text-base text-[#1E1208] truncate">{user?.name}</h2>
              <p className="text-xs text-[#7A6555] mt-0.5 truncate">{user?.email}</p>
              
              <div className="mt-4 pt-4 border-t border-[rgba(123,45,30,0.08)] flex items-center justify-center gap-1.5 text-xs font-semibold text-[#4A6741] bg-[rgba(74,103,65,0.08)] py-2 rounded-xl">
                <ShieldCheck size={14} /> Warga / Pengguna Publik
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Ubah Sandi */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)]">
              <h3 className="text-lg font-bold text-[#1E1208] mb-4 flex items-center gap-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                <Lock size={18} className="text-[#7B2D1E]" /> Ubah Kata Sandi
              </h3>
              <p className="text-xs text-[#7A6555] mb-6">
                Jika Anda masuk menggunakan sandi sementara dari email, segera ubah sandi Anda menggunakan kombinasi baru yang aman.
              </p>

              {/* Notifikasi Sukses */}
              {flash?.success && (
                <div className="mb-6 p-4 rounded-xl bg-[rgba(74,103,65,0.08)] border border-[rgba(74,103,65,0.2)] flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#4A6741] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#4A6741] font-medium leading-relaxed">{flash.success}</p>
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#3A2E24]">
                    Kata Sandi Saat Ini (Atau Sandi Sementara)
                  </label>
                  <input
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData("current_password", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE6D8] border border-[rgba(123,45,30,0.15)] text-sm outline-none focus:border-[#7B2D1E] text-[#1E1208]"
                  />
                  {errors.current_password && (
                    <p className="text-xs text-[#C0392B] mt-1.5 font-medium">{errors.current_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#3A2E24]">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE6D8] border border-[rgba(123,45,30,0.15)] text-sm outline-none focus:border-[#7B2D1E] text-[#1E1208]"
                  />
                  {errors.password && (
                    <p className="text-xs text-[#C0392B] mt-1.5 font-medium">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#3A2E24]">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE6D8] border border-[rgba(123,45,30,0.15)] text-sm outline-none focus:border-[#7B2D1E] text-[#1E1208]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all bg-[#7B2D1E] hover:bg-[#5A2115] text-[#FDF8F2] flex items-center justify-center gap-2 shadow-md disabled:opacity-70 mt-4 cursor-pointer"
                >
                  {processing ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Simpan Perubahan Sandi"
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
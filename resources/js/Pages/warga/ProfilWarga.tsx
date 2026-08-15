import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Lock, User, ArrowLeft, CheckCircle2, MapPin, ShieldCheck, AlertTriangle, Trash2, X } from "lucide-react";

export default function ProfilWarga() {
  const { auth, flash }: any = usePage().props;
  const user = auth?.user;

  // Form untuk Ubah Sandi
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Form & State untuk Hapus Akun
  const deleteForm = useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put("/profil-saya/ubah-sandi", {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText === "HAPUS") {
      deleteForm.delete("/profil-saya/hapus-akun", {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans relative" style={{ background: "#F5EDE0" }}>
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
                <ShieldCheck size={14} /> {user?.role === 'warga' ? 'Warga / Pengguna Publik' : 'Anggota Banjar'}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Ubah Sandi & Danger Zone */}
          <div className="md:col-span-2 space-y-6">
            
            {/* KARTU 1: UBAH KATA SANDI */}
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

            {/* KARTU 2: DANGER ZONE (HAPUS AKUN) */}
            <div className="bg-red-50 p-8 rounded-3xl border border-red-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                <AlertTriangle size={18} /> Zona Berbahaya
              </h3>
              <p className="text-xs text-red-900 mb-5 leading-relaxed opacity-80">
                Tindakan ini akan menghapus akun Anda secara permanen beserta seluruh data aktivitas Anda di Banjar.id. Tindakan ini <strong>tidak dapat dibatalkan</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Trash2 size={16} /> Hapus Akun Permanen
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL KONFIRMASI HAPUS AKUN */}
      {/* ========================================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Hapus Akun Permanen?
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Anda akan kehilangan akses selamanya ke platform ini. Ketik <span className="font-bold text-red-600 select-all">HAPUS</span> di bawah ini untuk mengonfirmasi tindakan Anda.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Ketik HAPUS di sini"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all uppercase"
              />
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={deleteConfirmText !== "HAPUS" || deleteForm.processing}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-xl text-sm transition-colors flex justify-center items-center gap-2"
                >
                  {deleteForm.processing ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Ya, Hapus Akun"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
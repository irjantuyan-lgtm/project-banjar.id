import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { Users, Search, Ban, Edit, Trash2, Copy, ShieldAlert, X } from "lucide-react";

export default function Warga({ banjar, warga = [] }: any) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  // State untuk modal edit warga
  const [editingWarga, setEditingWarga] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fungsi untuk menyalin kode ke clipboard
  const handleCopy = () => {
    if (banjar?.kode_verifikasi) {
      navigator.clipboard.writeText(banjar.kode_verifikasi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  // 1. Fungsi Simpan Edit Warga
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarga) return;

    router.put(`/admin/warga/${editingWarga.id}`, { name, email }, {
      preserveScroll: true,
      onSuccess: () => {
        setEditingWarga(null);
      }
    });
  };

  // 2. Fungsi Ubah Status / Suspend Warga
  const handleToggleStatus = (w: any) => {
    const statusBaru = w.status_akun === "aktif" ? "suspend" : "aktif";
    if (confirm(`Ubah status akun ${w.name} menjadi ${statusBaru.toUpperCase()}?`)) {
      router.patch(`/admin/warga/${w.id}/status`, { status_akun: statusBaru }, {
        preserveScroll: true
      });
    }
  };

  // 3. Fungsi Hapus Warga
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin mengeluarkan ${name} dari banjar ini?`)) {
      router.delete(`/admin/warga/${id}`, {
        preserveScroll: true
      });
    }
  };

  return (
    <AdminLayout>
      <Head title="Manajemen Krama" />

      <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        
        {/* Header Halaman */}
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            Manajemen Krama (Warga)
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>
            Kelola data anggota banjar, pendaftaran, dan moderasi akun dari hoax.
          </p>
        </div>

        {/* Kotak Kode Verifikasi */}
        <div className="p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          <div>
            <h2 className="font-semibold text-sm mb-1" style={{ color: "#1E1208" }}>Kode Verifikasi Pendaftaran</h2>
            <p className="text-xs max-w-xl" style={{ color: "#7A6555" }}>
              Bagikan kode ini ke grup WhatsApp warga agar mereka bisa mendaftar ke aplikasi. Jika kode bocor, Anda bisa mengacaknya kembali di menu pengaturan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl text-lg font-bold tracking-widest" style={{ background: "#E8DACC", color: "#1E1208", fontFamily: "'JetBrains Mono', monospace" }}>
              {banjar?.kode_verifikasi || "BELUM-DISET"}
            </div>
            <button onClick={handleCopy} className="p-2.5 rounded-xl hover:opacity-80 transition-all flex items-center gap-2 text-xs font-semibold" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
              {copied ? "Tersalin!" : <><Copy size={16} /> Salin</>}
            </button>
          </div>
        </div>

        {/* Tabel Data Warga */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: "rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: "#1E1208" }}>
              <Users size={18} style={{ color: "#7B2D1E" }} /> Daftar Krama Banjar
            </h2>
            
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7A6555" }} />
              <input 
                 type="text" 
                 placeholder="Cari nama atau email..." 
                 className="w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#7B2D1E] transition-shadow"
                 style={{ background: "#FDF8F2", border: "1px solid rgba(123,45,30,0.1)", color: "#1E1208" }}
                 onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: "rgba(123,45,30,0.03)", color: "#7A6555" }} className="text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Nama Lengkap</th>
                  <th className="px-5 py-3 font-medium">Email / Kontak</th>
                  <th className="px-5 py-3 font-medium">Bergabung</th>
                  <th className="px-5 py-3 font-medium text-center">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm" style={{ color: "#1E1208" }}>
                {warga.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs" style={{ color: "#7A6555" }}>
                      Belum ada warga yang mendaftar di banjar ini.
                    </td>
                  </tr>
                ) : (
                  warga
                    .filter((w: any) => 
                      w.name.toLowerCase().includes(search.toLowerCase()) || 
                      w.email.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((w: any) => (
                    <tr key={w.id} className="border-b last:border-0 hover:bg-white/40 transition-colors" style={{ borderColor: "rgba(123,45,30,0.05)" }}>
                      <td className="px-5 py-4 font-medium">{w.name}</td>
                      <td className="px-5 py-4">{w.email}</td>
                      <td className="px-5 py-4 text-xs" style={{ color: "#7A6555" }}>
                        {formatDate(w.created_at)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide" 
                          style={{ 
                            background: w.status_akun === "aktif" ? "rgba(74,103,65,0.1)" : "rgba(201,134,26,0.1)", 
                            color: w.status_akun === "aktif" ? "#4A6741" : "#C9861A" 
                          }}>
                          {w.status_akun ? w.status_akun.toUpperCase() : "AKTIF"}
                        </span>
                      </td>
                      <td className="px-5 py-4 flex justify-end gap-2">
                        {/* Tombol Edit */}
                        <button 
                          onClick={() => {
                            setEditingWarga(w);
                            setName(w.name);
                            setEmail(w.email);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#E8DACC] transition-colors" 
                          title="Edit Data"
                        >
                          <Edit size={16} style={{ color: "#4A6741" }} />
                        </button>
                        
                        {/* Tombol Blokir / Suspend */}
                        <button 
                          onClick={() => handleToggleStatus(w)}
                          className="p-1.5 rounded-lg hover:bg-[#E8DACC] transition-colors" 
                          title={w.status_akun === "aktif" ? "Blokir Akun (Suspend)" : "Buka Blokir"}
                        >
                          {w.status_akun === "aktif" ? (
                             <ShieldAlert size={16} style={{ color: "#C9861A" }} />
                          ) : (
                             <Ban size={16} style={{ color: "#7B2D1E" }} />
                          )}
                        </button>

                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handleDelete(w.id, w.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" 
                          title="Hapus dari Banjar"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL EDIT WARGA */}
      {editingWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.1)" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base" style={{ color: "#1E1208", fontFamily: "'Libre Baskerville', serif" }}>Edit Data Krama</h3>
              <button onClick={() => setEditingWarga(null)} className="p-1 rounded-lg hover:bg-[#E8DACC]">
                <X size={18} style={{ color: "#7A6555" }} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#7A6555" }}>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#7B2D1E]"
                  style={{ background: "#FDF8F2", border: "1px solid rgba(123,45,30,0.1)", color: "#1E1208" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#7A6555" }}>Email / Kontak</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#7B2D1E]"
                  style={{ background: "#FDF8F2", border: "1px solid rgba(123,45,30,0.1)", color: "#1E1208" }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingWarga(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "#E8DACC", color: "#1E1208" }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "#7B2D1E", color: "#FDF8F2" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
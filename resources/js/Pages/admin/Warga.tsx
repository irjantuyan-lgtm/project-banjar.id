import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout";
import { Users, Search, Ban, Edit, Trash2, ShieldAlert, X, Eye, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function Warga({ banjar, warga = [] }: any) {
  const [search, setSearch] = useState("");

  // State untuk modal edit warga
  const [editingWarga, setEditingWarga] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // State untuk modal LIHAT DETAIL & DOKUMEN 
  const [selectedWarga, setSelectedWarga] = useState<any>(null);

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

  // 2. Fungsi Ubah Status / Suspend Warga (Tombol Petir/Ban)
  const handleToggleStatus = (w: any) => {
    const statusBaru = w.status_akun === "aktif" ? "suspend" : "aktif";
    if (confirm(`Ubah status akun ${w.name} menjadi ${statusBaru.toUpperCase()}?`)) {
      router.patch(`/admin/warga/${w.id}/status`, { status_akun: statusBaru }, {
        preserveScroll: true
      });
    }
  };

  // 3. Fungsi Ubah Status Spesifik (Dari Modal Detail: Terima / Tolak)
  const handleStatusChange = (id: number, status: string) => {
    router.patch(`/admin/warga/${id}/status`, { status_akun: status }, {
        preserveScroll: true,
        onSuccess: () => setSelectedWarga(null) // Tutup modal jika sukses
    });
  };

  // 4. Fungsi Hapus Warga (DIPERBARUI: Pesan dinamis berdasarkan status)
  const handleDelete = (id: string, name: string, status: string) => {
    const pesanKonfirmasi = status === 'aktif' || status === 'suspend'
      ? `Apakah Anda yakin ingin MENGELUARKAN ${name} dari banjar ini?`
      : `Apakah Anda yakin ingin MEMBERSIHKAN data pengajuan ${name} secara permanen?`;

    if (confirm(pesanKonfirmasi)) {
      router.delete(`/admin/warga/${id}`, {
        preserveScroll: true,
        onSuccess: () => setSelectedWarga(null)
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

        {/* Tabel Data Warga */}
        <div className="rounded-2xl overflow-hidden mt-6" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
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
                            background: w.status_akun === "aktif" ? "rgba(74,103,65,0.1)" : w.status_akun === "pending" ? "rgba(201,134,26,0.1)" : "rgba(192,57,43,0.1)", 
                            color: w.status_akun === "aktif" ? "#4A6741" : w.status_akun === "pending" ? "#C9861A" : "#C0392B" 
                          }}>
                          {w.status_akun === 'pending' ? 'MENUNGGU' : w.status_akun ? w.status_akun.toUpperCase() : "AKTIF"}
                        </span>
                      </td>
                      <td className="px-5 py-4 flex justify-end gap-2">
                        
                        {/* Tombol Lihat Detail */}
                        <button 
                          onClick={() => setSelectedWarga(w)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" 
                          title="Lihat Detail & Dokumen"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

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
                        
                        {/* Tombol Blokir / Suspend (Sembunyikan jika statusnya pending/ditolak) */}
                        {w.status_akun === "aktif" || w.status_akun === "suspend" ? (
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
                        ) : null}

                        {/* Tombol Hapus (DIPERBARUI: Kirim parameter status) */}
                        <button 
                          onClick={() => handleDelete(w.id, w.name, w.status_akun)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" 
                          title="Hapus Data / Keluarkan"
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

      {/* ========================================================= */}
      {/* MODAL EDIT WARGA (FITUR ASLI - TETAP ADA) */}
      {/* ========================================================= */}
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

      {/* ========================================================= */}
      {/* MODAL DETAIL KRAMA & DOKUMEN */}
      {/* ========================================================= */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FAF4EC]">
                  <h3 className="font-bold text-lg text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>Detail Pengajuan Krama</h3>
                  <button onClick={() => setSelectedWarga(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                      <XCircle size={20} className="text-gray-500" />
                  </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                          <p className="font-bold text-gray-800">{selectedWarga.name}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="font-bold text-gray-800 truncate">{selectedWarga.email}</p>
                      </div>
                  </div>

                  <div>
                      <h4 className="text-sm font-bold text-[#1E1208] mb-3 flex items-center gap-2">
                          <AlertCircle size={16} className="text-[#C9861A]" /> Dokumen Identitas / Domisili
                      </h4>
                      
                      {selectedWarga.surat_domisili ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative group">
                              <img 
                                  src={selectedWarga.surat_domisili} 
                                  alt="Dokumen" 
                                  className="w-full h-auto object-contain max-h-80"
                                  onError={(e) => {
                                      e.currentTarget.parentElement!.innerHTML = `<div class="p-8 text-center text-sm text-blue-600 font-bold"><a href="${selectedWarga.surat_domisili}" target="_blank" underline>📄 Klik di sini untuk melihat Dokumen PDF/File</a></div>`;
                                  }}
                              />
                              <a href={selectedWarga.surat_domisili} target="_blank" className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  Buka Ukuran Penuh
                              </a>
                          </div>
                      ) : (
                          <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center text-red-600 text-sm font-medium">
                              Warga ini bergabung menggunakan Kode Undangan secara manual (Sistem Lama).
                          </div>
                      )}
                  </div>
              </div>

              {/* Tombol Terima / Tolak HANYA muncul jika status "pending" */}
              {selectedWarga.status_akun === 'pending' && (
                  <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                      <button 
                          onClick={() => handleStatusChange(selectedWarga.id, 'ditolak')}
                          className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm"
                      >
                          Tolak Pengajuan
                      </button>
                      <button 
                          onClick={() => handleStatusChange(selectedWarga.id, 'aktif')}
                          className="flex-1 py-3 bg-[#4A6741] text-white font-bold rounded-xl hover:bg-[#385130] transition-colors text-sm shadow-md flex justify-center items-center gap-2"
                      >
                          <CheckCircle size={18} /> Terima Jadi Krama
                      </button>
                  </div>
              )}
              
              {/* Tombol Keluarkan muncul jika status Aktif atau Suspend */}
              {(selectedWarga.status_akun === 'aktif' || selectedWarga.status_akun === 'suspend') && (
                  <div className="p-5 border-t border-gray-100 bg-gray-50">
                      <button 
                          onClick={() => handleDelete(selectedWarga.id, selectedWarga.name, selectedWarga.status_akun)}
                          className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm flex justify-center items-center gap-2"
                      >
                          <Trash2 size={16}/> Keluarkan Warga dari Banjar
                      </button>
                  </div>
              )}

              {/* Tombol Bersihkan Data muncul jika status Ditolak (Untuk sisa data error lama) */}
              {selectedWarga.status_akun === 'ditolak' && (
                  <div className="p-5 border-t border-gray-100 bg-gray-50">
                      <button 
                          onClick={() => handleDelete(selectedWarga.id, selectedWarga.name, selectedWarga.status_akun)}
                          className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors text-sm flex justify-center items-center gap-2"
                      >
                          <Trash2 size={16}/> Bersihkan Data Pengajuan
                      </button>
                  </div>
              )}

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
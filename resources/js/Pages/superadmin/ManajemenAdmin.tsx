import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  MapPin, LayoutGrid, BarChart2, PlusCircle, ShieldCheck, 
  Globe, Users, LogOut, Search, KeyRound, ShieldBan, 
  CheckCircle, ArrowRight, XCircle
} from "lucide-react";

export default function ManajemenAdmin() {
  const { auth, superadminName, admins = [] }: any = usePage().props;
  const [searchTerm, setSearchTerm] = useState("");

  const adminName = superadminName || auth?.user?.name || "Super Administrator";

  const theme = {
    bgMain: "#140A05", bgPanel: "#1C100A", gold: "#C9861A",
    goldLight: "#E6BA75", textMuted: "#8C7A6B", textLight: "#FDF8F2",
    green: "#4A9E60", border: "rgba(201, 134, 26, 0.15)",
  };

  // Fungsi Reset Password
  const handleResetPassword = (id: string, name: string) => {
    if (confirm(`Yakin ingin mereset password untuk Admin ${name} menjadi 'banjar123'?`)) {
      router.patch(`/superadmin/reset-password/${id}`, {}, {
        preserveScroll: true,
        onSuccess: () => alert("Password berhasil direset menjadi: banjar123")
      });
    }
  };

  // Fungsi Ubah Status (Aktifkan, Tolak, Suspend)
  const handleChangeStatus = (id: string, name: string, actionLabel: string, actionValue: string) => {
    if (confirm(`Yakin ingin ${actionLabel} akun ${name}?`)) {
      router.post(`/superadmin/ubah-status-admin/${id}`, { aksi: actionValue }, {
        preserveScroll: true,
      });
    }
  };

  const filteredAdmins = admins.filter((admin: any) => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Manajemen Admin | banjar.id" />

      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        {/* ... (Isi Sidebar Sama Seperti Sebelumnya) ... */}
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(201,134,26,0.15)" }}>
              <MapPin size={18} style={{ color: theme.gold }} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none" style={{ fontFamily: "'Libre Baskerville', serif", color: theme.textLight }}>
                banjar<span style={{ color: theme.gold }}>.id</span>
              </h1>
              <p className="text-[10px] font-bold tracking-widest mt-1" style={{ color: theme.gold }}>SUPER ADMIN</p>
            </div>
          </div>
          <div className="px-6 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: "rgba(201,134,26,0.05)", borderColor: theme.border, color: theme.gold }}>
              <ShieldCheck size={14} />
              <span className="text-xs font-semibold">Akses Penuh Sistem</span>
            </div>
          </div>
          <nav className="px-3 space-y-1">
            <Link href="/superadmin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><LayoutGrid size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Dashboard</span></Link>
            <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><BarChart2 size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Statistik Global</span></Link>
            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><PlusCircle size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Buat Akun Banjar</span></Link>
            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><ShieldCheck size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Moderasi Konten</span></Link>
            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><Globe size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Pantau Platform</span></Link>
            <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}><Users size={18} /><span className="text-sm font-semibold">Manajemen Admin</span><ArrowRight size={14} className="ml-auto" /></Link>
          </nav>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#E74C3C" }}>SA</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{adminName}</p>
              <p className="text-xs truncate" style={{ color: theme.textMuted }}>banjar.id</p>
            </div>
            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"><LogOut size={16} style={{ color: theme.textMuted }} /></Link>
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>Manajemen Akun Admin</h2>
            <p className="text-sm mt-1" style={{ color: theme.textMuted }}>Kelola akses, reset password, dan pantau status Admin Banjar</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>SUPER ADMIN</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="mb-6 flex justify-end">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: theme.textMuted }} />
              <input type="text" placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1" style={{ backgroundColor: theme.bgPanel, border: `1px solid ${theme.border}`, color: theme.textLight }} />
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: "rgba(201,134,26,0.05)", borderBottom: `1px solid ${theme.border}` }}>
                <tr>
                  <th className="px-6 py-4 font-semibold" style={{ color: theme.goldLight }}>Nama Admin</th>
                  <th className="px-6 py-4 font-semibold" style={{ color: theme.goldLight }}>Email & Username</th>
                  <th className="px-6 py-4 font-semibold" style={{ color: theme.goldLight }}>Status Akun</th>
                  <th className="px-6 py-4 font-semibold text-right" style={{ color: theme.goldLight }}>Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                {filteredAdmins.length > 0 ? filteredAdmins.map((admin: any) => (
                  <tr key={admin.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-medium" style={{ color: theme.textLight }}>{admin.name}</td>
                    <td className="px-6 py-4">
                      <div style={{ color: theme.textLight }}>{admin.email}</div>
                      <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>@{admin.username}</div>
                    </td>
                    
                    {/* BAGIAN LENCANA STATUS */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border`} 
                        style={{ 
                          backgroundColor: admin.status === 'aktif' ? "rgba(74,158,96,0.1)" : admin.status === 'pending' ? "rgba(201,134,26,0.1)" : "rgba(192,57,43,0.1)",
                          borderColor: admin.status === 'aktif' ? theme.green : admin.status === 'pending' ? theme.gold : "#E74C3C",
                          color: admin.status === 'aktif' ? theme.green : admin.status === 'pending' ? theme.gold : "#E74C3C" 
                        }}>
                        {admin.status === 'aktif' ? 'Aktif' : admin.status === 'pending' ? 'Menunggu Verifikasi' : admin.status === 'ditolak' ? 'Ditolak' : 'Suspended'}
                      </span>
                    </td>
                    
                    {/* BAGIAN TOMBOL AKSI LOGIKA BARU */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleResetPassword(admin.id, admin.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
                          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: theme.textLight }} title="Reset ke 'banjar123'"
                        >
                          <KeyRound size={12} /> Reset
                        </button>

                        {/* Jika Pending: Muncul tombol Verifikasi & Tolak */}
                        {admin.status === 'pending' && (
                          <>
                            <button onClick={() => handleChangeStatus(admin.id, admin.name, 'MENOLAK pendaftaran', 'tolak')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition">
                              <XCircle size={12} /> Tolak
                            </button>
                            <button onClick={() => handleChangeStatus(admin.id, admin.name, 'MEMVERIFIKASI (Aktifkan)', 'aktif')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition">
                              <CheckCircle size={12} /> Verifikasi
                            </button>
                          </>
                        )}

                        {/* Jika Aktif: Muncul tombol Suspend */}
                        {admin.status === 'aktif' && (
                          <button onClick={() => handleChangeStatus(admin.id, admin.name, 'MENANGGUHKAN (Suspend)', 'suspend')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 transition">
                            <ShieldBan size={12} /> Suspend
                          </button>
                        )}

                        {/* Jika Suspend / Ditolak: Muncul tombol Aktifkan */}
                        {(admin.status === 'suspend' || admin.status === 'ditolak') && (
                          <button onClick={() => handleChangeStatus(admin.id, admin.name, 'MENGAKTIFKAN kembali', 'aktif')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition">
                            <CheckCircle size={12} /> Aktifkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center" style={{ color: theme.textMuted }}>Tidak ada data admin ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
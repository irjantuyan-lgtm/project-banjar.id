import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  MapPin, LayoutGrid, BarChart2, PlusCircle, ShieldCheck, 
  Globe, Users, LogOut, Search, KeyRound, ShieldBan, 
  CheckCircle, ArrowRight, XCircle, Phone, Eye, User, Building2, FileText, Mail, Trash2
} from "lucide-react";

export default function ManajemenAdmin() {
  const { auth, superadminName, admins = [] }: any = usePage().props;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null); 

  const adminName = superadminName || auth?.user?.name || "Super Administrator";

  const theme = {
    bgMain: "#140A05", bgPanel: "#1C100A", gold: "#C9861A",
    goldLight: "#E6BA75", textMuted: "#8C7A6B", textLight: "#FDF8F2",
    green: "#4A9E60", border: "rgba(201, 134, 26, 0.15)",
  };

  const handleResetPassword = (id: string, name: string) => {
    if (confirm(`Yakin ingin mereset password untuk Admin ${name}?`)) {
      router.patch(`/superadmin/reset-password/${id}`, {}, {
        preserveScroll: true,
        onSuccess: (page: any) => {
          const flashMessage = page.props.flash?.flash_sandi_baru || "Password berhasil direset!";
          alert(flashMessage);
        }
      });
    }
  };

  const handleChangeStatus = (id: string, name: string, actionLabel: string, actionValue: string) => {
    if (confirm(`Yakin ingin ${actionLabel} pendaftaran Banjar dari ${name}?`)) {
      router.post(`/superadmin/ubah-status-admin/${id}`, { aksi: actionValue }, {
        preserveScroll: true,
        onSuccess: () => setSelectedAdmin(null) 
      });
    }
  };

  // FUNGSI BARU: Hapus Permanen Admin & Banjar
  const handleDeleteAdmin = (id: string, name: string) => {
    if (confirm(`PERINGATAN KERAS!\n\nYakin ingin MENGHAPUS PERMANEN akun Admin ${name} beserta data Banjarnya?\nTindakan ini tidak dapat dibatalkan.`)) {
        router.delete(`/superadmin/hapus-admin/${id}`, {
            preserveScroll: true,
            onSuccess: () => setSelectedAdmin(null) // Tutup modal jika sedang terbuka
        });
    }
  };

  const filteredAdmins = admins.filter((admin: any) => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.nama_banjar && admin.nama_banjar.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      
      <Head>
        <title>Dashboard Super Admin | banjar.id</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Head title="Manajemen Admin | banjar.id" />

      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>Manajemen Akun Admin</h2>
            <p className="text-sm mt-1" style={{ color: theme.textMuted }}>Review data pendaftaran dan aktifkan akun Admin Banjar.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>SUPER ADMIN</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          <div className="mb-6 flex justify-end">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: theme.textMuted }} />
              <input type="text" placeholder="Cari admin atau nama banjar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1" style={{ backgroundColor: theme.bgPanel, border: `1px solid ${theme.border}`, color: theme.textLight }} />
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: "rgba(201,134,26,0.05)", borderBottom: `1px solid ${theme.border}` }}>
                <tr>
                  <th className="px-6 py-4 font-semibold" style={{ color: theme.goldLight }}>Nama Admin</th>
                  <th className="px-6 py-4 font-semibold" style={{ color: theme.goldLight }}>Banjar Didaftarkan</th>
                  <th className="px-6 py-4 font-semibold text-center" style={{ color: theme.goldLight }}>Status</th>
                  <th className="px-6 py-4 font-semibold text-center" style={{ color: theme.goldLight }}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                {filteredAdmins.length > 0 ? filteredAdmins.map((admin: any) => (
                  <tr key={admin.id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium" style={{ color: theme.textLight }}>{admin.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold" style={{ color: theme.goldLight }}>{admin.nama_banjar}</div>
                      <div className="text-xs mt-1" style={{ color: theme.textMuted }}>{admin.kecamatan !== '-' ? `${admin.kecamatan}, ` : ''}{admin.kota}</div>
                    </td>
                    
                    <td className="px-6 py-4 align-top text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border inline-block`} 
                        style={{ 
                          backgroundColor: admin.status_akun === 'aktif' ? "rgba(74,158,96,0.1)" : admin.status_akun === 'pending' ? "rgba(201,134,26,0.1)" : "rgba(192,57,43,0.1)",
                          borderColor: admin.status_akun === 'aktif' ? theme.green : admin.status_akun === 'pending' ? theme.gold : "#E74C3C",
                          color: admin.status_akun === 'aktif' ? theme.green : admin.status_akun === 'pending' ? theme.gold : "#E74C3C" 
                        }}>
                        {admin.status_akun === 'aktif' ? 'Aktif' : admin.status_akun === 'pending' ? 'Menunggu Validasi' : admin.status_akun === 'ditolak' ? 'Ditolak' : 'Suspended'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 align-top text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* TOMBOL HAPUS LANGSUNG DI TABEL */}
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                          className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-red-500/20"
                          style={{ color: "#E74C3C" }} title="Hapus Permanen"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleResetPassword(admin.id, admin.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
                          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: theme.textLight }} title="Reset Password"
                        >
                          <KeyRound size={12} /> Reset
                        </button>
                        <button 
                          onClick={() => setSelectedAdmin(admin)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:opacity-80"
                          style={{ backgroundColor: theme.gold, color: theme.bgMain }} title="Review Data"
                        >
                          <Eye size={12} /> Review
                        </button>
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

        {/* ========================================================= */}
        {/* MODAL REVIEW DATA PENDAFTARAN (TEMA GELAP) */}
        {/* ========================================================= */}
        {selectedAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
                <div className="border rounded-3xl max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[90vh]" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
                    
                    {/* Modal Header */}
                    <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
                        <h3 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily: "'Libre Baskerville', serif", color: theme.goldLight }}>
                            <ShieldCheck size={22} />
                            Review Pendaftaran Banjar
                        </h3>
                        <button onClick={() => setSelectedAdmin(null)} className="p-2 rounded-full transition-colors hover:bg-white/10">
                            <XCircle size={20} style={{ color: theme.textMuted }} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        
                        {/* Peringatan Status Pending */}
                        {selectedAdmin.status_akun === 'pending' && (
                            <div className="p-4 rounded-xl flex gap-3 text-xs leading-relaxed border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.textLight }}>
                                <ShieldCheck size={20} className="shrink-0" style={{ color: theme.gold }} />
                                <p>
                                    <strong>Validasi Manual:</strong> Pastikan data di bawah ini masuk akal. Jika Anda mengklik "Setujui", sistem akan <strong>mengaktifkan akun</strong> dan <strong>mengirimkan password otomatis</strong> ke email pengurus.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* KARTU 1: DATA PENGURUS */}
                            <div className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: theme.bgMain, borderColor: theme.border }}>
                                <h4 className="font-bold text-sm flex items-center gap-2 border-b pb-3" style={{ color: theme.textLight, borderColor: theme.border }}>
                                    <User size={16} style={{ color: theme.gold }}/> Info Akun Pengurus
                                </h4>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>Nama Lengkap</p>
                                    <p className="text-sm font-bold" style={{ color: theme.textLight }}>{selectedAdmin.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>Username Sistem</p>
                                    <p className="text-sm font-medium" style={{ color: theme.textLight }}>@{selectedAdmin.username}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: theme.textMuted }}><Mail size={12}/> Email Pengurus</p>
                                    <p className="text-sm font-bold" style={{ color: "#3B82F6" }}>{selectedAdmin.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: theme.textMuted }}><Phone size={12}/> WhatsApp</p>
                                    <p className="text-sm font-medium" style={{ color: theme.textLight }}>{selectedAdmin.no_wa_pengelola || '-'}</p>
                                </div>
                            </div>

                            {/* KARTU 2: DATA BANJAR */}
                            <div className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: theme.bgMain, borderColor: theme.border }}>
                                <h4 className="font-bold text-sm flex items-center gap-2 border-b pb-3" style={{ color: theme.textLight, borderColor: theme.border }}>
                                    <Building2 size={16} style={{ color: theme.goldLight }}/> Info Registrasi Banjar
                                </h4>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>Nama Banjar</p>
                                    <p className="text-base font-black" style={{ color: theme.goldLight }}>{selectedAdmin.nama_banjar}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: theme.textMuted }}><MapPin size={12}/> Alamat Lengkap</p>
                                    <p className="text-sm font-medium" style={{ color: theme.textLight }}>
                                        Kec. {selectedAdmin.kecamatan}, {selectedAdmin.kota}<br/>
                                        {selectedAdmin.provinsi}, {selectedAdmin.negara}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: theme.textMuted }}><FileText size={12}/> Deskripsi Profil</p>
                                    <div 
                                        className="text-xs p-3 rounded-lg border max-h-24 overflow-y-auto custom-scrollbar prose prose-invert prose-sm"
                                        style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: theme.border, color: theme.textMuted }}
                                        dangerouslySetInnerHTML={{ __html: selectedAdmin.deskripsi || '<i>Tidak menyertakan deskripsi</i>' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer (Aksi) */}
                    <div className="p-6 border-t rounded-b-3xl" style={{ backgroundColor: theme.bgMain, borderColor: theme.border }}>
                        <div className="flex flex-wrap md:flex-nowrap gap-3 justify-between items-center w-full">
                            
                            {/* KIRI: Tombol Hapus (Selalu Muncul) */}
                            <button 
                                onClick={() => handleDeleteAdmin(selectedAdmin.id, selectedAdmin.name)}
                                className="px-4 py-3 font-bold rounded-xl transition-colors text-sm flex items-center gap-2 hover:bg-red-500/10 w-full md:w-auto justify-center"
                                style={{ color: "#E74C3C" }}
                            >
                                <Trash2 size={16}/> Hapus Permanen
                            </button>

                            {/* KANAN: Tombol Dinamis berdasarkan Status */}
                            {selectedAdmin.status_akun === 'pending' ? (
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => handleChangeStatus(selectedAdmin.id, selectedAdmin.name, 'MENOLAK', 'ditolak')}
                                        className="px-6 py-3 border font-bold rounded-xl transition-colors text-sm flex-1 md:flex-none"
                                        style={{ borderColor: "#E74C3C", color: "#E74C3C", backgroundColor: "transparent" }}
                                    >
                                        Tolak (Palsu)
                                    </button>
                                    <button 
                                        onClick={() => handleChangeStatus(selectedAdmin.id, selectedAdmin.name, 'MENYETUJUI', 'aktif')}
                                        className="px-6 py-3 font-bold rounded-xl transition-colors text-sm shadow-md flex justify-center items-center gap-2 flex-1 md:flex-none"
                                        style={{ backgroundColor: theme.green, color: "#fff" }}
                                    >
                                        <CheckCircle size={18} /> Setujui
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 w-full md:w-auto">
                                    {selectedAdmin.status_akun === 'aktif' && (
                                        <button 
                                            onClick={() => handleChangeStatus(selectedAdmin.id, selectedAdmin.name, 'MENANGGUHKAN', 'suspend')}
                                            className="px-6 py-3 font-bold rounded-xl transition-colors text-sm flex items-center gap-2 flex-1 md:flex-none"
                                            style={{ backgroundColor: "rgba(230,126,34,0.1)", color: "#E67E22", border: "1px solid #E67E22" }}
                                        >
                                            <ShieldBan size={16}/> Suspend
                                        </button>
                                    )}
                                    {(selectedAdmin.status_akun === 'ditolak' || selectedAdmin.status_akun === 'suspend') && (
                                        <button 
                                            onClick={() => handleChangeStatus(selectedAdmin.id, selectedAdmin.name, 'MENGAKTIFKAN', 'aktif')}
                                            className="px-6 py-3 font-bold rounded-xl transition-colors text-sm flex items-center gap-2 flex-1 md:flex-none"
                                            style={{ backgroundColor: theme.green, color: "#fff" }}
                                        >
                                            <CheckCircle size={16}/> Aktifkan Lagi
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setSelectedAdmin(null)}
                                        className="px-6 py-3 font-bold rounded-xl transition-colors text-sm flex-1 md:flex-none"
                                        style={{ backgroundColor: "rgba(255,255,255,0.1)", color: theme.textLight }}
                                    >
                                        Tutup
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        )}

      </main>
    </div>
  );
}
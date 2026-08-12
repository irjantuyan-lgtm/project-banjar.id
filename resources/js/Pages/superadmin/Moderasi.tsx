import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  MapPin,
  LayoutGrid,
  BarChart2,
  PlusCircle,
  ShieldCheck,
  Globe,
  Bell,
  LogOut,
  Clock,
  Calendar,
  ShoppingBag,
  Users,
  X,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function Moderasi() {
  // 1. Ambil data asli dari Laravel
  const { antrian = [], riwayat = [], stats = {} }: any = usePage().props;

  // 2. State untuk Tab Filter & Modal Penilaian
  const [activeTab, setActiveTab] = useState<'menunggu' | 'disetujui' | 'ditolak'>('menunggu');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [moderationAction, setModerationAction] = useState<'approved' | 'rejected'>('approved');
  const [catatan, setCatatan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 3. Filter Riwayat berdasarkan status
  const approvedList = riwayat.filter((item: any) => item.status === 'approved');
  const rejectedList = riwayat.filter((item: any) => item.status === 'rejected');

  const theme = {
    bgMain: "#140A05",
    bgPanel: "#1C100A",
    gold: "#C9861A",
    goldLight: "#E6BA75",
    textMuted: "#8C7A6B",
    textLight: "#FDF8F2",
    green: "#4A9E60",
    red: "#C0392B",
    border: "rgba(201, 134, 26, 0.15)",
  };

  // Fungsi membuka modal
  const openModal = (item: any, action: 'approved' | 'rejected') => {
    setSelectedItem(item);
    setModerationAction(action);
    setCatatan('');
    setModalOpen(true);
  };

  // Fungsi submit ke Laravel
  const submitModeration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    router.post('/superadmin/moderasi/proses', {
      id: selectedItem.id,
      type: selectedItem.type,
      status: moderationAction,
      catatan: catatan
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setModalOpen(false);
        setIsProcessing(false);
      },
      onError: () => {
        alert("Gagal memproses moderasi.");
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>

      <Head>
        <title>Dashboard Super Admin | banjar.id</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Head title="Moderasi Konten | banjar.id" />

      {/* ========================================== */}
      {/* 1. SIDEBAR KIRI (Tetap Konsisten) */}
      {/* ========================================== */}
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
            <Link href="/superadmin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <LayoutGrid size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <BarChart2 size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Statistik Global</span>
            </Link>

            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <PlusCircle size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Buat Akun Banjar</span>
            </Link>

            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Moderasi Konten</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>{stats.menunggu || 0}</span>
            </Link>

            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>

            <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
               <Users size={18} style={{ color: theme.textMuted }} />
               <span className="text-sm font-medium">Manajemen Admin</span>
            </Link>
          </nav>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#E74C3C" }}>
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Super Administrator</p>
              <p className="text-xs truncate" style={{ color: theme.textMuted }}>banjar.id</p>
            </div>
            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <LogOut size={16} style={{ color: theme.textMuted }} />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Moderasi Konten</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
              {stats.menunggu > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: theme.gold }}></span>}
            </button>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>
              SUPER ADMIN
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Moderasi & Approval Konten</h1>
            <p style={{ color: theme.textMuted }} className="mb-8">Tinjau dan setujui konten yang dikirimkan oleh admin banjar</p>
            
            {/* TABS FILTER (Bisa Diklik) */}
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('menunggu')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all hover:bg-white/5" 
                style={{ 
                  backgroundColor: activeTab === 'menunggu' ? "rgba(201,134,26,0.1)" : "transparent", 
                  borderColor: activeTab === 'menunggu' ? theme.border : "transparent" 
                }}
              >
                <span className="font-bold" style={{ color: theme.goldLight }}>{stats.menunggu || 0}</span>
                <span className="text-sm font-medium" style={{ color: activeTab === 'menunggu' ? theme.textLight : theme.textMuted }}>Menunggu</span>
              </button>

              <button 
                onClick={() => setActiveTab('disetujui')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all hover:bg-white/5"
                style={{ 
                  backgroundColor: activeTab === 'disetujui' ? "rgba(74, 158, 96, 0.1)" : "transparent", 
                  borderColor: activeTab === 'disetujui' ? "rgba(74, 158, 96, 0.3)" : "transparent" 
                }}
              >
                <span className="font-bold" style={{ color: theme.green }}>{stats.disetujui || 0}</span>
                <span className="text-sm font-medium" style={{ color: activeTab === 'disetujui' ? theme.textLight : theme.textMuted }}>Disetujui</span>
              </button>

              <button 
                onClick={() => setActiveTab('ditolak')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all hover:bg-white/5"
                style={{ 
                  backgroundColor: activeTab === 'ditolak' ? "rgba(192, 57, 43, 0.1)" : "transparent", 
                  borderColor: activeTab === 'ditolak' ? "rgba(192, 57, 43, 0.3)" : "transparent" 
                }}
              >
                <span className="font-bold" style={{ color: theme.red }}>{stats.ditolak || 0}</span>
                <span className="text-sm font-medium" style={{ color: activeTab === 'ditolak' ? theme.textLight : theme.textMuted }}>Ditolak</span>
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* AREA KONTEN DINAMIS BERDASARKAN TAB */}
          {/* ========================================== */}
          <div className="mt-8">
            
            {/* 1. Jika Tab "Menunggu" Aktif */}
            {activeTab === 'menunggu' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={16} style={{ color: theme.gold }} />
                  <h3 className="font-bold text-lg">Antrian Menunggu ({antrian.length})</h3>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {antrian.length > 0 ? antrian.map((item: any, idx: number) => (
                    <ModerationCard 
                      key={idx} item={item} 
                      icon={item.type === 'kegiatan' ? Calendar : ShoppingBag} 
                      iconBg="rgba(201, 134, 26, 0.1)" 
                      iconColor={theme.gold} 
                    />
                  )) : (
                    <div className="col-span-full border border-dashed rounded-2xl py-12 flex flex-col items-center justify-center" style={{ borderColor: theme.border }}>
                      <CheckCircle size={36} style={{ color: theme.green }} className="mb-3" />
                      <p className="text-sm font-medium" style={{ color: theme.textMuted }}>Hore! Tidak ada antrian moderasi saat ini.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Jika Tab "Disetujui" Aktif */}
            {activeTab === 'disetujui' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle size={16} style={{ color: theme.green }} />
                  <h3 className="font-bold text-lg">Riwayat Disetujui ({approvedList.length})</h3>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {approvedList.length > 0 ? approvedList.map((item: any, idx: number) => (
                     <HistoryCard 
                      key={idx} title={item.title} location={item.location} 
                      status="Disetujui" statusColor={theme.green} statusBg="rgba(74, 158, 96, 0.1)" 
                      icon={item.type === 'kegiatan' ? Calendar : ShoppingBag} 
                      iconBg="rgba(74, 158, 96, 0.1)" iconColor={theme.green} 
                      note={item.note ? `Catatan: ${item.note}` : null}
                    />
                  )) : (
                    <div className="col-span-full border border-dashed rounded-2xl py-12 flex flex-col items-center justify-center" style={{ borderColor: theme.border }}>
                      <p className="text-sm font-medium" style={{ color: theme.textMuted }}>Belum ada riwayat konten yang disetujui.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Jika Tab "Ditolak" Aktif */}
            {activeTab === 'ditolak' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <XCircle size={16} style={{ color: theme.red }} />
                  <h3 className="font-bold text-lg">Riwayat Ditolak ({rejectedList.length})</h3>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {rejectedList.length > 0 ? rejectedList.map((item: any, idx: number) => (
                     <HistoryCard 
                      key={idx} title={item.title} location={item.location} 
                      status="Ditolak" statusColor={theme.red} statusBg="rgba(192, 57, 43, 0.1)" 
                      icon={item.type === 'kegiatan' ? Calendar : ShoppingBag} 
                      iconBg="rgba(192, 57, 43, 0.1)" iconColor={theme.red} 
                      note={item.note ? `Catatan: ${item.note}` : null}
                    />
                  )) : (
                    <div className="col-span-full border border-dashed rounded-2xl py-12 flex flex-col items-center justify-center" style={{ borderColor: theme.border }}>
                      <p className="text-sm font-medium" style={{ color: theme.textMuted }}>Belum ada riwayat konten yang ditolak.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* MODAL / POPUP ULASAN */}
        {modalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl p-6 border shadow-2xl" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">
                  {moderationAction === 'approved' ? 'Setujui Konten' : 'Tolak Konten'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} style={{ color: theme.textMuted }} />
                </button>
              </div>

              <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${theme.border}` }}>
                <p className="text-xs mb-1" style={{ color: theme.textMuted }}>Judul Konten:</p>
                <p className="font-bold">{selectedItem?.title}</p>
              </div>

              <form onSubmit={submitModeration}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textMuted }}>
                    Catatan / Ulasan (Opsional)
                  </label>
                  <textarea 
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder={moderationAction === 'approved' ? "Contoh: Konten sangat baik dan sesuai..." : "Contoh: Maaf, foto kurang jelas..."}
                    className="w-full p-4 rounded-xl text-sm outline-none resize-none h-28"
                    style={{ backgroundColor: theme.bgMain, border: `1px solid ${theme.border}`, color: theme.textLight }}
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-white/10" style={{ color: theme.textLight }}>
                    Batal
                  </button>
                  <button type="submit" disabled={isProcessing} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80" style={{ backgroundColor: moderationAction === 'approved' ? theme.green : theme.red, color: "#FFF" }}>
                    {isProcessing ? "Memproses..." : (moderationAction === 'approved' ? <><CheckCircle size={16} /> Setujui</> : <><XCircle size={16} /> Tolak</>)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  // --- Komponen Antrian ---
  function ModerationCard({ item, icon: Icon, iconBg, iconColor }: any) {
    return (
      <div className="rounded-2xl p-5 border flex gap-4 transition-all hover:bg-white/5 h-full" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-base">{item.title}</h4>
            <div className="px-3 py-1 rounded-md text-[10px] font-semibold" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.goldLight }}>
              {item.badge}
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.textMuted }}>{item.location}</p>
          <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: theme.textMuted }}>{item.description}</p>
          
          <div className="flex items-center gap-2 mt-auto pt-4 border-t" style={{ borderColor: theme.border }}>
            <button onClick={() => openModal(item, 'approved')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-opacity-80" style={{ backgroundColor: "rgba(74, 158, 96, 0.15)", color: theme.green }}>
              <CheckCircle size={14} /> Setujui
            </button>
            <button onClick={() => openModal(item, 'rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-opacity-80" style={{ backgroundColor: "rgba(192, 57, 43, 0.15)", color: theme.red }}>
              <XCircle size={14} /> Tolak
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Komponen Riwayat ---
  function HistoryCard({ icon: Icon, title, location, status, statusColor, statusBg, iconBg, iconColor, note }: any) {
    return (
      <div className="rounded-2xl p-5 border flex gap-4 transition-all hover:bg-white/5 h-full" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-base">{title}</h4>
            <div className="px-3 py-1 rounded-md text-[10px] font-semibold" style={{ backgroundColor: statusBg, color: statusColor }}>
              {status}
            </div>
          </div>
          <p className="text-xs" style={{ color: theme.textMuted }}>{location}</p>
          {note && (
            <div className="mt-auto pt-3">
              <div className="p-3 rounded-lg border text-xs leading-relaxed" style={{ backgroundColor: theme.bgMain, borderColor: theme.border, color: statusColor }}>
                {note}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
  MapPin,
  LayoutGrid,
  BarChart2,
  PlusCircle,
  ShieldCheck,
  Globe,
  Bell,
  LogOut,
  HelpCircle,
  Clock,
  Calendar,
  ShoppingBag,
  Building2
} from "lucide-react";

export default function Moderasi() {
  // Tema warna yang konsisten dengan halaman lainnya
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

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Moderasi Konten | banjar.id" />

      {/* ========================================== */}
      {/* 1. SIDEBAR KIRI */}
      {/* ========================================== */}
      <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div>
          {/* Logo */}
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

          {/* Badge Akses */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: "rgba(201,134,26,0.05)", borderColor: theme.border, color: theme.gold }}>
              <ShieldCheck size={14} />
              <span className="text-xs font-semibold">Akses Penuh Sistem</span>
            </div>
          </div>

          {/* Menu Navigasi */}
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

            {/* Menu Moderasi Aktif */}
            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Moderasi Konten</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>3</span>
            </Link>

            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Bottom */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#E74C3C" }}>
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Super Administrator</p>
              <p className="text-xs truncate" style={{ color: theme.textMuted }}>banjar.id</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <LogOut size={16} style={{ color: theme.textMuted }} />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Moderasi Konten</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: theme.gold }}></span>
            </button>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>
              SUPER ADMIN
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          
          {/* Page Titles & Filters */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Moderasi & Approval Konten</h1>
            <p style={{ color: theme.textMuted }} className="mb-8">Tinjau dan setujui konten yang dikirimkan oleh admin banjar</p>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.border }}>
                <span className="font-bold" style={{ color: theme.goldLight }}>3</span>
                <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Menunggu</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-transparent hover:border-white/5 transition-all">
                <span className="font-bold" style={{ color: theme.green }}>2</span>
                <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Disetujui</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-transparent hover:border-white/5 transition-all">
                <span className="font-bold" style={{ color: theme.red }}>1</span>
                <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Ditolak</span>
              </button>
            </div>
          </div>

          {/* Main Grid: 2 Columns */}
          <div className="grid grid-cols-2 gap-8">
            
            {/* Kiri: Antrian */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={16} style={{ color: theme.gold }} />
                <h3 className="font-bold text-lg">Antrian (3)</h3>
              </div>
              
              <div className="space-y-4">
                {/* Antrian 1 */}
                <ModerationCard 
                  icon={Calendar} 
                  title="Pameran Kerajinan Bambu" 
                  location="Banjar Tegal Jaya · 2 Juli 2026" 
                  description="Pameran kerajinan tangan dari bambu lokal Bali yang akan digelar selama 3 hari." 
                  badge="Kegiatan" 
                  iconBg="rgba(201, 134, 26, 0.1)" 
                  iconColor={theme.gold} 
                />
                
                {/* Antrian 2 */}
                <ModerationCard 
                  icon={ShoppingBag} 
                  title="Warung Sate Lilit Bu Ayu" 
                  location="Banjar Kaja Sesetan · 30 Juni 2026" 
                  description="Warung sate lilit khas Bali yang sudah berdiri sejak 1995." 
                  badge="Umkm" 
                  iconBg="rgba(201, 134, 26, 0.1)" 
                  iconColor={theme.gold} 
                />

                {/* Antrian 3 */}
                <ModerationCard 
                  icon={Building2} 
                  title="Pendaftaran Banjar Penglipuran" 
                  location="Banjar Penglipuran · 28 Juni 2026" 
                  description="Permohonan pendaftaran Banjar Penglipuran ke platform banjar.id." 
                  badge="Profil Banjar" 
                  iconBg="rgba(74, 158, 96, 0.1)" 
                  iconColor={theme.green} 
                />
              </div>
            </div>

            {/* Kanan: Riwayat Moderasi */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold text-lg">Riwayat Moderasi</h3>
              </div>
              
              <div className="space-y-4">
                {/* Riwayat 1 */}
                <HistoryCard 
                  icon={Building2} 
                  title="Pendaftaran Banjar Ubud Kaja" 
                  location="Banjar Ubud Kaja · 1 Juli 2026" 
                  status="Disetujui" 
                  statusColor={theme.green}
                  statusBg="rgba(74, 158, 96, 0.1)"
                  iconBg="rgba(74, 158, 96, 0.1)" 
                  iconColor={theme.green} 
                />

                {/* Riwayat 2 */}
                <HistoryCard 
                  icon={Calendar} 
                  title="Festival Barong Sanur" 
                  location="Banjar Sanur Kaja · 30 Juni 2026" 
                  status="Ditolak" 
                  statusColor={theme.red}
                  statusBg="rgba(192, 57, 43, 0.1)"
                  iconBg="rgba(192, 57, 43, 0.1)" 
                  iconColor={theme.red}
                  note="Catatan: Tanggal tidak sesuai kalender adat"
                />

                {/* Riwayat 3 */}
                <HistoryCard 
                  icon={ShoppingBag} 
                  title="Arak Bali Bu Kadek" 
                  location="Banjar Kuta Kaja · 29 Juni 2026" 
                  status="Disetujui" 
                  statusColor={theme.green}
                  statusBg="rgba(74, 158, 96, 0.1)"
                  iconBg="rgba(201, 134, 26, 0.1)" 
                  iconColor={theme.gold} 
                />
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Help Button */}
      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white/10" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <HelpCircle size={18} style={{ color: theme.textMuted }} />
      </button>
    </div>
  );

  // --- Sub-Components Khusus Halaman Ini ---

  function ModerationCard({ icon: Icon, title, location, description, badge, iconBg, iconColor }: any) {
    return (
      <div className="rounded-2xl p-5 border flex gap-4 transition-all hover:bg-white/5" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-base">{title}</h4>
            <div className="px-3 py-1 rounded-md text-[10px] font-semibold" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.goldLight }}>
              {badge}
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.textMuted }}>{location}</p>
          <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>{description}</p>
        </div>
      </div>
    );
  }

  function HistoryCard({ icon: Icon, title, location, status, statusColor, statusBg, iconBg, iconColor, note }: any) {
    return (
      <div className="rounded-2xl p-5 border flex gap-4 transition-all hover:bg-white/5" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-base">{title}</h4>
            <div className="px-3 py-1 rounded-md text-[10px] font-semibold" style={{ backgroundColor: statusBg, color: statusColor }}>
              {status}
            </div>
          </div>
          <p className="text-xs" style={{ color: theme.textMuted }}>{location}</p>
          {note && (
            <p className="text-xs mt-3 font-medium" style={{ color: theme.red }}>{note}</p>
          )}
        </div>
      </div>
    );
  }
}
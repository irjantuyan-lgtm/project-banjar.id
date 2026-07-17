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
  Building2,
  ShoppingBag,
  Users,
  Activity,
  ArrowUpRight,
  ArrowRight,
  LogOut,
  HelpCircle,
  Calendar
} from "lucide-react";

export default function Dashboard() {
  // Warna tema (disamakan dengan referensi gambar)
  const theme = {
    bgMain: "#140A05",
    bgPanel: "#1C100A",
    gold: "#C9861A",
    goldLight: "#E6BA75",
    textMuted: "#8C7A6B",
    textLight: "#FDF8F2",
    green: "#4A9E60",
    border: "rgba(201, 134, 26, 0.15)",
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Dashboard Super Admin | banjar.id" />

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
            <Link href="/superadmin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <LayoutGrid size={18} />
              <span className="text-sm font-semibold">Dashboard</span>
              <ArrowRight size={14} className="ml-auto" />
            </Link>

            <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <BarChart2 size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Statistik Global</span>
            </Link>

            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <PlusCircle size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Buat Akun Banjar</span>
            </Link>

            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <ShieldCheck size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Moderasi Konten</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>3</span>
            </Link>

            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Bottom */}
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
            
            {/* BAGIAN INI YANG KITA UBAH MENJADI LINK INERTIA */}
            <Link 
              href="/logout" 
              method="post" 
              as="button"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut size={16} style={{ color: theme.textMuted }} />
            </Link>

          </div>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Dashboard</h2>
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
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          
          {/* Top Stats Row 1 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building2} value="1,480" label="Total Banjar" subLabel="1241 aktif" color={theme.gold} />
            <StatCard icon={ShoppingBag} value="5,243" label="Total UMKM" subLabel="di seluruh Bali" color={theme.gold} />
            <StatCard icon={Users} value="28,470" label="Pengguna" subLabel="terdaftar" color={theme.green} />
            <StatCard icon={Activity} value="342" label="Kegiatan Aktif" subLabel="bulan ini" color={theme.gold} />
          </div>

          {/* Middle Stats Row 2 */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <span className="text-3xl font-bold" style={{ color: theme.gold }}>239</span>
              <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Banjar Menunggu</span>
            </div>
            <div className="flex-1 rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <span className="text-3xl font-bold" style={{ color: theme.green }}>47</span>
              <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Banjar Baru Bulan Ini</span>
            </div>
            <div className="flex-[1.5] rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <span className="text-3xl font-bold" style={{ color: theme.goldLight }}>182,400</span>
              <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Total Views</span>
            </div>
          </div>

          {/* Bottom Section: Moderation & Chart */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Antrian Moderasi */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Antrian Moderasi</h3>
                <button className="text-xs flex items-center gap-1 hover:underline" style={{ color: theme.gold }}>
                  Lihat Semua <ArrowRight size={12} />
                </button>
              </div>
              
              <div className="space-y-4">
                <ModerationItem title="Pameran Kerajinan Bambu" subtitle="Banjar Tegal Jaya · 2 Juli 2026" type="Kegiatan" dotColor={theme.gold} />
                <ModerationItem title="Warung Sate Lilit Bu Ayu" subtitle="Banjar Kaja Sesetan · 30 Juni 2026" type="Umkm" dotColor={theme.gold} />
                <ModerationItem title="Pendaftaran Banjar Penglipuran" subtitle="Banjar Penglipuran · 28 Juni 2026" type="Profil_banjar" dotColor={theme.gold} />
              </div>
            </div>

            {/* Sebaran per Kabupaten (Simulated Bar Chart) */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Sebaran per Kabupaten</h3>
                <button className="text-xs flex items-center gap-1 hover:underline" style={{ color: theme.gold }}>
                  Statistik Lengkap <ArrowRight size={12} />
                </button>
              </div>

              <div className="space-y-5 mt-4">
                <BarItem label="Denpasar" value="312" percentage="95%" />
                <BarItem label="Badung" value="278" percentage="85%" />
                <BarItem label="Gianyar" value="241" percentage="70%" />
                <BarItem label="Tabanan" value="198" percentage="60%" />
                <BarItem label="Buleleng" value="187" percentage="55%" />
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-4 gap-4">
             <ActionButton label="Buat Akun Banjar" />
             <ActionButton label="Tinjau Moderasi" />
             <ActionButton label="Statistik Global" />
             <ActionButton label="Pantau Platform" />
          </div>

        </div>
      </main>
      
      {/* Floating Help Button */}
      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white/10" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <HelpCircle size={18} style={{ color: theme.textMuted }} />
      </button>

    </div>
  );

  // --- Sub-Components (Diletakkan di dalam file yang sama agar mudah di-copy) ---

  function StatCard({ icon: Icon, value, label, subLabel, color }: any) {
    return (
      <div className="rounded-2xl p-5 border relative overflow-hidden" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(201,134,26,0.1)" }}>
            <Icon size={20} style={{ color: theme.gold }} />
          </div>
          <ArrowUpRight size={16} style={{ color: theme.green }} />
        </div>
        <h3 className="text-3xl font-bold mb-1" style={{ color: color }}>{value}</h3>
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-xs" style={{ color: color === theme.green ? theme.green : theme.textMuted }}>{subLabel}</p>
      </div>
    );
  }

  function ModerationItem({ title, subtitle, type, dotColor }: any) {
    return (
      <div className="flex items-start gap-4 p-3 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/5">
        <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }}></div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
          <p className="text-xs" style={{ color: theme.textMuted }}>{subtitle}</p>
        </div>
        <div className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
          {type}
        </div>
      </div>
    );
  }

  function BarItem({ label, value, percentage }: any) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <span className="w-20 flex-shrink-0" style={{ color: theme.textMuted }}>{label}</span>
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full" style={{ width: percentage, backgroundColor: theme.goldLight }}></div>
        </div>
        <span className="w-8 text-right font-bold" style={{ color: theme.textLight }}>{value}</span>
      </div>
    );
  }

  function ActionButton({ label }: any) {
    return (
      <button className="flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-white/5" style={{ backgroundColor: "rgba(201,134,26,0.02)", borderColor: theme.border, color: theme.gold }}>
        <span className="text-sm font-bold">{label}</span>
        <ArrowRight size={16} />
      </button>
    );
  }
}
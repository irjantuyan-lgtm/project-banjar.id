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
  Wifi,
  Activity,
  Users,
  CheckCircle2,
  TrendingUp,
  FileText,
  UserCheck
} from "lucide-react";

export default function Pantau() {
  // Tema warna yang konsisten
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
      <Head title="Pantau Platform | banjar.id" />

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

            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <ShieldCheck size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Moderasi Konten</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>3</span>
            </Link>

            {/* Menu Pantau Aktif */}
            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <Globe size={18} />
              <span className="text-sm font-semibold">Pantau Platform</span>
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
        {/* Header (Top Nav) */}
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Pantau Platform</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
            </button>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>
              SUPER ADMIN
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          
          {/* Page Titles */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Pantau Platform</h1>
            <p style={{ color: theme.textMuted }}>Status real-time dan aktivitas platform banjar.id</p>
          </div>

          {/* Server Status Cards */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <StatusCard icon={Wifi} title="API Server" status="Online" statusColor={theme.green} />
            <StatusCard icon={Activity} title="Database" status="Healthy" statusColor={theme.green} />
            <StatusCard icon={Globe} title="CDN" status="Online" statusColor={theme.green} />
            <StatusCard icon={Users} title="Auth Service" status="Online" statusColor={theme.green} />
          </div>

          {/* Main Grid: 2 Columns */}
          <div className="grid grid-cols-2 gap-8">
            
            {/* Kiri: Aktivitas Real-time */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold text-lg">Aktivitas Real-time</h3>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.green }}></span>
              </div>
              
              <div className="space-y-1">
                <ActivityItem title="Banjar Kaja Sesetan" desc="Submit kegiatan baru" time="2 menit lalu" dotColor={theme.gold} />
                <ActivityItem title="Banjar Penglipuran" desc="Profil diperbarui" time="14 menit lalu" dotColor={theme.green} />
                <ActivityItem title="Banjar Tegal Jaya" desc="Admin login baru" time="32 menit lalu" dotColor={theme.red} />
                <ActivityItem title="Banjar Ubud Kaja" desc="UMKM baru ditambahkan" time="1 jam lalu" dotColor={theme.gold} />
                <ActivityItem title="Banjar Sanur Kaja" desc="Akun aktivasi" time="2 jam lalu" dotColor={theme.green} />
              </div>
            </div>

            {/* Kanan: Metrik & Status Global */}
            <div className="space-y-6">
              
              {/* Metrik Hari Ini */}
              <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
                <h3 className="font-bold text-lg mb-6">Metrik Hari Ini</h3>
                <div className="space-y-5">
                  <MetricItem icon={Users} label="Admin Banjar Login" value="124" valColor={theme.goldLight} />
                  <MetricItem icon={FileText} label="Konten Disubmit" value="8" valColor={theme.goldLight} />
                  <MetricItem icon={CheckCircle2} label="Profil Diperbarui" value="23" valColor={theme.green} />
                  <MetricItem icon={TrendingUp} label="Banjar Baru" value="3" valColor={theme.goldLight} />
                </div>
              </div>

              {/* Status Banner */}
              <div className="rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: "rgba(74, 158, 96, 0.05)", borderColor: theme.border }}>
                <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(74, 158, 96, 0.1)" }}>
                  <CheckCircle2 size={24} style={{ color: theme.green }} />
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: theme.green }}>Semua sistem berjalan normal</h4>
                  <p className="text-xs" style={{ color: theme.textMuted }}>Uptime 99.98% · Diperbarui 1 menit lalu</p>
                </div>
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

  function StatusCard({ icon: Icon, title, status, statusColor }: any) {
    return (
      <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(74, 158, 96, 0.1)" }}>
          <Icon size={20} style={{ color: theme.textMuted }} />
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1">{title}</h4>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }}></span>
            <span className="text-xs font-semibold" style={{ color: statusColor }}>{status}</span>
          </div>
        </div>
      </div>
    );
  }

  function ActivityItem({ title, desc, time, dotColor }: any) {
    return (
      <div className="flex items-start gap-4 p-3 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/5">
        <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }}></div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
          <p className="text-xs" style={{ color: theme.textMuted }}>{desc}</p>
        </div>
        <span className="text-[10px] font-medium" style={{ color: theme.textMuted }}>{time}</span>
      </div>
    );
  }

  function MetricItem({ icon: Icon, label, value, valColor }: any) {
    return (
      <div className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-3">
          <Icon size={16} style={{ color: theme.textMuted }} />
          <span className="text-sm font-medium" style={{ color: theme.textMuted }}>{label}</span>
        </div>
        <span className="font-bold" style={{ color: valColor }}>{value}</span>
      </div>
    );
  }
}
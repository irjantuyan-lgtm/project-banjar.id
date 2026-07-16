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
  HelpCircle
} from "lucide-react";

export default function Statistik() {
  // Tema warna yang konsisten dengan Dashboard
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
    barColor: "#7A2E1A" // Warna cokelat kemerahan untuk bar chart
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Statistik Global | banjar.id" />

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

            {/* Menu Statistik Aktif */}
            <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <BarChart2 size={18} />
              <span className="text-sm font-semibold">Statistik Global</span>
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
        <header className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Statistik Global</h2>
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
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          
          {/* Top Stats Row (6 Cards) */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <MiniStatCard value="1,480" label="Banjar" valColor={theme.goldLight} />
            <MiniStatCard value="1,241" label="Aktif" valColor={theme.green} />
            <MiniStatCard value="239" label="Pending" valColor={theme.textMuted} />
            <MiniStatCard value="5,243" label="UMKM" valColor={theme.goldLight} />
            <MiniStatCard value="28,470" label="Users" valColor={theme.green} />
            <MiniStatCard value="47" label="Baru/Bln" valColor={theme.goldLight} />
          </div>

          {/* Middle Section: Charts */}
          <div className="flex gap-6 mb-6 h-72">
            
           {/* Left: Pertumbuhan Banjar */}
            <div className="flex-1 rounded-2xl p-6 border flex flex-col" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <h3 className="font-bold mb-4">Pertumbuhan Banjar (2026)</h3>
              <div className="flex-1 relative border-l border-b border-white/10 ml-6 pb-2">
                {/* Y-Axis Labels */}
                <div className="absolute -left-8 top-0 text-[10px]" style={{ color: theme.textMuted }}>1500</div>
                <div className="absolute -left-8 top-1/4 text-[10px]" style={{ color: theme.textMuted }}>1465</div>
                <div className="absolute -left-8 top-2/4 text-[10px]" style={{ color: theme.textMuted }}>1430</div>
                <div className="absolute -left-8 bottom-0 text-[10px]" style={{ color: theme.textMuted }}>1360</div>
                
                {/* KUNCI GRAFIK: Container SVG dilock dengan absolute dan overflow-hidden */}
                <div className="w-full h-full relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 0 90 Q 20 85, 40 70 T 80 40 L 100 20" fill="none" stroke={theme.gold} strokeWidth="2" />
                    <circle cx="0" cy="90" r="1.5" fill={theme.goldLight} />
                    <circle cx="20" cy="80" r="1.5" fill={theme.goldLight} />
                    <circle cx="40" cy="70" r="1.5" fill={theme.goldLight} />
                    <circle cx="60" cy="60" r="1.5" fill={theme.goldLight} />
                    <circle cx="80" cy="40" r="1.5" fill={theme.goldLight} />
                    <circle cx="100" cy="20" r="1.5" fill={theme.goldLight} />
                  </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px]" style={{ color: theme.textMuted }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
                </div>
              </div>
            </div>

            {/* Right: Total Views per Bulan */}
            <div className="flex-1 rounded-2xl p-6 border flex flex-col" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <h3 className="font-bold mb-4">Total Views per Bulan</h3>
              <div className="flex-1 relative border-l border-b border-white/10 ml-8 pb-2">
                 {/* Y-Axis Labels */}
                 <div className="absolute -left-10 top-0 text-[10px]" style={{ color: theme.textMuted }}>200000</div>
                 <div className="absolute -left-10 top-1/2 text-[10px]" style={{ color: theme.textMuted }}>100000</div>
                 <div className="absolute -left-6 bottom-0 text-[10px]" style={{ color: theme.textMuted }}>0</div>

                 {/* Flex Bar Chart Simulation */}
                 <div className="w-full h-full flex items-end justify-between px-2 gap-3">
                    <div className="w-full rounded-t-sm" style={{ height: '60%', backgroundColor: theme.barColor }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '65%', backgroundColor: theme.barColor }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '70%', backgroundColor: theme.barColor }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '75%', backgroundColor: theme.barColor }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '80%', backgroundColor: theme.barColor }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '85%', backgroundColor: theme.barColor }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '90%', backgroundColor: theme.barColor }}></div>
                 </div>

                 {/* X-Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-3 text-[10px]" style={{ color: theme.textMuted }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Sebaran Banjar */}
          <div className="rounded-2xl p-6 border mb-6" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
            <h3 className="font-bold mb-6">Sebaran Banjar per Kabupaten/Kota</h3>
            <div className="space-y-5">
              <HorizontalBarItem label="Denpasar" value="312" percentage="95%" displayPct="21%" />
              <HorizontalBarItem label="Badung" value="278" percentage="85%" displayPct="19%" />
              <HorizontalBarItem label="Gianyar" value="241" percentage="75%" displayPct="16%" />
              <HorizontalBarItem label="Tabanan" value="198" percentage="65%" displayPct="13%" />
              <HorizontalBarItem label="Buleleng" value="187" percentage="60%" displayPct="13%" />
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

  // --- Sub-Components ---

  function MiniStatCard({ value, label, valColor }: any) {
    return (
      <div className="rounded-2xl p-4 border flex flex-col items-center justify-center" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <h3 className="text-2xl font-bold mb-1" style={{ color: valColor }}>{value}</h3>
        <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{label}</p>
      </div>
    );
  }

  function HorizontalBarItem({ label, value, percentage, displayPct }: any) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <span className="w-24 flex-shrink-0" style={{ color: theme.textMuted }}>{label}</span>
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          {/* Bar Fill */}
          <div className="h-full rounded-full" style={{ width: percentage, backgroundColor: theme.gold }}></div>
        </div>
        <div className="w-16 flex justify-end gap-3 font-bold">
          <span style={{ color: theme.goldLight }}>{value}</span>
          <span style={{ color: theme.textMuted, fontSize: '12px' }}>{displayPct}</span>
        </div>
      </div>
    );
  }
}
import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
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
// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout";

export default function Statistik() {
  // 1. Ambil data dari Backend Laravel
  const { top_stats = {}, pertumbuhan = [], sebaran = [] }: any = usePage().props;

  // Tema warna
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
    barColor: "#7A2E1A"
  };

  // 2. Fungsi Pembantu untuk menghitung dinamis Grafik Garis (SVG)
  const maxPertumbuhan = Math.max(...pertumbuhan.map((p: any) => p.total), 10); 
  const buildSvgPath = () => {
    if (pertumbuhan.length === 0) return "";
    let path = `M 0 ${90 - (pertumbuhan[0]?.total / maxPertumbuhan) * 70}`;
    pertumbuhan.forEach((p: any, i: number) => {
      if (i > 0) {
        const x = (i / (pertumbuhan.length - 1)) * 100;
        const y = 90 - (p.total / maxPertumbuhan) * 70;
        // Simple bezier curve smoothing
        const prevX = ((i - 1) / (pertumbuhan.length - 1)) * 100;
        const prevY = 90 - (pertumbuhan[i-1].total / maxPertumbuhan) * 70;
        const cpX = (prevX + x) / 2;
        path += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
      }
    });
    return path;
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Statistik Global | banjar.id" />

      {/* ========================================== */}
      {/* 1. SIDEBAR KIRI (Dibiarkan persis seperti desain Anda) */}
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
              {top_stats.pending > 0 && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>
                  {top_stats.pending}
                </span>
              )}
            </Link>

            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>
              <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
               <Globe size={18} style={{ color: theme.textMuted }} />
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
            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <LogOut size={16} style={{ color: theme.textMuted }} />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
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

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <MiniStatCard value={top_stats.total_banjar?.toLocaleString('id-ID')} label="Banjar" valColor={theme.goldLight} />
            <MiniStatCard value={top_stats.aktif?.toLocaleString('id-ID')} label="Aktif" valColor={theme.green} />
            <MiniStatCard value={top_stats.pending?.toLocaleString('id-ID')} label="Pending" valColor={theme.textMuted} />
            <MiniStatCard value={top_stats.umkm?.toLocaleString('id-ID')} label="UMKM" valColor={theme.goldLight} />
            <MiniStatCard value={top_stats.users?.toLocaleString('id-ID')} label="Users Warga" valColor={theme.green} />
            <MiniStatCard value={top_stats.baru_bulan_ini?.toLocaleString('id-ID')} label="Baru/Bln" valColor={theme.goldLight} />
          </div>

          {/* Middle Section: Charts */}
          <div className="flex gap-6 mb-6 h-72">
            
           {/* Left: Pertumbuhan Banjar (Dinamis dari Database) */}
            <div className="flex-1 rounded-2xl p-6 border flex flex-col" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <h3 className="font-bold mb-4">Pertumbuhan Banjar (Tahun Ini)</h3>
              <div className="flex-1 relative border-l border-b border-white/10 ml-6 pb-2">
                {/* Y-Axis Labels */}
                <div className="absolute -left-8 top-0 text-[10px]" style={{ color: theme.textMuted }}>{maxPertumbuhan}</div>
                <div className="absolute -left-8 top-1/2 text-[10px]" style={{ color: theme.textMuted }}>{Math.round(maxPertumbuhan/2)}</div>
                <div className="absolute -left-6 bottom-0 text-[10px]" style={{ color: theme.textMuted }}>0</div>
                
                {/* SVG Line Chart */}
                <div className="w-full h-full relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d={buildSvgPath()} fill="none" stroke={theme.gold} strokeWidth="2.5" className="transition-all duration-1000" />
                    
                    {/* Render Titik Koordinat secara dinamis */}
                    {pertumbuhan.map((p: any, i: number) => {
                      const x = (i / (pertumbuhan.length - 1)) * 100;
                      const y = 90 - (p.total / maxPertumbuhan) * 70;
                      return (
                        <circle key={i} cx={x} cy={y} r="1.5" fill={theme.goldLight} className="transition-all duration-1000">
                           <title>{p.bulan}: {p.total} pendaftaran</title>
                        </circle>
                      );
                    })}
                  </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px]" style={{ color: theme.textMuted }}>
                  {pertumbuhan.map((p: any, i: number) => (
                    <span key={i}>{p.bulan}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Bar Chart Simulai dari data yang sama (Views/Pendaftaran) */}
            <div className="flex-1 rounded-2xl p-6 border flex flex-col" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <h3 className="font-bold mb-4">Aktivitas Pendaftaran (Bar)</h3>
              <div className="flex-1 relative border-l border-b border-white/10 ml-8 pb-2">
                 <div className="absolute -left-10 top-0 text-[10px]" style={{ color: theme.textMuted }}>{maxPertumbuhan}</div>
                 <div className="absolute -left-8 bottom-0 text-[10px]" style={{ color: theme.textMuted }}>0</div>

                 <div className="w-full h-full flex items-end justify-between px-2 gap-3">
                   {pertumbuhan.map((p: any, i: number) => {
                     // Hitung tinggi berdasarkan max value agar bar-nya dinamis
                     const barHeight = Math.max((p.total / maxPertumbuhan) * 100, 5) + "%";
                     return (
                      <div 
                        key={i} 
                        className="w-full rounded-t-sm transition-all duration-1000 hover:brightness-125 cursor-pointer" 
                        style={{ height: barHeight, backgroundColor: theme.barColor }}
                        title={`${p.total} pendaftaran di bulan ${p.bulan}`}
                      ></div>
                     );
                   })}
                 </div>

                <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-3 text-[10px]" style={{ color: theme.textMuted }}>
                  {pertumbuhan.map((p: any, i: number) => (
                    <span key={i}>{p.bulan}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Sebaran Banjar */}
          <div className="rounded-2xl p-6 border mb-6" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
            <h3 className="font-bold mb-6">Sebaran Banjar per Kabupaten/Kota</h3>
            <div className="space-y-5">
              {sebaran.length > 0 ? (
                sebaran.map((item: any, i: number) => (
                  <HorizontalBarItem 
                    key={i} 
                    label={item.label} 
                    value={item.value?.toLocaleString('id-ID')} 
                    percentage={item.percentage} 
                    displayPct={item.displayPct} 
                  />
                ))
              ) : (
                <p className="text-xs text-center py-4" style={{ color: theme.textMuted }}>Belum ada data wilayah aktif.</p>
              )}
            </div>
          </div>

        </div>
      </main>
      
      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white/10" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <HelpCircle size={18} style={{ color: theme.textMuted }} />
      </button>
    </div>
  );

  // --- Sub-Components ---
  function MiniStatCard({ value, label, valColor }: any) {
    return (
      <div className="rounded-2xl p-4 border flex flex-col items-center justify-center" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <h3 className="text-2xl font-bold mb-1" style={{ color: valColor }}>{value || "0"}</h3>
        <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{label}</p>
      </div>
    );
  }

  function HorizontalBarItem({ label, value, percentage, displayPct }: any) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <span className="w-24 flex-shrink-0 truncate" style={{ color: theme.textMuted }}>{label}</span>
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: percentage, backgroundColor: theme.gold }}></div>
        </div>
        <div className="w-16 flex justify-end gap-3 font-bold">
          <span style={{ color: theme.goldLight }}>{value}</span>
          <span style={{ color: theme.textMuted, fontSize: '12px' }}>{displayPct}</span>
        </div>
      </div>
    );
  }
}
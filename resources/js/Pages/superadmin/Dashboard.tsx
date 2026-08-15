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
  // 1. Ambil data dari backend Laravel melalui Inertia
  const { 
    auth, 
    superadminName, 
    statistik = {}, 
    antrian_moderasi = [], 
    sebaran_kabupaten = [],
    notifications = [] 
  }: any = usePage().props;

  // State lokal untuk melacak apakah banner ditutup secara manual oleh user
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // 2. Siapkan fallback nilai default (agar tidak error jika data belum siap)
  const stats = {
    total_banjar: statistik.total_banjar || 0,
    total_umkm: statistik.total_umkm || 0,
    total_pengguna: statistik.total_pengguna || 0,
    kegiatan_aktif: statistik.kegiatan_aktif || 0,
    banjar_menunggu: statistik.banjar_menunggu || 0,
    banjar_baru: statistik.banjar_baru || 0,
    total_views: statistik.total_views || 0,
  };

  const adminName = superadminName || auth?.user?.name || "Super Administrator";

  // Warna tema
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

  // Mengecek apakah ada notifikasi yang belum dibaca DAN banner belum ditutup manual
  const hasUnreadNotif = !isBannerDismissed && notifications.some((n: any) => !n.is_read);

  // Fungsi untuk menutup banner secara instan
  const handleDismissBanner = () => {
    setIsBannerDismissed(true); // Langsung tutup di tampilan frontend
    router.post('/superadmin/notifikasi/dismiss-banner', {}, { preserveScroll: true }); // Simpan ke session backend
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      
      <Head>
        <title>Dashboard Super Admin | banjar.id</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Head title="Dashboard Super Admin | banjar.id" />

      {/* ========================================== */}
      {/* 1. SIDEBAR KIRI */}
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
              {stats.banjar_menunggu > 0 && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>
                  {stats.banjar_menunggu}
                </span>
              )}
            </Link>
            
            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>

            <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Users size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Manajemen Admin</span>
            </Link>

            {/* Menu Notifikasi */}
            <Link href="/superadmin/notifikasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Bell size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pusat Notifikasi</span>
            </Link>
          </nav>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#E74C3C" }}>
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{adminName}</p>
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            
            {/* Tombol Lonceng */}
            <Link href="/superadmin/notifikasi" className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
              {hasUnreadNotif && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: theme.gold }}></span>
              )}
            </Link>

            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>
              SUPER ADMIN
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          
          {/* ========================================== */}
          {/* TOAST / BANNER MELAYANG NOTIFIKASI BARU */}
          {/* ========================================== */}
          {hasUnreadNotif && (
            <div className="mb-6 animate-fadeIn">
              <div className="px-5 py-3.5 rounded-xl border flex items-center justify-between shadow-lg" 
                   style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold }}>
                  <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-black/20">
                         <Bell size={16} style={{ color: theme.gold }} className="animate-bounce" />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: theme.textLight }}>
                          Anda memiliki notifikasi baru: <span style={{ color: theme.goldLight }}>{notifications.find((n: any) => !n.is_read)?.title}</span>
                      </p>
                  </div>
                  <div className="flex items-center gap-3">
                      <Link href="/superadmin/notifikasi" className="text-xs font-bold hover:underline flex items-center gap-1" style={{ color: theme.gold }}>
                          Lihat Semua <ArrowRight size={12}/>
                      </Link>
                      
                      {/* TOMBOL SILANG (X) UNTUK MENUTUP BANNER SECARA INSTAN */}
                      <button 
                          onClick={handleDismissBanner}
                          className="p-1 rounded-lg hover:bg-black/25 transition-colors text-xs font-bold cursor-pointer"
                          style={{ color: theme.textMuted }}
                          title="Tutup pemberitahuan ini"
                      >
                          ✕
                      </button>
                  </div>
              </div>
            </div>
          )}
          
          {/* Top Stats Row 1 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building2} value={stats.total_banjar.toLocaleString('id-ID')} label="Total Banjar" subLabel="Terdaftar di sistem" color={theme.gold} />
            <StatCard icon={ShoppingBag} value={stats.total_umkm.toLocaleString('id-ID')} label="Total UMKM" subLabel="Produk warga" color={theme.gold} />
            <StatCard icon={Users} value={stats.total_pengguna.toLocaleString('id-ID')} label="Pengguna" subLabel="Total akun warga" color={theme.green} />
            <StatCard icon={Activity} value={stats.kegiatan_aktif.toLocaleString('id-ID')} label="Kegiatan Aktif" subLabel="Keseluruhan acara" color={theme.gold} />
          </div>

          {/* Middle Stats Row 2 */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <span className="text-3xl font-bold" style={{ color: theme.gold }}>{stats.banjar_menunggu.toLocaleString('id-ID')}</span>
              <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Banjar Menunggu</span>
            </div>
            <div className="flex-1 rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <span className="text-3xl font-bold" style={{ color: theme.green }}>{stats.banjar_baru.toLocaleString('id-ID')}</span>
              <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Banjar Baru Bulan Ini</span>
            </div>
            <div className="flex-[1.5] rounded-2xl p-6 border flex items-center gap-4" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <span className="text-3xl font-bold" style={{ color: theme.goldLight }}>{stats.total_views.toLocaleString('id-ID')}</span>
              <span className="text-sm font-medium" style={{ color: theme.textMuted }}>Total Kunjungan (Views)</span>
            </div>
          </div>

          {/* Bottom Section: Moderation & Chart */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Antrian Moderasi */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Antrian Moderasi</h3>
                <Link href="/superadmin/moderasi" className="text-xs flex items-center gap-1 hover:underline" style={{ color: theme.gold }}>
                  Lihat Semua <ArrowRight size={12} />
                </Link>
              </div>
              
              <div className="space-y-4">
                {antrian_moderasi.length > 0 ? (
                  antrian_moderasi.map((item: any, i: number) => (
                    <ModerationItem key={i} title={item.title} subtitle={item.subtitle} type={item.type} dotColor={theme.gold} />
                  ))
                ) : (
                  <p className="text-xs text-center py-4" style={{ color: theme.textMuted }}>Tidak ada antrian moderasi saat ini.</p>
                )}
              </div>
            </div>

            {/* Sebaran per Kabupaten */}
            <div className="rounded-2xl p-6 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Sebaran per Kota/Kabupaten</h3>
                <Link href="/superadmin/statistik" className="text-xs flex items-center gap-1 hover:underline" style={{ color: theme.gold }}>
                  Statistik Lengkap <ArrowRight size={12} />
                </Link>
              </div>

              <div className="space-y-5 mt-4">
                {sebaran_kabupaten.length > 0 ? (
                  sebaran_kabupaten.map((item: any, i: number) => (
                    <BarItem key={i} label={item.label} value={item.value} percentage={item.percentage} />
                  ))
                ) : (
                  <p className="text-xs text-center py-4" style={{ color: theme.textMuted }}>Belum ada data wilayah aktif.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
             <ActionButton label="Buat Akun Banjar" link="/superadmin/buat-banjar" />
             <ActionButton label="Tinjau Moderasi" link="/superadmin/moderasi" />
             <ActionButton label="Statistik Global" link="/superadmin/statistik" />
             <ActionButton label="Pusat Notifikasi" link="/superadmin/notifikasi" />
          </div>

        </div>
      </main>
      
      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white/10" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <HelpCircle size={18} style={{ color: theme.textMuted }} />
      </button>

    </div>
  );

  // --- Sub-Components ---
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
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: percentage, backgroundColor: theme.goldLight }}></div>
        </div>
        <span className="w-8 text-right font-bold" style={{ color: theme.textLight }}>{value}</span>
      </div>
    );
  }

  function ActionButton({ label, link }: any) {
    return (
      <Link href={link} className="flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-white/5" style={{ backgroundColor: "rgba(201,134,26,0.02)", borderColor: theme.border, color: theme.gold }}>
        <span className="text-sm font-bold">{label}</span>
        <ArrowRight size={16} />
      </Link>
    );
  }
}
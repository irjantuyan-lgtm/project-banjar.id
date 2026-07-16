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
  ArrowRight
} from "lucide-react";

export default function BuatBanjar() {
  // Tema warna yang konsisten
  const theme = {
    bgMain: "#140A05",
    bgPanel: "#1C100A",
    gold: "#C9861A",
    goldLight: "#E6BA75",
    textMuted: "#8C7A6B",
    textLight: "#FDF8F2",
    border: "rgba(201, 134, 26, 0.15)",
    inputBg: "rgba(253, 248, 242, 0.03)", // Latar belakang input yang sangat tipis
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Buat Akun Banjar | banjar.id" />

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

            {/* Menu Buat Banjar Aktif */}
            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <PlusCircle size={18} />
              <span className="text-sm font-semibold">Buat Akun Banjar</span>
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
        {/* Header (Top Nav) */}
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Buat Akun Banjar</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
            </button>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>
              SUPER ADMIN
            </div>
          </div>
        </header>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          
          <div className="max-w-3xl">
            {/* Page Titles */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Buat Akun Banjar Baru</h1>
              <p style={{ color: theme.textMuted }}>Daftarkan komunitas banjar dari seluruh dunia ke platform banjar.id</p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center gap-4 mb-8 text-sm font-semibold">
              <div className="flex items-center gap-2" style={{ color: theme.gold }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-[#140A05]" style={{ backgroundColor: theme.gold }}>1</span>
                Info Banjar
              </div>
              <div className="w-16 h-[1px]" style={{ backgroundColor: theme.border }}></div>
              <div className="flex items-center gap-2" style={{ color: theme.textMuted }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: theme.border }}>2</span>
                Admin
              </div>
              <div className="w-16 h-[1px]" style={{ backgroundColor: theme.border }}></div>
              <div className="flex items-center gap-2" style={{ color: theme.textMuted }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: theme.border }}>3</span>
                Akses
              </div>
            </div>

            {/* Form Box */}
            <div className="rounded-2xl p-8 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              
              <div className="flex items-center gap-2 mb-6 font-bold" style={{ color: theme.goldLight }}>
                <MapPin size={18} />
                <h3>Informasi Banjar (Global)</h3>
              </div>

              <form className="space-y-5">
                {/* Nama Banjar */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Nama Banjar</label>
                  <input 
                    type="text" 
                    className="w-full rounded-xl p-3 border outline-none transition-colors focus:border-[#C9861A]"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                  />
                </div>

                {/* Grid: Negara & Provinsi */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Negara</label>
                    <select 
                      className="w-full rounded-xl p-3 border outline-none appearance-none"
                      style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                    >
                      <option style={{ backgroundColor: theme.bgPanel }}>Indonesia</option>
                      <option style={{ backgroundColor: theme.bgPanel }}>Australia</option>
                      <option style={{ backgroundColor: theme.bgPanel }}>Jepang</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Provinsi / State</label>
                    <select 
                      className="w-full rounded-xl p-3 border outline-none appearance-none"
                      style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                    >
                      <option style={{ backgroundColor: theme.bgPanel }}>Bali</option>
                    </select>
                  </div>
                </div>

                {/* Grid: Kabupaten & Kecamatan */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Kabupaten / Kota</label>
                    <select 
                      className="w-full rounded-xl p-3 border outline-none appearance-none"
                      style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                    >
                      <option style={{ backgroundColor: theme.bgPanel }}>Denpasar</option>
                      <option style={{ backgroundColor: theme.bgPanel }}>Badung</option>
                      <option style={{ backgroundColor: theme.bgPanel }}>Gianyar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Kecamatan / Suburb</label>
                    <input 
                      type="text" 
                      className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]"
                      style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                    />
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Deskripsi Singkat</label>
                  <textarea 
                    rows={4}
                    className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A] resize-none"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="button" 
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl font-bold text-[#140A05] transition-opacity hover:opacity-90"
                    style={{ backgroundColor: theme.gold }}
                  >
                    Lanjutkan <ArrowRight size={18} />
                  </button>
                </div>

              </form>
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
}
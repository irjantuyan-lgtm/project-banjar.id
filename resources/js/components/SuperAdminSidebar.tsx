// resources/js/components/SuperAdminSidebar.tsx
import { useForm, Link, Head } from '@inertiajs/react';
import { LogOut, LayoutDashboard, BarChart3, PlusCircle, ShieldAlert, Monitor, User } from 'lucide-react';
import React from 'react';

export default function SuperAdminSidebar() {
  const { post } = useForm();

  // Fungsi untuk logout
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <aside className="w-64 h-screen bg-[#1A1612] text-white flex flex-col fixed left-0 top-0 border-r border-slate-800">
      {/* 1. Header/Logo */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-amber-500">banjar.id</h2>
        <p className="text-xs text-amber-600 font-semibold tracking-wider">SUPER ADMIN</p>
      </div>
      
      {/* 2. Navigasi Tengah */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {/* PERBAIKAN: Semua href diubah dari /admin/... menjadi /superadmin/... */}
        <Link href="/superadmin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2520] transition-colors">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        
        <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2520] transition-colors">
          <BarChart3 size={18} /> Statistik Global
        </Link>
        
        {/* PERBAIKAN: Disesuaikan dengan route di web.php (/superadmin/buat-banjar) */}
        <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2520] transition-colors">
          <PlusCircle size={18} /> Buat Akun Banjar
        </Link>
        
        <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2520] transition-colors">
          <ShieldAlert size={18} /> Moderasi Konten
        </Link>
        
        <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2520] transition-colors">
          <Monitor size={18} /> Pantau Platform
        </Link>
        
        <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2A2520] transition-colors">
          <User size={18} /> Manajemen Admin
        </Link>
      </nav>

      {/* 3. Footer: Profil & Logout */}
      <div className="p-4 border-t border-slate-700 bg-[#1A1612]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-900 flex items-center justify-center text-xs font-bold">
            SA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Super Admin...</p>
            <p className="text-[10px] text-slate-400">banjar.id</p>
          </div>
          
          {/* TOMBOL LOGOUT (Ikon Panah Keluar) */}
          <form onSubmit={handleLogout}>
            <button 
              type="submit" 
              className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
import { Link } from '@inertiajs/react';
import React from 'react';

export default function SuperAdminSidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">Banjar.id</h2>
        <p className="text-sm text-slate-400 mt-1">Super Admin Panel</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          href="/admin/dashboard" 
          className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/statistik" 
          className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Statistik Data
        </Link>
        <Link 
          href="/admin/moderasi" 
          className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Moderasi Kegiatan
        </Link>
        <Link 
          href="/admin/buat-banjar" 
          className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Tambah Banjar
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link 
          href="/logout" 
          method="post" 
          as="button" 
          className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors font-medium"
        >
          Keluar (Logout)
        </Link>
      </div>
    </aside>
  );
}
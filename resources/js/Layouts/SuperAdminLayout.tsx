import React, { ReactNode } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

interface Props {
  children: ReactNode;
}

export default function SuperAdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Memanggil Komponen Sidebar */}
      <SuperAdminSidebar />

      {/* Area Konten Utama didorong ke kanan sebesar lebar sidebar (ml-64) */}
      <main className="ml-64 p-8 min-h-screen flex flex-col">
        
        {/* Kotak Putih Tempat Konten Render */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-1">
          {children}
        </div>
        
      </main>
    </div>
  );
}
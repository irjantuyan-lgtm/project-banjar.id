// resources/js/Layouts/SuperAdminLayout.tsx
import React, { ReactNode } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar'; // Harus ada ini!

interface Props {
  children: ReactNode;
}

export default function SuperAdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex">
      <SuperAdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
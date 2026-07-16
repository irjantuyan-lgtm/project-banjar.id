// resources/js/Layouts/AdminLayout.tsx
import { Link, usePage } from "@inertiajs/react"; // 1. Tambahkan usePage
import { LayoutDashboard, User, FileText, Map, Upload, Lock, UserCircle, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 2. Ambil URL saat ini
  const { url } = usePage();

  return (
    <div className="min-h-screen flex bg-[#1E1208] text-[#FDF8F2] font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#3D352E] p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8 text-[#C9861A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          BANJAR.ID
        </h1>
        
        <nav className="space-y-2 flex-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
            { name: 'Profil Banjar', icon: User, href: '/admin/profil' },
            { name: 'Admin Profil', icon: UserCircle, href: '/admin/adminprofil' },
            { name: 'Konten', icon: FileText, href: '/admin/konten' },
            { name: 'Peta', icon: Map, href: '/admin/peta' },
            { name: 'Submit Data', icon: Upload, href: '/admin/submit' },
            { name: 'Password', icon: Lock, href: '/admin/password' },
          ].map((item) => {
            // 3. Logika pengecekan link aktif
            const isActive = url === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#C9861A] text-white shadow-lg shadow-[#C9861A]/20' // Warna aktif
                    : 'text-[#FDF8F2]/70 hover:bg-[#2A1C12] hover:text-white' // Warna normal
                }`}
              >
                <item.icon size={18} /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto border-t border-[#3D352E] pt-6">
          <Link href="/logout" method="post" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut size={18} /> Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
// resources/js/Layouts/AdminLayout.tsx
import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, User, FileText, Map, Upload, Lock, UserCircle, LogOut, Users } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { url }: any = usePage();

  return (
    // UBAH WARNA LATAR BELAKANG UTAMA MENJADI KREM TERANG (#FDF8F2)
    <div className="min-h-screen flex bg-[#FDF8F2] text-[#1E1208] font-sans">
      
      {/* Sidebar: Gunakan warna krem agar senada */}
      <aside className="w-64 border-r border-[rgba(123,45,30,0.08)] bg-[#FDF8F2] p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8 text-[#C9861A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          BANJAR.ID
        </h1>
        
        <nav className="space-y-2 flex-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
            { name: 'Profil Banjar', icon: User, href: '/admin/profil' },
           // { name: 'Admin Profil', icon: UserCircle, href: '/admin/adminprofil' },
            { name: 'Manajemen Krama', icon: Users, href: '/admin/warga' },
            { name: 'Konten', icon: FileText, href: '/admin/konten' },
            { name: 'Peta', icon: Map, href: '/admin/peta' },
            { name: 'Submit Data', icon: Upload, href: '/admin/submit' },
            { name: 'Password', icon: Lock, href: '/admin/password' },
          ].map((item) => {
            const isActive = url === item.href || url.startsWith(item.href + '/');
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#E8DACC] text-[#7B2D1E] font-semibold' // Warna aktif (Krem tua)
                    : 'text-[#7A6555] hover:bg-[#FAF4EC] hover:text-[#1E1208]' // Warna normal
                }`}
              >
                <item.icon size={18} /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto border-t border-[rgba(123,45,30,0.08)] pt-6">
          <Link href="/logout" method="post" className="flex items-center gap-3 px-4 py-3 text-[#7A6555] hover:text-red-600 rounded-xl transition-colors">
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
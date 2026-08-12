import { useState } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import { LayoutDashboard, User, FileText, Map, Upload, Lock, LogOut, Users, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { url, props }: any = usePage();
  const auth = props.auth;

  // State untuk mengontrol buka-tutup sidebar di Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatRole = (role: string) => {
    if (role === 'admin_banjar') return 'Admin Banjar';
    if (role === 'anggota_banjar') return 'Anggota Banjar';
    if (role === 'super_admin') return 'Super Admin';
    return role || 'Pengguna';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDF8F2] text-[#1E1208] font-sans">
      
      {/* ========================================== */}
      {/* PENGAMAN SEO: MENCEGAH MESIN PENCARI MENGINDEKS HALAMAN ADMIN */}
      {/* ========================================== */}
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* ========================================== */}
      {/* HEADER MOBILE (Hanya Muncul di Layar HP) */}
      {/* ========================================== */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#FDF8F2] border-b border-[rgba(123,45,30,0.08)] sticky top-0 z-30">
        <h1 className="text-xl font-bold text-[#C9861A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
          BANJAR.ID
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-[#E8DACC] transition-colors"
        >
          <Menu size={24} style={{ color: "#7B2D1E" }} />
        </button>
      </div>

      {/* ========================================== */}
      {/* OVERLAY GELAP UNTUK MOBILE (Klik untuk tutup) */}
      {/* ========================================== */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ========================================== */}
      {/* SIDEBAR UTAMA (Responsif) */}
      {/* ========================================== */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#FDF8F2] border-r border-[rgba(123,45,30,0.08)] p-6 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-[#C9861A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            BANJAR.ID
          </h1>
          {/* Tombol Silang (X) hanya di mobile */}
          <button 
            className="md:hidden p-1.5 rounded-lg hover:bg-[#E8DACC] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} style={{ color: "#7A6555" }} />
          </button>
        </div>
        
        <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
            { name: 'Profil Banjar', icon: User, href: '/admin/profil' },
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
                onClick={() => setIsMobileMenuOpen(false)} // Otomatis tutup sidebar saat link diklik di HP
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#E8DACC] text-[#7B2D1E] font-semibold' 
                    : 'text-[#7A6555] hover:bg-[#FAF4EC] hover:text-[#1E1208]' 
                }`}
              >
                <item.icon size={18} /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bagian Bawah: Info Profil & Logout Button */}
        <div className="mt-auto border-t border-[rgba(123,45,30,0.08)] pt-6">
          {auth?.user && (
            <div className="flex items-center gap-3 px-2 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" 
                style={{ background: "#7B2D1E", color: "#FDF8F2" }}
              >
                {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate" style={{ color: "#1E1208" }}>
                  {auth.user.name}
                </p>
                <p className="text-[10px] truncate" style={{ color: "#7A6555" }}>
                  {formatRole(auth.user.role)}
                </p>
              </div>
            </div>
          )}

          <Link 
            href="/logout" 
            method="post" 
            className="flex items-center gap-3 px-4 py-3 text-[#7A6555] hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Keluar
          </Link>
        </div>
      </aside>

      {/* ========================================== */}
      {/* AREA KONTEN UTAMA */}
      {/* ========================================== */}
      {/* Pading disesuaikan: p-4 di HP, p-8 di Laptop */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
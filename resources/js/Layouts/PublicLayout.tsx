import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { MapPin, Menu, X, LogOut, ChevronDown, Globe, User } from 'lucide-react';

// 1. IMPORT KOMPONEN FOOTER DARI FOLDER COMPONENTS
import Footer from '../components/Footer'; 

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { auth, translations, locale }: any = usePage().props;
  const t = (key: string) => translations?.[key] || key;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setIsMobileLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/logout');
  };

  const navLinks = [
    { name: t('Beranda'), href: '/' },
    { name: t('Cari'), href: '/cari' },
    { name: t('Peta'), href: '/peta' },
    { name: t('Tentang Kami'), href: '/tentang-kami' },
  ];

  const languages = [
    { code: 'id', name: 'Indonesia' },
    { code: 'en', name: 'Inggris' },
    { code: 'es', name: 'Spanyol' },
    { code: 'de', name: 'Jerman' },
    { code: 'ja', name: 'Jepang' },
    { code: 'fr', name: 'Prancis' },
    { code: 'pt', name: 'Portugis' },
    { code: 'ru', name: 'Rusia' },
    { code: 'it', name: 'Italia' }
  ];

  // Fungsi Format Role agar rapi
  const formatRole = (role: string) => {
    if (role === 'warga') return t('Warga / Pengguna Publik');
    if (role === 'anggota_banjar') return t('Anggota Banjar');
    if (role === 'admin_banjar') return t('Admin Banjar');
    if (role === 'super_admin') return t('Super Admin');
    return role || t('Pengguna');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "#F5EDE0" }}>
      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}
      <nav className="sticky top-0 z-50 transition-all duration-300 shadow-sm" style={{ background: "rgba(253, 248, 242, 0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
           {/* KIRI: LOGO */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                
                {/* --- LOGO DIPERBESAR WADAHNYA --- */}
                <div 
                  className="w-28 h-28 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" 
                  style={{ 
                    background: "linear-gradient(135deg, #E6BA75 0%, #C9861A 100%)", 
                    WebkitMaskImage: "url('/logo-banjar.png')", 
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center"
                  }} 
                />
                {/* -------------------------------- */}

                {/* --- TARIK TEKS LEBIH DALAM DENGAN -ml-6 atau -ml-8 --- */}
                <span className="-ml-5 text-2xl font-bold tracking-tight uppercase" style={{ fontFamily: "'Libre Baskerville', serif", color: "#C9861A" }}>
                  BANJAR<span style={{ color: "#7B2D1E" }}>.ID</span>
                </span>
                
              </Link>
            </div>

            {/* TENGAH: MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold transition-colors hover:text-[#C9861A]"
                  style={{ color: window.location.pathname === link.href ? "#C9861A" : "#5A4A3A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* KANAN: AUTH & BAHASA (DESKTOP) */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border transition-colors hover:bg-black/5"
                  style={{ borderColor: "rgba(123,45,30,0.15)", color: "#5A4A3A" }}
                >
                  <Globe size={14} />
                  <span className="text-xs font-bold uppercase">{locale || 'ID'}</span>
                  <ChevronDown size={12} />
                </button>
                
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-lg border py-2 bg-white max-h-64 overflow-y-auto custom-scrollbar z-50" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                    {languages.map((lang) => (
                      <a key={lang.code} href={`/language/${lang.code}`} className="block px-4 py-2 text-sm text-[#5A4A3A] hover:bg-[#FAF4EC] uppercase font-semibold transition-colors">
                        {lang.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-6 w-[1.5px]" style={{ background: "rgba(123,45,30,0.1)" }}></div>

              {!auth?.user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/register" 
                    className="px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-md"
                    style={{ background: "#1E1208", color: "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {t('Daftar')}
                  </Link>
                  <Link 
                    href="/login" 
                    className="px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-md"
                    style={{ background: "#1E1208", color: "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {t('Masuk')}
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border transition-all hover:shadow-md bg-white"
                    style={{ borderColor: "rgba(123,45,30,0.15)" }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ background: "#C9861A" }}>
                      {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold truncate max-w-[100px]" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {auth.user.name}
                      </div>
                      <div className="text-[10px]" style={{ color: "#7A6555" }}>
                        {formatRole(auth.user.role)}
                      </div>
                    </div>
                    <ChevronDown size={14} style={{ color: "#7A6555" }} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-xl border overflow-hidden bg-white z-50" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                      <div className="p-4 border-b" style={{ borderColor: "rgba(123,45,30,0.05)", background: "#FAF4EC" }}>
                        <div className="font-bold text-sm truncate" style={{ color: "#1E1208" }}>{auth.user.name}</div>
                        <div className="text-xs truncate mt-0.5" style={{ color: "#7A6555" }}>{auth.user.email}</div>
                        {auth.user.role !== 'warga' && auth.user.nama_banjar && (
                          <div className="text-[11px] font-semibold mt-1.5 px-2 py-0.5 rounded-md inline-block" style={{ background: "rgba(74,103,65,0.1)", color: "#4A6741" }}>
                            Banjar: {auth.user.nama_banjar}
                          </div>
                        )}
                      </div>
                      <div className="p-2 space-y-1">
                        {/* MENU PROFIL & KEAMANAN (WARGA / PUBLIK) */}
                        <Link 
                          href="/profil-saya" 
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[#FAF4EC] text-[#1E1208]"
                        >
                          <User size={16} style={{ color: "#7B2D1E" }} /> {t('Profil & Keamanan')}
                        </Link>

                        <form onSubmit={handleLogout} className="w-full">
                          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-50 text-red-600">
                            <LogOut size={16} /> {t('Keluar')}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* KANAN: BAHASA & MOBILE MENU TOGGLE (DI LUAR UNTUK HP) */}
            <div className="md:hidden flex items-center gap-2">
              {/* TOMBOL DROPDOWN BAHASA DI LUAR */}
              <div className="relative" ref={mobileLangRef}>
                <button 
                  onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border transition-colors bg-white/70 shadow-sm"
                  style={{ borderColor: "rgba(123,45,30,0.15)", color: "#5A4A3A" }}
                >
                  <Globe size={13} />
                  <span className="text-[11px] font-bold uppercase">{locale || 'ID'}</span>
                  <ChevronDown size={11} />
                </button>
                
                {isMobileLangOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-xl border py-2 bg-white max-h-64 overflow-y-auto custom-scrollbar z-50" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                    {languages.map((lang) => (
                      <a key={lang.code} href={`/language/${lang.code}`} className="block px-4 py-2 text-xs text-[#5A4A3A] hover:bg-[#FAF4EC] uppercase font-semibold transition-colors">
                        {lang.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* TOMBOL HAMBURGER MENU */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 rounded-xl transition-colors hover:bg-black/5"
                style={{ color: "#1E1208" }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t shadow-inner bg-[#FDF8F2]" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
             <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-base font-bold transition-colors hover:bg-black/5"
                  style={{ color: window.location.pathname === link.href ? "#C9861A" : "#1E1208" }}
                >
                  {link.name}
                </Link>
              ))}

              <div className="my-4 border-t" style={{ borderColor: "rgba(123,45,30,0.1)" }}></div>
              
              {!auth?.user ? (
                <div className="flex flex-col gap-3 px-2">
                  <Link href="/login" className="w-full py-3 text-center rounded-xl font-bold border-2" style={{ borderColor: "#7B2D1E", color: "#7B2D1E" }}>
                    {t('Masuk')}
                  </Link>
                  <Link href="/register" className="w-full py-3 text-center rounded-xl font-bold shadow-md" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                    {t('Daftar Akun')}
                  </Link>
                </div>
              ) : (
                <div className="px-2 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#FAF4EC" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "#C9861A" }}>
                      {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "#1E1208" }}>{auth.user.name}</div>
                      <div className="text-[11px] font-semibold mb-0.5" style={{ color: "#C9861A" }}>
                        {formatRole(auth.user.role)}
                      </div>
                      <div className="text-xs" style={{ color: "#7A6555" }}>{auth.user.email}</div>
                      {auth.user.role !== 'warga' && auth.user.nama_banjar && (
                        <div className="text-[11px] font-semibold mt-1" style={{ color: "#4A6741" }}>
                          Banjar: {auth.user.nama_banjar}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MENU PROFIL & KEAMANAN (MOBILE) */}
                  <Link 
                    href="/profil-saya" 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[#1E1208] hover:bg-black/5"
                  >
                    <User size={18} style={{ color: "#7B2D1E" }} /> {t('Profil & Keamanan')}
                  </Link>

                  <form onSubmit={handleLogout}>
                    <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50">
                      <LogOut size={18} /> {t('Keluar Akun')}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* ========================================================= */}
      {/* 2. PANGGIL KOMPONEN FOOTER DI SINI */}
      {/* ========================================================= */}
      <Footer />
      
    </div>
  );
}
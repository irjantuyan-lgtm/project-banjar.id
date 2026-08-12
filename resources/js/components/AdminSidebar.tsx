import { Link, usePage } from '@inertiajs/react';

export default function AdminSidebar() {
    // Kita ambil url saat ini untuk menandai link mana yang aktif
    const { url } = usePage();

    // Fungsi kecil untuk mengecek apakah rute saat ini cocok dengan href link
    const isActive = (href: string) => {
        if (url === href) return true;
        if (href !== '/admin/dashboard' && url.startsWith(href)) return true;
        return false;
    };

    // Daftar link admin sesuai rute di web.php
    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/profil', label: 'Profil' },
        { href: '/admin/konten', label: 'Konten' },
        { href: '/admin/peta', label: 'Peta Admin' },
        { href: '/admin/submit', label: 'Submit Data' },
        { href: '/admin/password', label: 'Password' },
    ];

    return (
        // z-50 dan pointer-events-auto ditambahkan agar link PASTI bisa diklik
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl pointer-events-auto">
            {/* Header Sidebar */}
            <div className="p-6 pb-2">
                <h1 className="text-2xl font-bold text-blue-400 tracking-tight">Banjar Admin</h1>
                <p className="text-xs text-slate-500 mt-1">Panel Pengelola</p>
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
                {adminLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                            isActive(link.href)
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Footer Sidebar / Link Keluar */}
            <div className="p-4 border-t border-slate-800/50 mt-auto">
                <Link 
                    href="/" 
                    className="flex items-center justify-center w-full py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
                >
                    <span className="mr-2">←</span> Kembali ke Publik
                </Link>
            </div>
        </aside>
    );
}
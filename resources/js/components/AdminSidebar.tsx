import { Link, usePage } from '@inertiajs/react';

export default function AdminSidebar() {
    // Kita ambil url saat ini untuk menandai link mana yang aktif
    const { url } = usePage();

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
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
            {/* Header Sidebar */}
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-400">Banjar Admin</h1>
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {adminLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                            url === link.href 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Footer Sidebar / Link Keluar */}
            <div className="p-4 border-t border-slate-800">
                <Link 
                    href="/" 
                    className="flex items-center text-slate-400 hover:text-red-400 transition"
                >
                    <span className="mr-2">←</span> Kembali ke Publik
                </Link>
            </div>
        </aside>
    );
}
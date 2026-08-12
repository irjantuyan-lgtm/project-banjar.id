import { Link, usePage } from '@inertiajs/react';
// Pastikan path import ini sesuai dengan lokasi folder kamu menyimpannya
import LanguageSelector from '../components/LanguageSelector'; 

export default function Navbar() {
    // Tangkap data URL dan Kamus (translations) dari Laravel
    const { url, translations } = usePage().props as any;

    // Fungsi helper untuk menerjemahkan
    const t = (key: string) => translations?.[key] || key;

    return (
        <nav className="bg-white border-b border-[#E5E0DA] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo (Tidak perlu ditranslate karena nama brand) */}
                    <Link href="/" className="text-2xl font-bold text-[#C9861A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                        BANJAR.ID
                    </Link>

                    {/* Menu Navigasi */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {[
                            { name: 'Beranda', href: '/' },
                            { name: 'Cari', href: '/cari' },
                            { name: 'Peta', href: '/peta' },
                            { name: 'Tentang Kami', href: '/tentang-kami' },
                        ].map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                className={`font-medium transition-colors ${
                                    url === item.href ? 'text-[#C9861A]' : 'text-gray-600 hover:text-[#C9861A]'
                                }`}
                            >
                                {/* Panggil fungsi t() di sini */}
                                {t(item.name)}
                            </Link>
                        ))}
                        
                        <Link 
                            href="/register" 
                            className="px-6 py-2 bg-[#1E1208] text-white rounded-full hover:bg-[#2A1C12] transition-colors"
                        >
                            {t('Daftar')}
                        </Link>

                        <Link 
                            href="/login" 
                            className="px-6 py-2 bg-[#1E1208] text-white rounded-full hover:bg-[#2A1C12] transition-colors"
                        >
                            {t('Masuk')}
                        </Link>

                        {/* Komponen Tombol Ganti Bahasa */}
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </nav>
    );
}
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { url } = usePage();

    return (
        <nav className="bg-white border-b border-[#E5E0DA] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-[#C9861A]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                        BANJAR.ID
                    </Link>

                    {/* Menu Navigasi */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Cari', href: '/cari' },
                            { name: 'Peta', href: '/peta' },
                        ].map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                className={`font-medium transition-colors ${
                                    url === item.href ? 'text-[#C9861A]' : 'text-gray-600 hover:text-[#C9861A]'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        
                         <Link 
                            href="/register" 
                            className="px-6 py-2 bg-[#1E1208] text-white rounded-full hover:bg-[#2A1C12] transition-colors"
                        >
                            Daftar
                        </Link>

                        <Link 
                            href="/login" 
                            className="px-6 py-2 bg-[#1E1208] text-white rounded-full hover:bg-[#2A1C12] transition-colors"
                        >
                            Masuk
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
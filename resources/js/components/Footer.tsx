import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-[#1E1208] text-[#FDF8F2] py-12 border-t-4 border-[#C9861A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    
                    {/* Branding */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-[#C9861A] mb-4" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                            BANJAR.ID
                        </h2>
                        <p className="text-[#FDF8F2]/70 max-w-sm">
                            Platform digital untuk melestarikan dan menghubungkan komunitas adat Banjar di seluruh dunia. 
                            Menjaga tradisi dalam era modern.
                        </p>
                    </div>

                    {/* Navigasi */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#C9861A] mb-4">Navigasi</h3>
                        <ul className="space-y-2 text-[#FDF8F2]/70">
                            <li><Link href="/" className="hover:text-[#C9861A] transition">Home</Link></li>
                            <li><Link href="/cari" className="hover:text-[#C9861A] transition">Cari Komunitas</Link></li>
                            <li><Link href="/peta" className="hover:text-[#C9861A] transition">Peta Interaktif</Link></li>
                        </ul>
                    </div>

                    {/* Kontak/Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#C9861A] mb-4">Informasi</h3>
                        <ul className="space-y-2 text-[#FDF8F2]/70">
                            <li>Tentang Kami</li>
                            <li>Kebijakan Privasi</li>
                            <li>Kontak</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#3D352E] text-center text-[#FDF8F2]/50 text-sm">
                    &copy; {new Date().getFullYear()} Banjar.id. Seluruh hak cipta dilindungi.
                </div>
            </div>
        </footer>
    );
}
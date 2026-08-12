import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    // Tangkap Kamus (translations) dari Laravel
    const { translations } = usePage().props as any;

    // Fungsi helper untuk menerjemahkan
    const t = (key: string) => translations?.[key] || key;

    return (
        <footer className="bg-[#1E1208] text-[#FDF8F2] py-16 border-t-4 border-[#C9861A]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                    
                    {/* KIRI: Branding */}
                    <div>
                        <h2 className="text-2xl font-bold text-[#C9861A] mb-5" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                            BANJAR.ID
                        </h2>
                        <p className="text-[#FDF8F2]/70 text-sm leading-relaxed">
                            {t('Platform digital untuk melestarikan dan menghubungkan komunitas adat Banjar di seluruh dunia. Menjaga tradisi dalam era modern.')}
                        </p>
                    </div>

                    {/* TENGAH: Navigasi */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#C9861A] mb-5">{t('Navigasi')}</h3>
                        <ul className="space-y-3 text-sm text-[#FDF8F2]/70">
                            <li><Link href="/" className="hover:text-white transition">{t('Beranda')}</Link></li>
                            <li><Link href="/cari" className="hover:text-white transition">{t('Cari Komunitas')}</Link></li>
                            <li><Link href="/peta" className="hover:text-white transition">{t('Peta Interaktif')}</Link></li>
                        </ul>
                    </div>

                    {/* KANAN: Kontak/Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#C9861A] mb-5">{t('Informasi')}</h3>
                        <ul className="space-y-3 text-sm text-[#FDF8F2]/70">
                            {/* UBAH DARI <a> MENJADI <Link> DAN SESUAIKAN HREF-NYA */}
                            <li><Link href="/tentang-kami" className="hover:text-white transition">{t('Tentang Kami')}</Link></li>
                            <li><Link href="/kebijakan-privasi" className="hover:text-white transition">{t('Kebijakan Privasi')}</Link></li>
                            <li><Link href="/kontak" className="hover:text-white transition">{t('Kontak')}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bagian Copyright Bawah */}
                <div className="mt-16 pt-8 border-t border-[#3D352E] text-center text-[#FDF8F2]/50 text-sm">
                    &copy; {new Date().getFullYear()} Banjar.id. {t('Seluruh hak cipta dilindungi.')}
                </div>
            </div>
        </footer>
    );
}
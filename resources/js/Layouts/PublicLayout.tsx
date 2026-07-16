import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FDF8F2] text-[#1E1208]">
            {/* Navigasi */}
            <Navbar />

            {/* Konten Halaman */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
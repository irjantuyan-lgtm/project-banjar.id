import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, MapPin } from "lucide-react";

export default function KebijakanPrivasi() {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans" style={{ background: "#F5EDE0" }}>
      <Head title="Kebijakan Privasi | banjar.id" />

      <div className="w-full bg-white border-b border-[rgba(123,45,30,0.1)] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#7B2D1E" }}>
              <MapPin size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Libre Baskerville', serif", color: "#7B2D1E" }}>
              banjar<span style={{ color: "#C9861A" }}>.id</span>
            </span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A6555] hover:text-[#7B2D1E] transition-colors">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-grow">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)] space-y-6">
          <h1 className="text-3xl font-bold text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Kebijakan Privasi
          </h1>
          <div className="space-y-4 text-sm text-[#5A4A3A] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <p>
              Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana Banjar.id mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami.
            </p>
            <h2 className="text-lg font-bold text-[#1E1208] pt-2">1. Pengumpulan Data</h2>
            <p>
              Kami mengumpulkan informasi dasar saat Anda mendaftar akun atau masuk menggunakan Google, seperti nama, alamat email, serta data pengelolaan banjar yang Anda daftarkan.
            </p>
            <h2 className="text-lg font-bold text-[#1E1208] pt-2">2. Keamanan Data</h2>
            <p>
              Kami berkomitmen menjaga kerahasiaan data Anda dengan sistem enkripsi kata sandi yang aman dan tidak membagikannya kepada pihak ketiga tanpa izin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
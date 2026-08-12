import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, MapPin, Mail, Phone } from "lucide-react";

export default function Kontak() {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans" style={{ background: "#F5EDE0" }}>
      <Head title="Kontak | banjar.id" />

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
            Hubungi Kami
          </h1>
          <p className="text-sm text-[#5A4A3A] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Punya pertanyaan seputar pendaftaran banjar, kerja sama, atau kendala akun? Jangan ragu untuk menghubungi tim kami melalui saluran di bawah ini:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-[#FAF4EC] border border-[rgba(123,45,30,0.1)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#7B2D1E]/10 flex items-center justify-center text-[#7B2D1E]">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-[#7A6555] font-semibold">Email Resmi</p>
                <p className="text-sm font-bold text-[#1E1208]">support@banjar.id</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF4EC] border border-[rgba(123,45,30,0.1)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#7B2D1E]/10 flex items-center justify-center text-[#7B2D1E]">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-[#7A6555] font-semibold">Layanan WhatsApp</p>
                <p className="text-sm font-bold text-[#1E1208]">+62 812-3456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
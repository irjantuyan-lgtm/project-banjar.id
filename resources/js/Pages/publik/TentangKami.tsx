import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, MapPin, Globe2, ShieldCheck, Users, Sparkles } from "lucide-react";
// Import PublicLayout agar Navbar dan Footer publik otomatis muncul
import PublicLayout from "../../Layouts/PublicLayout";

export default function TentangKami() {
  return (
    <PublicLayout>
      <Head title="Tentang Kami | banjar.id" />

      {/* Konten Utama */}
      <div className="max-w-5xl mx-auto w-full px-4 py-16 flex-grow">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[rgba(201,134,26,0.1)] text-[#C9861A]">
            <Sparkles size={14} /> Menghubungkan Tradisi & Globalisasi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E1208] leading-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Masa Depan Komunitas Adat di Era Digital
          </h1>
          <p className="text-base text-[#5A4A3A] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Banjar.id hadir sebagai jembatan strategis yang mentransformasi nilai luhur dan manajemen kolektif banjar agar dapat diakses, dikelola, dan dikenal oleh masyarakat luas di seluruh dunia.
          </p>
        </div>

        {/* Kartu Visi Utama */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9861A]/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-bold text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Visi & Komitmen Global Kami
            </h2>
            <p className="text-sm md:text-base text-[#5A4A3A] leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Di tengah dinamika modernisasi global, banjar tetap menjadi pilar utama pelestarian budaya, solidaritas sosial, dan tata kelola masyarakat. Kami berdedikasi menyediakan infrastruktur teknologi kelas dunia yang transparan, aman, dan mudah digunakan untuk mengintegrasikan potensi lokal ke panggung global.
            </p>
          </div>
        </div>

        {/* Poin Keunggulan (Grid 3 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)] space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(123,45,30,0.08)] flex items-center justify-center text-[#7B2D1E]">
              <Globe2 size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Jangkauan Global
            </h3>
            <p className="text-xs md:text-sm text-[#5A4A3A] leading-relaxed">
              Mendukung berbagai bahasa internasional untuk memastikan eksistensi dan informasi komunitas banjar dapat dibaca dan diapresiasi oleh audiens global.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)] space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(201,134,26,0.08)] flex items-center justify-center text-[#C9861A]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Keamanan Terstandar
            </h3>
            <p className="text-xs md:text-sm text-[#5A4A3A] leading-relaxed">
              Menerapkan arsitektur keamanan data mutakhir serta pengelolaan akun dan pemulihan sandi berlapis guna melindungi privasi setiap pengguna.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[rgba(123,45,30,0.1)] space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(74,103,65,0.08)] flex items-center justify-center text-[#4A6741]">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-lg text-[#1E1208]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              Berbasis Komunitas
            </h3>
            <p className="text-xs md:text-sm text-[#5A4A3A] leading-relaxed">
              Dirancang khusus untuk mengakomodasi kebutuhan nyata administrator banjar, warga, dan UMKM lokal dalam satu ekosistem terpadu.
            </p>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
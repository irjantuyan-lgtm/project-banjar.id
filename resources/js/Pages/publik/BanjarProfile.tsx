import { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { 
  MapPin, Star, Heart, Phone, Eye, Users, 
  ShoppingBag, Calendar, ArrowLeft, MessageCircle, 
  Share2, CheckCircle, X 
} from "lucide-react";

// @ts-ignore
import PublicLayout from '../../Layouts/PublicLayout';

export default function BanjarProfile() {
  // 1. Tangkap data asli dari Laravel (tambahkan hasLiked, hasRated, dan errors)
  const { banjar = {}, rating = 0, kegiatan = [], umkm = [], hasLiked = false, errors }: any = usePage().props;

  // 2. State untuk UI (Gunakan hasLiked dari server sebagai nilai awal)
  const [liked, setLiked] = useState(hasLiked);
  const [activeTab, setActiveTab] = useState<"profil" | "kegiatan" | "umkm">("profil");
  
  // State untuk Modal Rating Bintang
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  const tabs = [
    { id: "profil" as const, label: "Profil" },
    { id: "kegiatan" as const, label: `Kegiatan (${kegiatan.length})` },
    { id: "umkm" as const, label: `UMKM (${umkm.length})` },
  ];

  // 3. FUNGSI LIKE (Bisa Suka dan Batal Suka)
  const handleLike = () => {
    setLiked(!liked); // Ubah warna hati secara instan
    // Kirim data ke database tanpa merefresh halaman
    router.post(`/banjar/${banjar.id_banjar}/like`, {}, { preserveScroll: true });
  };

  // 4. FUNGSI SUBMIT RATING BINTANG
  const submitRating = () => {
    if (selectedStar === 0) {
      alert("Silakan pilih bintang terlebih dahulu!");
      return;
    }

    router.post(`/banjar/${banjar.id_banjar}/rating`, {
      bintang: selectedStar
    }, {
      preserveScroll: true,
      onError: (err) => {
        // Jika ditolak oleh Laravel (karena sudah pernah rating di sesi ini)
        if (err.rating) {
          alert(err.rating);
          setIsRatingModalOpen(false);
        }
      },
      onSuccess: () => {
        setIsRatingModalOpen(false);
        alert("Terima kasih atas penilaian Anda!");
      }
    });
  };

  // Tentukan gambar sampul asli (jika tidak ada, gunakan default)
  const coverImage = banjar.foto_url
    ? banjar.foto_url
    : '/images/default-banjar.jpg';

  return (
    <PublicLayout>
      <div className="pt-16 min-h-screen pb-20" style={{ background: "#F5EDE0" }}>
        <Head title={`Profil | ${banjar.nama_banjar || 'Banjar'}`} />

        {/* Hero */}
        <div className="relative h-72 overflow-hidden" style={{ background: "#E8DACC" }}>
          <img src={coverImage} alt={banjar.nama_banjar} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,8,2,0.7) 0%, transparent 60%)" }} />
          
          <Link href="/" className="absolute top-4 left-6 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white" style={{ background: "rgba(250,244,236,0.9)", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <ArrowLeft size={14} /> Kembali
          </Link>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
                {banjar.nama_banjar}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={12} className="text-white/70" />
                <span className="text-sm text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {banjar.kecamatan || 'Kecamatan'}, {banjar.kota || 'Kota'}, {banjar.provinsi || 'Indonesia'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* TOMBOL LOVE DENGAN ANGKA TOTAL */}
              <button onClick={handleLike} className="h-10 px-4 rounded-full flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg" style={{ background: "rgba(250,244,236,0.9)" }}>
                <Heart size={16} fill={liked ? "#7B2D1E" : "transparent"} style={{ color: liked ? "#7B2D1E" : "#5A4A3A" }} />
                <span className="text-sm font-bold" style={{ color: "#1E1208" }}>
                  {banjar.total_likes || 0}
                </span>
              </button>
              
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg" style={{ background: "rgba(250,244,236,0.9)" }}>
                <Share2 size={16} style={{ color: "#5A4A3A" }} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
          
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { val: banjar.jumlah_kk || 0, lbl: "Kepala Keluarga", icon: Users, color: "#7B2D1E" },
              { val: umkm.length, lbl: "UMKM", icon: ShoppingBag, color: "#C9861A" },
              { val: banjar.total_views?.toLocaleString('id-ID') || 0, lbl: "Views", icon: Eye, color: "#4A6741" },
              { val: rating, lbl: "Rating", icon: Star, color: "#C9861A" },
            ].map((s, idx) => (
              <div key={idx} className="text-center p-4 rounded-2xl shadow-md flex flex-col justify-center items-center" style={{ background: "#FAF4EC" }}>
                <s.icon size={16} className="mb-1" style={{ color: s.color }} />
                <div className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color }}>{s.val}</div>
                <div className="text-[10px]" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.lbl}</div>
                
                {s.lbl === "Rating" && (
                  <button 
                    onClick={() => setIsRatingModalOpen(true)}
                    className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm hover:opacity-80 transition-opacity"
                    style={{ borderColor: "#C9861A", color: "#C9861A" }}
                  >
                    Beri Nilai
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-2xl mb-6 shadow-sm" style={{ background: "#FAF4EC" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: activeTab === tab.id ? "#7B2D1E" : "transparent",
                      color: activeTab === tab.id ? "#FDF8F2" : "#7A6555",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "profil" && (
                <div className="rounded-2xl p-6 shadow-sm border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.05)" }}>
                  <h2 className="font-bold text-lg mb-3" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Tentang Banjar</h2>
                  <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {banjar.deskripsi || "Admin banjar belum menambahkan deskripsi untuk komunitas ini."}
                  </p>
                  
                  <div className="space-y-2 text-sm mt-6 pt-4 border-t" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", borderColor: "rgba(123,45,30,0.1)" }}>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: "#C9861A" }} />
                      <span style={{ color: "#3A2E24" }}>{banjar.kota}, {banjar.provinsi}</span>
                    </div>
                    {banjar.no_wa_pengelola && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} style={{ color: "#C9861A" }} />
                        <span style={{ color: "#3A2E24" }}>+{banjar.no_wa_pengelola}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* TAB KEGIATAN */}
              {/* ========================================== */}
              {activeTab === "kegiatan" && (
                <div className="space-y-3">
                  {kegiatan.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl shadow-sm border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.05)" }}>
                      <Calendar size={28} className="mx-auto mb-2" style={{ color: "#C9B8A8" }} />
                      <p className="text-sm" style={{ color: "#7A6555" }}>Belum ada kegiatan</p>
                    </div>
                  ) : kegiatan.map((k: any) => {
                    
                    // Ambil no wa panitia (jika tidak ada, fallback ke no wa admin banjar)
                    const kontakKegiatan = k.no_wa_panitia || k.no_wa || banjar.no_wa_pengelola;
                    
                    // Format dari 08... menjadi 628...
                    const formatWAKegiatan = kontakKegiatan 
                      ? (kontakKegiatan.startsWith('0') ? '62' + kontakKegiatan.substring(1) : kontakKegiatan) 
                      : '';

                    return (
                      <div key={k.id_kegiatan ?? k.id} className="p-4 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.nama_kegiatan}</h3>
                            <div className="flex items-center gap-3 text-xs" style={{ color: "#7A6555" }}>
                              <span className="flex items-center gap-1"><Calendar size={10} />{new Date(k.tanggal_kegiatan).toLocaleDateString('id-ID')}</span>
                            </div>
                            <p className="text-xs mt-2" style={{ color: "#3A2E24" }}>{k.deskripsi}</p>
                          </div>
                          
                          {/* Tombol Info WA Kegiatan */}
                          {formatWAKegiatan && (
                            <a 
                              href={`https://wa.me/${formatWAKegiatan}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity flex-shrink-0 mt-1" 
                              style={{ background: "#25D366", color: "#fff" }}
                            >
                              <Phone size={11} /> Info
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB UMKM */}
              {/* ========================================== */}
              {activeTab === "umkm" && (
                <div className="grid gap-3">
                  {umkm.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl shadow-sm border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.05)" }}>
                      <ShoppingBag size={28} className="mx-auto mb-2" style={{ color: "#C9B8A8" }} />
                      <p className="text-sm" style={{ color: "#7A6555" }}>Belum ada UMKM yang terdaftar</p>
                    </div>
                  ) : umkm.map((u: any) => {
                    // Format angka 0 di awal menjadi 62 agar link WA berfungsi
                    const formatWAUMKM = u.no_wa_penjual 
                      ? (u.no_wa_penjual.startsWith('0') ? '62' + u.no_wa_penjual.substring(1) : u.no_wa_penjual) 
                      : '';

                    return (
                      <div key={u.id_umkm ?? u.id} className="flex items-center gap-4 p-4 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,134,26,0.1)" }}>
                          {u.foto_url ? (
                             <img src={u.foto_url} alt="UMKM" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                             <ShoppingBag size={16} style={{ color: "#C9861A" }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.nama_usaha}</div>
                          <div className="text-xs mt-0.5" style={{ color: "#7A6555" }}>{u.deskripsi_produk}</div>
                          {u.harga && (
                            <div className="text-xs font-bold mt-1" style={{ color: "#4A6741" }}>Rp {u.harga.toLocaleString('id-ID')}</div>
                          )}
                        </div>
                        
                        {/* Tombol Pesan WA UMKM */}
                        {formatWAUMKM && (
                          <a 
                            href={`https://wa.me/${formatWAUMKM}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" 
                            style={{ background: "#25D366", color: "#fff" }}
                          >
                            <Phone size={11} /> Pesan
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar: Contact card & Map */}
            <div className="space-y-4">
              <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.1)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={14} style={{ color: "#4A6741" }} />
                  <span className="text-xs font-medium" style={{ color: "#4A6741", fontFamily: "'JetBrains Mono', monospace" }}>
                    {banjar.status_akun === "aktif" ? "Terverifikasi" : "Menunggu Verifikasi"}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-sm" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                    {banjar.nama_banjar ? banjar.nama_banjar.charAt(0) : "B"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "#1E1208" }}>Pengelola Banjar</div>
                    <div className="text-[10px]" style={{ color: "#7A6555" }}>Admin Sistem</div>
                  </div>
                </div>

                {banjar.no_wa_pengelola && (
                  <a
                    href={`https://wa.me/${banjar.no_wa_pengelola.startsWith('0') ? '62' + banjar.no_wa_pengelola.substring(1) : banjar.no_wa_pengelola}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                    style={{ background: "#25D366", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <Phone size={14} /> Hubungi via WhatsApp
                  </a>
                )}
              </div>

              {/* Map mini */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: 160, background: "#E8DACC" }}>
                <img src={banjar.foto_url || '/images/default-banjar.jpg'} alt="Lokasi" className="w-full h-full object-cover opacity-70" />
                <div className="relative -mt-8 flex justify-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ background: "#7B2D1E" }}>
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </div>

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `Banjar ${banjar.nama_banjar}, ${banjar.kota || ''}, ${banjar.provinsi || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" 
                style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Cek Lokasi di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL BERI RATING (BINTANG) */}
      {/* ============================================================== */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.15)" }}>
            
            <button onClick={() => setIsRatingModalOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} style={{ color: "#7A6555" }} />
            </button>

            <h3 className="text-xl font-bold mb-1 text-center mt-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
              Nilai Banjar Ini
            </h3>
            <p className="text-sm text-center mb-6" style={{ color: "#7A6555" }}>
              Seberapa bagus pengalaman Anda berkomunitas di banjar ini?
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedStar(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    fill={(hoveredStar || selectedStar) >= star ? "#C9861A" : "transparent"} 
                    stroke={(hoveredStar || selectedStar) >= star ? "#C9861A" : "#D1C5B4"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <button 
              onClick={submitRating}
              className="w-full py-3.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
              style={{ background: "#C9861A", color: "#1E1208" }}
            >
              Kirim Penilaian
            </button>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
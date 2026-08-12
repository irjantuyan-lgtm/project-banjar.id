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
  const { auth, banjar = {}, rating = 0, kegiatan = [], umkm = [], daftar_rating = [], hasLiked = false, hasRated = false, errors, translations }: any = usePage().props;

  const t = (key: string) => translations?.[key] || key;

  const [liked, setLiked] = useState(hasLiked);
  const [activeTab, setActiveTab] = useState<"profil" | "kegiatan" | "umkm">("profil");
  
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [komentar, setKomentar] = useState("");

  const tabs = [
    { id: "profil" as const, label: t("Profil") },
    { id: "kegiatan" as const, label: `${t("Kegiatan")} (${kegiatan.length})` },
    { id: "umkm" as const, label: `${t("UMKM")} (${umkm.length})` },
  ];

  const handleLike = () => {
    if (!auth?.user) {
        alert(t("Silakan masuk atau daftar terlebih dahulu untuk menyukai Banjar ini."));
        router.visit('/login');
        return;
    }
    
    setLiked(!liked); 
    router.post(`/banjar/${banjar.id_banjar || banjar.id}/like`, {}, { preserveScroll: true });
  };

  const handleOpenRating = () => {
    if (!auth?.user) {
        alert(t("Silakan masuk atau daftar terlebih dahulu untuk memberikan penilaian."));
        router.visit('/login');
        return;
    }
    setIsRatingModalOpen(true);
  };

  const submitRating = () => {
    if (selectedStar === 0) {
      alert(t("Silakan pilih bintang terlebih dahulu!"));
      return;
    }

    router.post(`/banjar/${banjar.id_banjar || banjar.id}/rating`, {
      bintang: selectedStar,
      komentar: komentar
    }, {
      preserveScroll: true,
      onError: (err) => {
        if (err.rating) {
          alert(err.rating);
          setIsRatingModalOpen(false);
        }
      },
      onSuccess: () => {
        setIsRatingModalOpen(false);
        setKomentar("");
        alert(t("Terima kasih atas penilaian Anda!"));
      }
    });
  };

  const coverImage = banjar.foto_url
    ? banjar.foto_url
    : '/images/default-banjar.jpg';

  return (
    <PublicLayout>
      
      {/* CSS KHUSUS UNTUK REACT QUILL (Mencegah Tailwind menghapus gaya list & heading) */}
      <style>{`
        .quill-content ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .quill-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .quill-content strong, .quill-content b { font-weight: 700; }
        .quill-content em, .quill-content i { font-style: italic; }
        .quill-content u { text-decoration: underline; }
        .quill-content a { color: #0000EE; text-decoration: underline; }
        .quill-content h1 { font-size: 1.5em; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
        .quill-content h2 { font-size: 1.25em; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
        .quill-content h3 { font-size: 1.125em; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
      `}</style>

      <div className="pt-16 min-h-screen pb-20" style={{ background: "#F5EDE0" }}>
        <Head title={`${t("Profil")} | ${banjar.nama_banjar || 'Banjar'}`} />

        {/* Hero */}
        <div className="relative h-72 overflow-hidden" style={{ background: "#E8DACC" }}>
          <img src={coverImage} alt={banjar.nama_banjar} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,8,2,0.7) 0%, transparent 60%)" }} />
          
          <Link href="/" className="absolute top-4 left-6 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white" style={{ background: "rgba(250,244,236,0.9)", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <ArrowLeft size={14} /> {t("Kembali")}
          </Link>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
                {banjar.nama_banjar}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={12} className="text-white/70" />
                <span className="text-sm text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {banjar.kecamatan || t('Kecamatan')}, {banjar.kota || t('Kota')}, {banjar.provinsi || 'Indonesia'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
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
              { val: banjar.jumlah_kk || 0, lbl: t("Kepala Keluarga"), icon: Users, color: "#7B2D1E" },
              { val: umkm.length, lbl: t("UMKM"), icon: ShoppingBag, color: "#C9861A" },
              { val: banjar.total_views?.toLocaleString('id-ID') || 0, lbl: t("Views"), icon: Eye, color: "#4A6741" },
              { val: rating, lbl: t("Rating"), icon: Star, color: "#C9861A" },
            ].map((s, idx) => (
              <div key={idx} className="text-center p-4 rounded-2xl shadow-md flex flex-col justify-center items-center" style={{ background: "#FAF4EC" }}>
                <s.icon size={16} className="mb-1" style={{ color: s.color }} />
                <div className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color }}>{s.val}</div>
                <div className="text-[10px]" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.lbl}</div>
                
                {s.lbl === t("Rating") && (
                  !hasRated ? (
                    <button 
                      onClick={handleOpenRating}
                      className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm hover:opacity-80 transition-opacity"
                      style={{ borderColor: "#C9861A", color: "#C9861A" }}
                    >
                      {t("Beri Nilai")}
                    </button>
                  ) : (
                    <div 
                      className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm"
                      style={{ background: "rgba(74, 103, 65, 0.1)", color: "#4A6741" }}
                    >
                      ✓ {t("Sudah Dinilai")}
                    </div>
                  )
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

              {/* ========================================== */}
              {/* TAB PROFIL (DIPERBARUI DENGAN QUILL RENDER) */}
              {/* ========================================== */}
              {activeTab === "profil" && (
                <div className="rounded-2xl p-6 shadow-sm border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.05)" }}>
                  <h2 className="font-bold text-lg mb-3" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>{t("Tentang Banjar")}</h2>
                  
                  {/* KONVERSI DARI REACT QUILL KE HTML */}
                  {banjar.deskripsi ? (
                    <div 
                      className="quill-content text-sm leading-relaxed mb-4 max-w-none" 
                      style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      dangerouslySetInnerHTML={{ __html: banjar.deskripsi }}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#7A6555", fontStyle: "italic", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("Admin banjar belum menambahkan deskripsi untuk komunitas ini.")}
                    </p>
                  )}
                  
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

                  {/* BAGIAN ULASAN / KOMENTAR */}
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-lg" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>{t("Ulasan Warga")}</h2>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: "rgba(201,134,26,0.1)", color: "#C9861A" }}>
                        <Star size={12} className="inline mr-1" fill="#C9861A" /> {rating} ({daftar_rating.length})
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {daftar_rating.length === 0 ? (
                        <div className="text-center py-6">
                          <MessageCircle size={24} className="mx-auto mb-2 opacity-30" style={{ color: "#7A6555" }} />
                          <p className="text-xs italic" style={{ color: "#7A6555" }}>{t("Belum ada ulasan. Jadilah yang pertama memberikan penilaian!")}</p>
                        </div>
                      ) : (
                        daftar_rating.map((r: any, index: number) => (
                          <div key={index} className="bg-white p-4 rounded-xl border shadow-sm" style={{ borderColor: "rgba(123,45,30,0.05)" }}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ background: "#7B2D1E" }}>
                                  {r.nama.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.nama}</div>
                                  <div className="text-[10px]" style={{ color: "#7A6555" }}>{r.tanggal}</div>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < r.bintang ? "#C9861A" : "transparent"} stroke={i < r.bintang ? "#C9861A" : "#D1C5B4"} />
                                ))}
                              </div>
                            </div>
                            {r.komentar && (
                              <p className="text-xs mt-2 leading-relaxed" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                "{r.komentar}"
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
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
                      <p className="text-sm" style={{ color: "#7A6555" }}>{t("Belum ada kegiatan")}</p>
                    </div>
                  ) : kegiatan.map((k: any) => {
                    
                    const kontakKegiatan = k.no_wa_panitia || k.no_wa || banjar.no_wa_pengelola;
                    const formatWAKegiatan = kontakKegiatan 
                      ? (kontakKegiatan.startsWith('0') ? '62' + kontakKegiatan.substring(1) : kontakKegiatan) 
                      : '';

                    return (
                      <div key={k.id_kegiatan ?? k.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                        
                        <div className="w-full sm:w-28 h-32 sm:h-28 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {k.foto_url ? (
                            <img src={k.foto_url} alt={k.nama_kegiatan} className="w-full h-full object-cover" />
                          ) : (
                            <Calendar size={24} style={{ color: "#C9861A", opacity: 0.5 }} />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col">
                         <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-semibold text-sm" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {k.nama_kegiatan}
                            </h3>
                            {/* Logika penentu status kegiatan otomatis */}
                            {new Date(k.tanggal_kegiatan) < new Date() ? (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold" style={{ background: "rgba(122,101,85,0.1)", color: "#7A6555" }}>
                                Selesai
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold" style={{ background: "rgba(74,103,65,0.1)", color: "#4A6741" }}>
                                Akan Datang
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs mb-2" style={{ color: "#7A6555" }}>
                            <span className="flex items-center gap-1"><Calendar size={12} />{new Date(k.tanggal_kegiatan).toLocaleDateString('id-ID')}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} className="flex-shrink-0"/> <span className="truncate max-w-[150px]">{k.lokasi}</span></span>
                          </div>
                          
                          <p className="text-xs mb-3 flex-1 line-clamp-2" style={{ color: "#3A2E24" }}>{k.deskripsi}</p>
                          
                          <div className="mt-auto">
                            {formatWAKegiatan && (
                              <a 
                                href={`https://wa.me/${formatWAKegiatan}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" 
                                style={{ background: "#25D366", color: "#fff" }}
                              >
                                <Phone size={11} /> {t("Info Panitia")}
                              </a>
                            )}
                          </div>
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
                      <p className="text-sm" style={{ color: "#7A6555" }}>{t("Belum ada UMKM yang terdaftar")}</p>
                    </div>
                  ) : umkm.map((u: any) => {
                    const formatWAUMKM = u.no_wa_penjual 
                      ? (u.no_wa_penjual.startsWith('0') ? '62' + u.no_wa_penjual.substring(1) : u.no_wa_penjual) 
                      : '';

                    return (
                      <div key={u.id_umkm ?? u.id} className="flex items-start gap-4 p-4 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: "rgba(201,134,26,0.1)" }}>
                          {u.foto_url ? (
                             <img src={u.foto_url} alt="UMKM" className="w-full h-full object-cover" />
                          ) : (
                             <ShoppingBag size={20} style={{ color: "#C9861A" }} />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-h-[5rem]">
                          <div>
                            <div className="font-semibold text-sm mb-1" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.nama_usaha}</div>
                            <div className="text-xs mb-1.5" style={{ color: "#7A6555" }}>{u.deskripsi_produk}</div>
                            <div className="text-xs flex items-center gap-1 mb-2" style={{ color: "#7A6555" }}>
                               <MapPin size={10} className="flex-shrink-0"/> <span className="truncate max-w-[200px]">{u.lokasi}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            {u.harga && (
                              <div className="text-xs font-bold" style={{ color: "#4A6741" }}>Rp {u.harga.toLocaleString('id-ID')}</div>
                            )}
                            {formatWAUMKM && (
                              <a 
                                href={`https://wa.me/${formatWAUMKM}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity" 
                                style={{ background: "#25D366", color: "#fff" }}
                              >
                                <Phone size={10} /> {t("Pesan")}
                              </a>
                            )}
                          </div>
                        </div>
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
                    {banjar.status_akun === "aktif" ? t("Terverifikasi") : t("Menunggu Verifikasi")}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-sm" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                    {banjar.nama_banjar ? banjar.nama_banjar.charAt(0) : "B"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "#1E1208" }}>{t("Pengelola Banjar")}</div>
                    <div className="text-[10px]" style={{ color: "#7A6555" }}>{t("Admin Sistem")}</div>
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
                    <Phone size={14} /> {t("Hubungi via WhatsApp")}
                  </a>
                )}
              </div>

              {/* Peta Terintegrasi Google Maps */}
              {banjar.latitude && banjar.longitude ? (
                <>
                  <div className="rounded-2xl overflow-hidden shadow-sm border relative" style={{ height: 160, borderColor: "rgba(123,45,30,0.2)" }}>
                    {/* Menampilkan peta Google Maps mini interaktif */}
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      aria-hidden="false"
                      tabIndex={0}
                      src={`https://maps.google.com/maps?q=${banjar.latitude},${banjar.longitude}&z=15&output=embed`}
                    ></iframe>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${banjar.latitude},${banjar.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" 
                    style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {t("Buka di Google Maps")}
                  </a>
                </>
              ) : (
                <>
                  {/* Jika belum ada kordinat, tampilkan gambar default seperti sebelumnya */}
                  <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: 160, background: "#E8DACC" }}>
                    <img src={banjar.foto_url || '/images/default-banjar.jpg'} alt="Lokasi Belum Diatur" className="w-full h-full object-cover opacity-70 grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold bg-white/80 px-2 py-1 rounded" style={{ color: "#7B2D1E" }}>Lokasi Peta Belum Diatur</span>
                    </div>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Banjar ${banjar.nama_banjar}, ${banjar.kota || ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" 
                    style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {t("Cari Lokasi Secara Manual")}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL BERI RATING & KOMENTAR */}
      {/* ============================================================== */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.15)" }}>
            
            <button onClick={() => setIsRatingModalOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} style={{ color: "#7A6555" }} />
            </button>

            <h3 className="text-xl font-bold mb-1 text-center mt-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
              {t("Nilai Banjar Ini")}
            </h3>
            <p className="text-sm text-center mb-6" style={{ color: "#7A6555" }}>
              {t("Seberapa bagus pengalaman Anda berkomunitas di sini?")}
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedStar(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
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

            <div className="mb-6">
              <label className="block text-xs font-bold mb-2" style={{ color: "#3A2E24" }}>
                {t("Ulasan Tambahan (Opsional)")}
              </label>
              <textarea
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                placeholder={t("Tuliskan pengalaman Anda di Banjar ini...")}
                rows={3}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none border focus:bg-white transition-colors"
                style={{ background: "#EFE6D8", borderColor: "rgba(123,45,30,0.15)", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              ></textarea>
            </div>

            <button 
              onClick={submitRating}
              className="w-full py-3.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
              style={{ background: "#C9861A", color: "#1E1208" }}
            >
              {t("Kirim Penilaian")}
            </button>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
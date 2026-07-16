import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { MapPin, Star, Heart, Phone, Eye, Users, ShoppingBag, Calendar, ArrowLeft, MessageCircle, Share2, CheckCircle } from "lucide-react";

// WAJIB IMPORT: Agar header navigasi atas web Anda tidak hilang
import PublicLayout from '../../Layouts/PublicLayout';

export default function BanjarProfile() {
  const { banjarData }: any = usePage().props;

  // 1. UPDATE DATA FALLBACK KE STANDAR GLOBAL
  const banjar = banjarData || {
    name: "Banjar Adat Kaja",
    kecamatan: "Denpasar Utara",
    kota: "Denpasar",
    provinsi: "Bali",
    negara: "Indonesia",
    lat: -8.6500,
    lng: 115.2190,
    img: "photo-1537953773345-d172ccf13cf1",
    members: 150,
    umkm: 12,
    views: 1250,
    rating: 4.8,
    deskripsi: "Banjar Adat Kaja merupakan salah satu banjar yang aktif dalam pelestarian budaya dan pengembangan UMKM. Kami terbuka untuk kolaborasi digital.",
    tags: ["Budaya", "Sosial", "UMKM", "Digital"],
    phone: "6281234567890",
    email: "kontak@banjarkaja.id",
    status: "active",
    adminName: "Wayan Sudarma",
    kegiatan: [
      { id: 1, title: "Gotong Royong", tanggal: "12 Juli 2026", type: "Sosial", status: "published" }
    ],
    umkm_list: [
      { id: 1, name: "Warung Sate Bu Ayu", kategori: "Kuliner", phone: "628111222333" }
    ]
  };

  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"profil" | "kegiatan" | "umkm">("profil");

  const tabs = [
    { id: "profil" as const, label: "Profil" },
    { id: "kegiatan" as const, label: `Kegiatan (${banjar.kegiatan?.length || 0})` },
    { id: "umkm" as const, label: `UMKM (${banjar.umkm_list?.length || 0})` },
  ];

  return (
    <PublicLayout>
      <div className="pt-16 min-h-screen pb-20" style={{ background: "#F5EDE0" }}>
        <Head title={`Profil | ${banjar.name}`} />

        {/* Hero */}
        <div className="relative h-72 overflow-hidden" style={{ background: "#E8DACC" }}>
          <img src={`https://images.unsplash.com/${banjar.img}?w=1200&h=500&fit=crop&auto=format`} alt={banjar.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,8,2,0.7) 0%, transparent 60%)" }} />
          
          <Link href="/cari" className="absolute top-4 left-6 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white" style={{ background: "rgba(250,244,236,0.9)", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <ArrowLeft size={14} /> Kembali
          </Link>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>{banjar.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={12} className="text-white/70" />
                <span className="text-sm text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {/* Menampilkan format global: Kecamatan, Kota, Negara */}
                  {banjar.kecamatan}, {banjar.kota}, {banjar.negara}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ background: "rgba(250,244,236,0.9)" }}>
                <Heart size={16} fill={liked ? "#7B2D1E" : "transparent"} style={{ color: liked ? "#7B2D1E" : "#5A4A3A" }} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ background: "rgba(250,244,236,0.9)" }}>
                <Share2 size={16} style={{ color: "#5A4A3A" }} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { val: banjar.members, lbl: "Kepala Keluarga", icon: Users, color: "#7B2D1E" },
              { val: banjar.umkm, lbl: "UMKM", icon: ShoppingBag, color: "#C9861A" },
              { val: banjar.views?.toLocaleString(), lbl: "Views", icon: Eye, color: "#4A6741" },
              { val: banjar.rating, lbl: "Rating", icon: Star, color: "#C9861A" },
            ].map((s) => (
              <div key={s.lbl} className="text-center p-4 rounded-2xl shadow-md" style={{ background: "#FAF4EC" }}>
                <s.icon size={16} className="mx-auto mb-1" style={{ color: s.color }} />
                <div className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color }}>{s.val}</div>
                <div className="text-[10px]" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
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
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{banjar.deskripsi}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {banjar.tags?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(123,45,30,0.08)", color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tag}</span>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: "#C9861A" }} />
                      <span style={{ color: "#3A2E24" }}>{banjar.kecamatan}, {banjar.kota}, {banjar.provinsi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} style={{ color: "#C9861A" }} />
                      <span style={{ color: "#3A2E24" }}>+{banjar.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={14} style={{ color: "#C9861A" }} />
                      <span style={{ color: "#3A2E24" }}>{banjar.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "kegiatan" && (
                <div className="space-y-3">
                  {(!banjar.kegiatan || banjar.kegiatan.length === 0) ? (
                    <div className="text-center py-12 rounded-2xl shadow-sm border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.05)" }}>
                      <Calendar size={28} className="mx-auto mb-2" style={{ color: "#C9B8A8" }} />
                      <p className="text-sm" style={{ color: "#7A6555" }}>Belum ada kegiatan</p>
                    </div>
                  ) : banjar.kegiatan.map((k: any) => (
                    <div key={k.id} className="p-4 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm mb-1" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.title}</h3>
                          <div className="flex items-center gap-3 text-xs" style={{ color: "#7A6555" }}>
                            <span className="flex items-center gap-1"><Calendar size={10} />{k.tanggal}</span>
                            <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(123,45,30,0.08)", color: "#7B2D1E" }}>{k.type}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: k.status === "published" ? "rgba(74,103,65,0.1)" : "rgba(201,134,26,0.1)", color: k.status === "published" ? "#4A6741" : "#C9861A" }}>
                          {k.status === "published" ? "Aktif" : "Draft"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "umkm" && (
                <div className="grid gap-3">
                  {(!banjar.umkm_list || banjar.umkm_list.length === 0) ? (
                    <div className="text-center py-12 rounded-2xl shadow-sm border" style={{ background: "#FAF4EC", borderColor: "rgba(123,45,30,0.05)" }}>
                      <ShoppingBag size={28} className="mx-auto mb-2" style={{ color: "#C9B8A8" }} />
                      <p className="text-sm" style={{ color: "#7A6555" }}>Belum ada UMKM yang terdaftar</p>
                    </div>
                  ) : banjar.umkm_list.map((u: any) => (
                    <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl shadow-sm transition-all hover:shadow-md" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,134,26,0.1)" }}>
                        <ShoppingBag size={16} style={{ color: "#C9861A" }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{u.name}</div>
                        <div className="text-xs" style={{ color: "#7A6555" }}>{u.kategori}</div>
                      </div>
                      <a href={`https://wa.me/${u.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: "#25D366", color: "#fff" }}>
                        <Phone size={11} /> WA
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Contact card & Map */}
            <div className="space-y-4">
              <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.1)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={14} style={{ color: "#4A6741" }} />
                  <span className="text-xs font-medium" style={{ color: "#4A6741", fontFamily: "'JetBrains Mono', monospace" }}>
                    {banjar.status === "active" ? "Terverifikasi" : "Menunggu Verifikasi"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-sm" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                    {banjar.adminName ? banjar.adminName.split(" ").slice(-1)[0][0] : "A"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "#1E1208" }}>{banjar.adminName}</div>
                    <div className="text-[10px]" style={{ color: "#7A6555" }}>Admin Banjar</div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${banjar.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  style={{ background: "#25D366", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Phone size={14} /> Hubungi via WhatsApp
                </a>
              </div>

              {/* Map mini */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: 160, background: "#E8DACC" }}>
                <img src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop&auto=format" alt="Lokasi" className="w-full h-full object-cover opacity-70" />
                <div className="relative -mt-8 flex justify-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ background: "#7B2D1E" }}>
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* URL Cerdas: Melempar langsung ke kota banjar ini di peta global */}
              <Link href={`/peta?kota=${banjar.kota}`} className="block text-center py-2.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Lihat di Peta Global
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
import { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Phone,
  SlidersHorizontal,
  X,
} from "lucide-react";

// Daftar Filter Cepat (Bisa disesuaikan nanti)
const FILTER_CEPAT = [
  "Semua"
];

export default function Cari() {
  // 1. INERTIA: Mengambil props data banjar dan URL saat ini dari Laravel
  const { banjarsData }: any = usePage().props;
  const urlString = usePage().url; 

  // 2. TANGKAP PARAMETER DARI BERANDA (Home.tsx)
  const urlParams = new URLSearchParams(urlString.split("?")[1] || "");
  const paramNegara = urlParams.get("negara") || "";
  const paramProvinsi = urlParams.get("provinsi") || "";
  const paramKota = urlParams.get("kota") || "";
  const paramQ = urlParams.get("q") || "";

  // 3. FALLBACK DATA: Pastikan data memiliki kolom negara, provinsi, dan kota
  const BANJAR_LIST = banjarsData || [
    {
      id: "1", name: "Banjar Adat Kaja", kecamatan: "Denpasar Utara", kota: "Denpasar", provinsi: "Bali", negara: "Indonesia",
      img: "photo-1537953773345-d172ccf13cf1", members: 150, umkm: 12, views: 1250, rating: 4.8,
      phone: "6281234567890", status: "published"
    },
    {
      id: "2", name: "Banjar Sydney", kecamatan: "Kensington", kota: "Sydney", provinsi: "New South Wales", negara: "Australia",
      img: "photo-1512453979436-5a536909e91f?w=500&h=300&fit=crop", members: 45, umkm: 3, views: 890, rating: 4.9,
      phone: "61400000000", status: "published"
    },
    {
      id: "3", name: "Banjar Penglipuran", kecamatan: "Bangli", kota: "Bangli", provinsi: "Bali", negara: "Indonesia",
      img: "photo-1604665515776-0c5b9e11e6f2", members: 320, umkm: 82, views: 3500, rating: 4.9, 
      phone: "6281122334455", status: "published"
    }
  ];

  // 4. STATE MANAGEMENT
  const [query, setQuery] = useState(paramQ);
  const [filterKota, setFilterKota] = useState(paramKota || "Semua");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"rating" | "views" | "members">("rating");

  // Jika URL berubah (user mencari dari beranda lagi), update state-nya
  useEffect(() => {
    if (paramKota) {
      setFilterKota(paramKota);
    }
  }, [paramKota]);

  // Fitur Like (Client-side sementara)
  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 5. LOGIKA FILTER PINTAR
  const filtered = BANJAR_LIST.filter((b: any) => {
    // Cek ketikan di kolom pencarian
    const matchQ =
      !query ||
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.kecamatan.toLowerCase().includes(query.toLowerCase()) ||
      b.kota.toLowerCase().includes(query.toLowerCase());
      
    // Cek filter Tab Kota ATAU parameter URL
    const matchKota = filterKota === "Semua" || b.kota.toLowerCase() === filterKota.toLowerCase();
    
    // Cek parameter Negara (Jika dikirim dari beranda)
    const matchNegara = !paramNegara || b.negara.toLowerCase() === paramNegara.toLowerCase();

    return matchQ && matchKota && matchNegara;
  }).sort((a: any, b: any) => (b[sortBy] as number) - (a[sortBy] as number));


  return (
    <div className="pt-20 pb-20 min-h-screen" style={{ background: "#F5EDE0" }}>
      <Head title="Cari Banjar | Direktori Banjar" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Search header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
              Cari Banjar
            </h1>
            <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Temukan banjar berdasarkan nama, kecamatan, atau kabupaten
            </p>
          </div>
          <Link href="/" className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors hover:bg-black/5" style={{ color: "#7B2D1E", border: "1px solid rgba(123,45,30,0.2)" }}>
            Ke Beranda
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.12)" }}>
            <Search size={16} style={{ color: "#7A6555" }} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // Reset URL agar pencarian manual tidak bentrok dengan URL parameter
                window.history.replaceState(null, '', window.location.pathname);
              }}
              placeholder="Nama banjar atau kecamatan..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={14} style={{ color: "#7A6555" }} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <SlidersHorizontal size={13} style={{ color: "#7A6555" }} />
            <span className="text-xs" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Filter:</span>
          </div>
          
          {/* Jika kota dari URL tidak ada di daftar FILTER_CEPAT, tambahkan otomatis */}
          {[...new Set([...FILTER_CEPAT, paramKota ? paramKota : ""])].filter(Boolean).map((k) => (
            <button
              key={k}
              onClick={() => {
                setFilterKota(k);
                setQuery("");
                window.history.replaceState(null, '', window.location.pathname);
              }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filterKota === k ? "#7B2D1E" : "#FAF4EC",
                color: filterKota === k ? "#FDF8F2" : "#3A2E24",
                border: filterKota === k ? "none" : "1px solid rgba(123,45,30,0.12)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Menampilkan <span style={{ color: "#7B2D1E", fontWeight: 600 }}>{filtered.length}</span> banjar
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs px-3 py-2 rounded-xl outline-none"
            style={{ background: "#FAF4EC", color: "#1E1208", border: "1px solid rgba(123,45,30,0.12)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <option value="rating">Urut: Rating</option>
            <option value="views">Urut: Paling Dilihat</option>
            <option value="members">Urut: Anggota</option>
          </select>
        </div>

        {/* Results grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <MapPin size={32} className="mx-auto mb-3" style={{ color: "#C9B8A8" }} />
            <p className="font-medium" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Banjar tidak ditemukan</p>
            <button 
              onClick={() => { 
                setQuery(""); 
                setFilterKota("Semua"); 
                window.history.replaceState(null, '', window.location.pathname);
              }} 
              className="mt-3 text-sm underline" style={{ color: "#7B2D1E" }}
            >
              Reset pencarian
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((banjar: any) => (
              <div key={banjar.id} className="rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                <div className="relative h-44 overflow-hidden" style={{ background: "#E8DACC" }}>
                  <img
                    src={`https://images.unsplash.com/${banjar.img}?w=500&h=300&fit=crop&auto=format`}
                    alt={banjar.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <button
                    onClick={() => toggleLike(banjar.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(250,244,236,0.9)" }}
                  >
                    <Heart size={14} fill={liked.has(banjar.id) ? "#7B2D1E" : "transparent"} style={{ color: liked.has(banjar.id) ? "#7B2D1E" : "#5A4A3A" }} />
                  </button>
                  {banjar.status === "pending" && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "#C9861A", color: "#1E1208" }}>
                      Menunggu
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>
                      {banjar.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#C9861A", fontFamily: "'JetBrains Mono', monospace" }}>
                      <Star size={9} fill="#C9861A" />
                      {banjar.rating}
                    </span>
                  </div>
                  <p className="text-xs flex items-center gap-1 mb-3" style={{ color: "#7A6555" }}>
                    <MapPin size={9} /> {banjar.kecamatan}, {banjar.kota}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {[
                      { val: banjar.members, lbl: "KK" },
                      { val: banjar.umkm, lbl: "UMKM" },
                      { val: banjar.views?.toLocaleString(), lbl: "Views" },
                    ].map((s) => (
                      <div key={s.lbl} className="text-center py-1.5 rounded-lg" style={{ background: "#F0E8DA" }}>
                        <div className="text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7B2D1E" }}>{s.val}</div>
                        <div className="text-[9px]" style={{ color: "#7A6555" }}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/banjar/${banjar.id}`}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold border text-center hover:bg-black/5 transition-colors"
                      style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E" }}
                    >
                      Liat Profil
                    </Link>
                    <a
                      href={`https://wa.me/${banjar.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                      style={{ background: "#25D366", color: "#fff" }}
                    >
                      <Phone size={10} /> WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Phone,
  SlidersHorizontal,
  X,
  ChevronDown
} from "lucide-react";

// WAJIB IMPORT: Agar header navigasi atas web Anda tidak hilang
// @ts-ignore
import PublicLayout from '../../Layouts/PublicLayout';

export default function Cari() {
  // 1. INERTIA: Mengambil props data asli dari Laravel
  const { banjarsData = [] }: any = usePage().props;
  const urlString = usePage().url; 

  // 2. TANGKAP PARAMETER DARI URL (Jika dilempar dari Beranda/Peta)
  const urlParams = new URLSearchParams(urlString.split("?")[1] || "");
  const paramNegara = urlParams.get("negara") || "Semua";
  const paramProvinsi = urlParams.get("provinsi") || "Semua";
  const paramKota = urlParams.get("kota") || "Semua";
  const paramQ = urlParams.get("q") || "";

  // 3. STATE MANAGEMENT
  const [query, setQuery] = useState(paramQ);
  const [showFilters, setShowFilters] = useState(false); // <--- State untuk buka/tutup panel filter
  
  // State untuk filter spesifik
  const [filterNegara, setFilterNegara] = useState(paramNegara);
  const [filterProvinsi, setFilterProvinsi] = useState(paramProvinsi);
  const [filterKota, setFilterKota] = useState(paramKota);
  
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"rating" | "views" | "members">("rating");

  // Jika URL berubah (user mencari dari beranda lagi), update state-nya
  useEffect(() => {
    if (paramKota && paramKota !== "Semua") setFilterKota(paramKota);
    if (paramProvinsi && paramProvinsi !== "Semua") setFilterProvinsi(paramProvinsi);
    if (paramNegara && paramNegara !== "Semua") setFilterNegara(paramNegara);
  }, [paramKota, paramProvinsi, paramNegara]);

  // 4. EKSTRAK DATA LOKASI OTOMATIS DARI DATABASE (Hanya tampilkan yang ada datanya)
  const uniqueNegara = ["Semua", ...Array.from(new Set(banjarsData.map((b: any) => b.negara))).filter(Boolean)] as string[];
  
  const uniqueProvinsi = ["Semua", ...Array.from(new Set(banjarsData
    .filter((b: any) => filterNegara === "Semua" || b.negara === filterNegara)
    .map((b: any) => b.provinsi)
  )).filter(Boolean)] as string[];
  
  const uniqueKota = ["Semua", ...Array.from(new Set(banjarsData
    .filter((b: any) => 
      (filterNegara === "Semua" || b.negara === filterNegara) &&
      (filterProvinsi === "Semua" || b.provinsi === filterProvinsi)
    )
    .map((b: any) => b.kota)
  )).filter(Boolean)] as string[];

  // 5. FUNGSI LIKE YANG TERHUBUNG KE DATABASE
  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (!next.has(id)) {
        next.add(id);
        router.post(`/banjar/${id}/like`, {}, { preserveScroll: true });
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // 6. LOGIKA FILTER PINTAR
  const filtered = banjarsData.filter((b: any) => {
    const namaBanjar = b.nama_banjar || "";
    const kec = b.kecamatan || "";
    const kota = b.kota || "";
    const prov = b.provinsi || "";
    const negara = b.negara || "";

    // Cek ketikan di kolom pencarian
    const matchQ =
      !query ||
      namaBanjar.toLowerCase().includes(query.toLowerCase()) ||
      kec.toLowerCase().includes(query.toLowerCase()) ||
      kota.toLowerCase().includes(query.toLowerCase());
      
    // Cek dropdown filter
    const matchNegara = filterNegara === "Semua" || negara.toLowerCase() === filterNegara.toLowerCase();
    const matchProvinsi = filterProvinsi === "Semua" || prov.toLowerCase() === filterProvinsi.toLowerCase();
    const matchKota = filterKota === "Semua" || kota.toLowerCase() === filterKota.toLowerCase();

    return matchQ && matchNegara && matchProvinsi && matchKota;
  }).sort((a: any, b: any) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "views") return (b.total_views || 0) - (a.total_views || 0);
    if (sortBy === "members") return (b.jumlah_kk || 0) - (a.jumlah_kk || 0);
    return 0;
  });

  // Fungsi Reset Pencarian
  const resetSearch = () => {
    setQuery("");
    setFilterNegara("Semua");
    setFilterProvinsi("Semua");
    setFilterKota("Semua");
    window.history.replaceState(null, '', window.location.pathname);
  };

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 min-h-screen" style={{ background: "#F5EDE0" }}>
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

          {/* Search bar utama */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.12)" }}>
              <Search size={16} style={{ color: "#7A6555" }} />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  window.history.replaceState(null, '', window.location.pathname);
                }}
                placeholder="Ketik nama banjar atau kecamatan..."
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

          {/* ========================================== */}
          {/* BARIS TOMBOL FILTER & CHIPS */}
          {/* ========================================== */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            
            {/* TOMBOL FILTER (Bisa Diklik & Buka Tutup Panel) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
              style={{
                background: showFilters ? "#7B2D1E" : "#FAF4EC",
                color: showFilters ? "#FDF8F2" : "#7B2D1E",
                border: "1px solid",
                borderColor: showFilters ? "#7B2D1E" : "rgba(123,45,30,0.2)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <SlidersHorizontal size={14} />
              {showFilters ? "Tutup Filter" : "Filter Lanjutan"}
            </button>

            {/* Quick Chips (Menampilkan status filter saat ini jika bukan 'Semua') */}
            {filterNegara !== "Semua" && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#FAF4EC", color: "#3A2E24", border: "1px solid rgba(123,45,30,0.12)" }}>
                {filterNegara}
              </span>
            )}
            {filterProvinsi !== "Semua" && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#FAF4EC", color: "#3A2E24", border: "1px solid rgba(123,45,30,0.12)" }}>
                {filterProvinsi}
              </span>
            )}
            {filterKota !== "Semua" && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                {filterKota}
              </span>
            )}
            
            {/* Tombol Reset (Muncul jika ada filter yang aktif) */}
            {(filterNegara !== "Semua" || filterProvinsi !== "Semua" || filterKota !== "Semua" || query !== "") && (
              <button onClick={resetSearch} className="px-3 py-1.5 text-xs font-medium underline transition-opacity hover:opacity-70" style={{ color: "#C0392B" }}>
                Reset
              </button>
            )}
          </div>

          {/* ========================================== */}
          {/* PANEL FILTER LANJUTAN (Muncul saat ditekan) */}
          {/* ========================================== */}
          {showFilters && (
            <div className="mb-8 p-5 rounded-2xl shadow-sm border" style={{ background: "rgba(250, 244, 236, 0.95)", borderColor: "rgba(123,45,30,0.15)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Dropdown Negara */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "#7A6555" }}>Negara</label>
                  <select 
                    value={filterNegara} 
                    onChange={(e) => {
                      setFilterNegara(e.target.value);
                      setFilterProvinsi("Semua"); // Auto reset bawahnya
                      setFilterKota("Semua");     // Auto reset bawahnya
                    }}
                    className="px-3 py-2.5 rounded-xl text-sm border outline-none cursor-pointer appearance-none"
                    style={{ background: "#fff", borderColor: "rgba(123,45,30,0.12)", color: "#1E1208" }}
                  >
                    {uniqueNegara.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Dropdown Provinsi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "#7A6555" }}>Provinsi</label>
                  <select 
                    value={filterProvinsi} 
                    onChange={(e) => {
                      setFilterProvinsi(e.target.value);
                      setFilterKota("Semua"); // Auto reset bawahnya
                    }}
                    className="px-3 py-2.5 rounded-xl text-sm border outline-none cursor-pointer appearance-none"
                    style={{ background: "#fff", borderColor: "rgba(123,45,30,0.12)", color: "#1E1208" }}
                    disabled={uniqueProvinsi.length <= 1}
                  >
                    {uniqueProvinsi.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Dropdown Kota */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "#7A6555" }}>Kota / Kabupaten</label>
                  <select 
                    value={filterKota} 
                    onChange={(e) => setFilterKota(e.target.value)}
                    className="px-3 py-2.5 rounded-xl text-sm border outline-none cursor-pointer appearance-none"
                    style={{ background: "#fff", borderColor: "rgba(123,45,30,0.12)", color: "#1E1208" }}
                    disabled={uniqueKota.length <= 1}
                  >
                    {uniqueKota.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

              </div>
            </div>
          )}

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
              <option value="members">Urut: Anggota (KK)</option>
            </select>
          </div>

          {/* Results grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <MapPin size={32} className="mx-auto mb-3" style={{ color: "#C9B8A8" }} />
              <p className="font-medium" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Banjar tidak ditemukan</p>
              <button 
                onClick={resetSearch} 
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
                    
                    {/* PERBAIKAN: Menggunakan banjar.foto_url dan fallback default image */}
                    <img
                      src={banjar.foto_url || '/images/default-banjar.jpg'}
                      alt={banjar.nama_banjar}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    
                    {/* Tombol Like Terhubung Database */}
                    <button
                      onClick={() => toggleLike(banjar.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(250,244,236,0.9)" }}
                    >
                      <Heart size={14} fill={liked.has(banjar.id) ? "#7B2D1E" : "transparent"} style={{ color: liked.has(banjar.id) ? "#7B2D1E" : "#5A4A3A" }} />
                    </button>

                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>
                        {banjar.nama_banjar}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#C9861A", fontFamily: "'JetBrains Mono', monospace" }}>
                        <Star size={9} fill="#C9861A" />
                        {banjar.rating}
                      </span>
                    </div>
                    <p className="text-xs flex items-center gap-1 mb-3" style={{ color: "#7A6555" }}>
                      <MapPin size={9} className="flex-shrink-0" /> <span className="truncate w-56">{banjar.kecamatan}, {banjar.kota}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      {[
                        { val: banjar.jumlah_kk, lbl: "KK" },
                        { val: banjar.umkm, lbl: "UMKM" },
                        { val: banjar.total_views?.toLocaleString('id-ID'), lbl: "Views" },
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
                        Lihat Profil
                      </Link>
                      {banjar.phone && (
                        <a
                          href={`https://wa.me/${banjar.phone.startsWith('0') ? '62' + banjar.phone.substring(1) : banjar.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                          style={{ background: "#25D366", color: "#fff" }}
                        >
                          <Phone size={10} /> WA
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
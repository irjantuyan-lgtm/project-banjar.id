import { useState, useEffect, useRef } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Phone,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";

// @ts-ignore
import PublicLayout from '../../Layouts/PublicLayout';

// =====================================================================
// KOMPONEN DROPDOWN CUSTOM (Mendukung Ketik/Pencarian & API)
// =====================================================================
const SearchableSelect = ({ label, value, onChange, options = [], placeholder, isLoading, textLoading, textSearch, textNotFound }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt: string) =>
    opt.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-1.5 relative" ref={wrapperRef}>
      <label className="text-xs font-semibold" style={{ color: "#7A6555" }}>{label}</label>
      
      <div
        className="w-full px-4 py-3 rounded-xl text-sm border flex items-center justify-between cursor-pointer transition-colors"
        style={{ background: "#fff", borderColor: "rgba(123,45,30,0.12)", color: value ? "#1E1208" : "#7A6555" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate font-medium">{isLoading ? textLoading : (value || placeholder)}</span>
        <ChevronDown size={16} style={{ color: "#7A6555", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </div>

      {isOpen && !isLoading && (
        <div className="absolute top-[105%] left-0 right-0 bg-white border rounded-xl shadow-xl z-50 overflow-hidden" style={{ borderColor: "rgba(123,45,30,0.12)" }}>
          <div className="p-2 border-b" style={{ borderColor: "rgba(123,45,30,0.08)" }}>
            <input
              type="text"
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-lg outline-none"
              style={{ background: "#FAF4EC", color: "#1E1208" }}
              placeholder={textSearch}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
          <div className="max-h-52 overflow-y-auto custom-scrollbar">
            <div
              className="px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-black/5"
              style={{ color: "#7A6555" }}
              onClick={() => { onChange(""); setIsOpen(false); setSearchText(""); }}
            >
              {placeholder}
            </div>
            {filteredOptions.map((opt: string) => (
              <div
                key={opt}
                className="px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-black/5 font-medium"
                style={{ color: "#1E1208" }}
                onClick={() => { onChange(opt); setIsOpen(false); setSearchText(""); }}
              >
                {opt}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-center" style={{ color: "#7A6555" }}>
                {textNotFound}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
// =====================================================================

export default function Cari() {
  // 1. TAMBAHKAN TRANSLATIONS DI PROPS
  const { banjarsData, filters, translations }: any = usePage().props;
  const banjars = banjarsData?.data || [];

  // 2. FUNGSI TRANSLATE
  const t = (key: string) => translations?.[key] || key;

  const [query, setQuery] = useState(filters?.search || "");
  const [showFilters, setShowFilters] = useState(false); 
  
  const [filterNegara, setFilterNegara] = useState(filters?.negara || "");
  const [filterProvinsi, setFilterProvinsi] = useState(filters?.provinsi || "");
  const [filterKota, setFilterKota] = useState(filters?.kota || "");
  
  const [negaraList, setNegaraList] = useState<string[]>([]);
  const [provinsiList, setProvinsiList] = useState<string[]>([]);
  const [kotaList, setKotaList] = useState<string[]>([]);
  
  const [loadingNegara, setLoadingNegara] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingKota, setLoadingKota] = useState(false);

  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Ref untuk mencegah pencarian error di render pertama
  const isFirstRender = useRef(true);

  // FETCH API NEGARA
  useEffect(() => {
    setLoadingNegara(true);
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setNegaraList(data.data.map((d: any) => d.name));
      })
      .finally(() => setLoadingNegara(false));
  }, []);

  // FETCH API PROVINSI
  useEffect(() => {
    if (filterNegara) {
      setLoadingProv(true);
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: filterNegara })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.data.states) {
          setProvinsiList(data.data.states.map((s: any) => s.name));
        } else {
          setProvinsiList([]);
        }
      })
      .finally(() => setLoadingProv(false));
    } else {
      setProvinsiList([]);
    }
  }, [filterNegara]);

  // FETCH API KOTA
  useEffect(() => {
    if (filterNegara && filterProvinsi) {
      setLoadingKota(true);
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: filterNegara, state: filterProvinsi })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.data) {
          setKotaList(data.data);
        } else {
          setKotaList([]);
        }
      })
      .finally(() => setLoadingKota(false));
    } else {
      setKotaList([]);
    }
  }, [filterNegara, filterProvinsi]);

  // FUNGSI PENGIRIMAN DATA YG DIPERBAIKI
  const applyFilters = (newFilters: any) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    ) as Record<string, any>;

    router.get('/cari', cleanFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  // PENCARIAN OTOMATIS SAAT MENGETIK
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      applyFilters({ search: query, negara: filterNegara, provinsi: filterProvinsi, kota: filterKota });
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNegaraChange = (val: string) => {
    setFilterNegara(val);
    setFilterProvinsi(""); 
    setFilterKota("");
    applyFilters({ search: query, negara: val, provinsi: "", kota: "" });
  };

  const handleProvinsiChange = (val: string) => {
    setFilterProvinsi(val);
    setFilterKota(""); 
    applyFilters({ search: query, negara: filterNegara, provinsi: val, kota: "" });
  };

  const handleKotaChange = (val: string) => {
    setFilterKota(val);
    applyFilters({ search: query, negara: filterNegara, provinsi: filterProvinsi, kota: val });
  };

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

  const resetSearch = () => {
    setQuery("");
    setFilterNegara("");
    setFilterProvinsi("");
    setFilterKota("");
    router.get('/cari', {}, { preserveState: true });
  };

  return (
    <PublicLayout>
      {/* BUG FIX: pt-24 diubah ke pt-[120px] agar judul tidak tertutup navbar */}
      <div className="pt-[120px] pb-20 min-h-screen" style={{ background: "#F5EDE0" }}>
        <Head title={`${t("Cari Banjar")} | ${t("Direktori Banjar")}`} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
                {t("Cari Banjar")}
              </h1>
              <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("Temukan banjar berdasarkan nama, negara, provinsi, atau kota")}
              </p>
            </div>
            <Link href="/" className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors hover:bg-black/5 text-center inline-block" style={{ color: "#7B2D1E", border: "1px solid rgba(123,45,30,0.2)" }}>
              {t("Ke Beranda")}
            </Link>
          </div>

          {/* Kotak Pencarian */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.12)" }}>
              <Search size={16} style={{ color: "#7A6555" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters({ search: query, negara: filterNegara, provinsi: filterProvinsi, kota: filterKota });
                  }
                }}
                placeholder={t("Ketik nama banjar atau nama wilayah (Misal: Indonesia, Bali, Denpasar)...")}
                className="flex-1 bg-transparent outline-none text-sm w-full"
                style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              {query && (
                <button onClick={() => {
                  setQuery("");
                  applyFilters({ search: "", negara: filterNegara, provinsi: filterProvinsi, kota: filterKota });
                }}>
                  <X size={14} style={{ color: "#7A6555" }} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
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
              {showFilters ? t("Tutup Filter") : t("Filter Wilayah")}
            </button>

            {filterNegara && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#FAF4EC", color: "#3A2E24", border: "1px solid rgba(123,45,30,0.12)" }}>
                {filterNegara}
              </span>
            )}
            {filterProvinsi && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#FAF4EC", color: "#3A2E24", border: "1px solid rgba(123,45,30,0.12)" }}>
                {filterProvinsi}
              </span>
            )}
            {filterKota && (
              <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                {filterKota}
              </span>
            )}
            
            {(filterNegara || filterProvinsi || filterKota || query) && (
              <button onClick={resetSearch} className="px-3 py-1.5 text-xs font-medium underline transition-opacity hover:opacity-70" style={{ color: "#C0392B" }}>
                {t("Reset")}
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mb-8 p-6 rounded-3xl shadow-sm border" style={{ background: "rgba(250, 244, 236, 0.95)", borderColor: "rgba(123,45,30,0.15)" }}>
              <div className="flex flex-col md:flex-row gap-6 w-full relative z-40">
                <SearchableSelect 
                  label={t("Negara")} placeholder={t("Semua Negara")}
                  value={filterNegara} onChange={handleNegaraChange}
                  options={negaraList} isLoading={loadingNegara}
                  textLoading={t("Memuat data...")} textSearch={t("Ketik untuk mencari...")} textNotFound={t("Wilayah tidak ditemukan")}
                />
                <SearchableSelect 
                  label={t("Provinsi")} placeholder={t("Semua Provinsi")}
                  value={filterProvinsi} onChange={handleProvinsiChange}
                  options={provinsiList} isLoading={loadingProv}
                  textLoading={t("Memuat data...")} textSearch={t("Ketik untuk mencari...")} textNotFound={t("Wilayah tidak ditemukan")}
                />
                <SearchableSelect 
                  label={t("Kota / Kabupaten")} placeholder={t("Semua Kota")}
                  value={filterKota} onChange={handleKotaChange}
                  options={kotaList} isLoading={loadingKota}
                  textLoading={t("Memuat data...")} textSearch={t("Ketik untuk mencari...")} textNotFound={t("Wilayah tidak ditemukan")}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Total")} <span style={{ color: "#7B2D1E", fontWeight: 600 }}>{banjarsData?.total || 0}</span> {t("banjar ditemukan")}
            </p>
          </div>

          {banjars.length === 0 ? (
            <div className="text-center py-24">
              <MapPin size={32} className="mx-auto mb-3" style={{ color: "#C9B8A8" }} />
              <p className="font-medium" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t("Banjar tidak ditemukan")}</p>
              <button onClick={resetSearch} className="mt-3 text-sm underline" style={{ color: "#7B2D1E" }}>
                {t("Reset pencarian")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banjars.map((banjar: any) => (
                  <div key={banjar.id} className="rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                    <div className="relative h-44 overflow-hidden" style={{ background: "#E8DACC" }}>
                      <img
                        src={banjar.foto_url || '/images/default-banjar.jpg'}
                        alt={banjar.nama_banjar}
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
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>
                          {banjar.nama_banjar}
                        </h3>
                        <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "#C9861A", fontFamily: "'JetBrains Mono', monospace" }}>
                          <Star size={9} fill="#C9861A" />
                          {banjar.rating}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mb-4">
                        <MapPin size={11} className="flex-shrink-0" style={{ color: "#7A6555" }} /> 
                        <p className="text-xs truncate w-full" style={{ color: "#7A6555" }}>
                          {[banjar.kota, banjar.provinsi, banjar.negara]
                            .filter((v: string) => v && v !== '-')
                            .join(', ')}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 mb-4">
                        {/* BUG FIX: Antisipasi jika di backend namanya users_count atau krama_count */}
                        {[
                          { val: banjar.krama_count ?? banjar.users_count ?? banjar.jumlah_kk ?? 0, lbl: t("Anggota") },
                          { val: banjar.umkm_count ?? banjar.umkm ?? 0, lbl: t("UMKM") },
                          { val: banjar.total_views?.toLocaleString('id-ID') || 0, lbl: t("Views") },
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
                          {t("Lihat Profil")}
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

              {banjarsData?.links && banjarsData.links.length > 3 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {banjarsData.links.map((link: any, index: number) => {
                    if (!link.url) return null;
                    const isPrev = link.label.includes('&laquo;');
                    const isNext = link.label.includes('&raquo;');
                    return (
                      <Link
                        key={index}
                        href={link.url}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                          link.active ? 'shadow-md' : 'hover:bg-black/5'
                        }`}
                        style={{ 
                          background: link.active ? '#7B2D1E' : 'transparent',
                          color: link.active ? '#FDF8F2' : '#7A6555',
                          border: link.active ? 'none' : '1px solid rgba(123,45,30,0.2)'
                        }}
                      >
                        {isPrev ? <ChevronLeft size={16} /> : isNext ? <ChevronRight size={16} /> : link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
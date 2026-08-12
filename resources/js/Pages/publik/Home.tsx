import React, { useState, useEffect, useRef } from "react";
import { Link, Head, router, usePage } from "@inertiajs/react";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  Heart,
  Phone,
  CheckCircle,
  Building2,
  Activity,
  ShoppingBag,
  Globe,
  ChevronDown
} from "lucide-react";

import PublicLayout from '../../Layouts/PublicLayout';

// ========================================================================
// KOMPONEN CUSTOM DROPDOWN (Bisa Diketik / Searchable) - Versi Home
// ========================================================================
function CustomDropdown({ value, options, onChange, disabled, placeholder, t }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedLabel = options.find((opt: any) => opt.value === value)?.label || placeholder;
  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(true)}
        className={`w-full px-4 h-12 rounded-xl outline-none text-sm flex justify-between items-center transition-all bg-white ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'} ${isOpen ? 'ring-1 ring-[#C9861A] border-[#C9861A]' : 'border-gray-200 hover:border-[#C9861A]'} border`}
        style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {isOpen ? (
          <div className="flex items-center gap-2 w-full">
            <Search size={14} style={{ color: "#7A6555" }} />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent outline-none placeholder-gray-400"
              placeholder={t("Ketik untuk mencari...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : (
          <span className="truncate" style={{ color: value ? "#1E1208" : "#7A6555", fontWeight: value ? "600" : "400" }}>
            {selectedLabel}
          </span>
        )}
        
        <ChevronDown 
          size={16} 
          style={{ color: "#7A6555", transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease-in-out', flexShrink: 0 }} 
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[999] w-full mt-2 bg-white rounded-xl shadow-2xl border py-2 max-h-56 overflow-y-auto overscroll-contain" style={{ borderColor: "rgba(123,45,30,0.15)" }}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">{t("Memuat data...")}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">{t("Tidak ditemukan")}</div>
          ) : (
            filteredOptions.map((opt: any, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="px-4 py-2.5 text-sm cursor-pointer hover:bg-[#FAF4EC] transition-colors"
                style={{ color: value === opt.value ? "#7B2D1E" : "#1E1208", fontWeight: value === opt.value ? "700" : "500", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ========================================================================
// HALAMAN UTAMA (HOME)
// ========================================================================
export default function Home() {
  // 1. Ambil data asli dan kamus (translations) dari Backend
  const { statistik = {}, banjarUnggulan = [], banjarPreview = null, translations }: any = usePage().props;

  // 2. Fungsi Translate
  const t = (key: string) => translations?.[key] || key;

  // 3. Mapping Statistik Asli (Label ditranslate)
  const STATS = [
    { value: (statistik.banjar || 0).toLocaleString('id-ID'), label: t("Banjar Terdaftar"), icon: Building2 },
    { value: (statistik.kegiatan || 0).toLocaleString('id-ID'), label: t("Kegiatan Aktif"), icon: Activity },
    { value: (statistik.umkm || 0).toLocaleString('id-ID'), label: t("UMKM Lokal"), icon: ShoppingBag },
    { value: (statistik.kabupaten || 0).toLocaleString('id-ID'), label: t("Kabupaten/Kota"), icon: MapPin },
  ];

  const [liked, setLiked] = useState<Set<string>>(new Set());

  // ==========================================
  // STATE & LOGIKA API WILAYAH (GLOBAL)
  // ==========================================
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then((res) => res.json())
      .then((resData) => {
        const names = resData.data.map((c: any) => c.name);
        setCountries(names);
      })
      .catch((err) => console.error("Gagal memuat negara:", err));
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setProvinces([]);
      return;
    }
    setLoadingProvince(true);
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountry }),
    })
      .then((res) => res.json())
      .then((resData) => {
        const names = resData.data.states.map((s: any) => s.name);
        setProvinces(names);
        setCities([]);
        setSelectedProvince("");
        setSelectedCity("");
        setLoadingProvince(false);
      })
      .catch(() => setLoadingProvince(false));
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedProvince) {
      setCities([]);
      return;
    }
    setLoadingCity(true);
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountry, state: selectedProvince }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setCities(resData.data || []);
        setSelectedCity("");
        setLoadingCity(false);
      })
      .catch(() => setLoadingCity(false));
  }, [selectedProvince, selectedCountry]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity) {
      router.get('/cari', { 
        negara: selectedCountry,
        provinsi: selectedProvince,
        kota: selectedCity 
      });
    }
  };

  const countryOptions = countries.map(c => ({ value: c, label: c }));
  const provinceOptions = provinces.map(p => ({ value: p, label: p }));
  const cityOptions = cities.map(c => ({ value: c, label: c }));

  return (
    <PublicLayout>
      {/* Teks tab judul web ditranslate */}
      <Head title={`${t("Beranda")} | ${t("Direktori Banjar Global")}`} />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center" style={{ background: "linear-gradient(160deg, #2A1208 0%, #5C1F12 40%, #7B2D1E 70%, #A0431C 100%)" }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&h=900&fit=crop&auto=format"
            alt="Bali"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(30,8,2,0.85) 0%, rgba(123,45,30,0.7) 60%, rgba(74,103,65,0.4) 100%)" }} />
        </div>

        {/* CONTAINER 12 KOLOM */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* BAGIAN KIRI DIBUAT LEBIH LEBAR (7 KoloM dari 12) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 tracking-wider uppercase" style={{ background: "rgba(201,134,26,0.2)", border: "1px solid rgba(201,134,26,0.4)", color: "#F0C060", fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t("Platform Komunitas Banjar Global")}
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
              {t("Jelajahi")}<br /><span style={{ color: "#F0C060" }}>{t("Komunitas")}</span> {t("di")}<br />{t("Seluruh Dunia")}
            </h1>
            
            <p className="text-lg leading-relaxed mb-10 max-w-2xl" style={{ color: "rgba(253,248,242,0.72)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Temukan dan terhubung dengan komunitas adat Banjar, baik di daerah asal maupun diaspora global.")}
            </p>

            {/* --- FORM PENCARIAN DENGAN GRID 2x2 --- */}
            <form onSubmit={handleSearch} className="p-4 rounded-3xl mb-6 shadow-2xl" style={{ background: "rgba(250, 244, 236, 0.95)", border: "1px solid #E5D5C5", backdropFilter: "blur(10px)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <CustomDropdown
                  t={t}
                  placeholder={t("1. Pilih Negara...")}
                  value={selectedCountry}
                  onChange={(val: string) => {
                    setSelectedCountry(val);
                    setSelectedProvince(""); 
                    setSelectedCity(""); 
                  }}
                  options={countryOptions}
                  disabled={countries.length === 0}
                />

                <CustomDropdown
                  t={t}
                  placeholder={loadingProvince ? t("Memuat...") : t("2. Pilih Provinsi...")}
                  value={selectedProvince}
                  onChange={(val: string) => {
                    setSelectedProvince(val);
                    setSelectedCity(""); 
                  }}
                  options={provinceOptions}
                  disabled={!selectedCountry || loadingProvince || provinceOptions.length === 0}
                />

                <CustomDropdown
                  t={t}
                  placeholder={loadingCity ? t("Memuat...") : t("3. Pilih Kota...")}
                  value={selectedCity}
                  onChange={(val: string) => setSelectedCity(val)}
                  options={cityOptions}
                  disabled={!selectedProvince || loadingCity || cityOptions.length === 0}
                />

                <button 
                  type="submit" 
                  disabled={!selectedCity} 
                  className="flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity w-full disabled:opacity-50" 
                  style={{ background: "#C9861A", color: "#1E1208" }}
                >
                  <Search size={16} /> {t("Cari")}
                </button>

              </div>
            </form>

            <div className="flex items-center gap-6">
              <Link href="/peta" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#F0C060", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Globe size={14} /> {t("Jelajah Peta Interaktif")} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* BAGIAN KANAN MENGAMBIL SISA RUANG */}
          <div className="hidden lg:block relative h-[480px] lg:col-span-5 xl:col-span-4">
            {banjarPreview && (
              <div className="absolute top-8 right-0 w-72 rounded-2xl p-5 shadow-2xl" style={{ background: "rgba(250,244,236,0.95)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden" style={{ background: "#E8DACC" }}>
                    <img src={banjarPreview.img} alt={banjarPreview.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold truncate w-32" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>
                      {banjarPreview.name}
                    </div>
                    <div className="text-xs flex items-center gap-1 truncate w-32" style={{ color: "#7A6555" }}>
                      <MapPin size={10} className="flex-shrink-0" /> {banjarPreview.kabupaten}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#F0F7EE", color: "#4A6741" }}>
                    <Star size={10} fill="#4A6741" /> {banjarPreview.rating}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { val: banjarPreview.members, lbl: "Anggota" },
                    { val: banjarPreview.umkm, lbl: "UMKM" },
                    { val: banjarPreview.views > 1000 ? `${(banjarPreview.views/1000).toFixed(1)}K` : banjarPreview.views, lbl: t("Views") },
                  ].map((s) => (
                    <div key={s.lbl} className="text-center rounded-xl py-2" style={{ background: "#F5EDE0" }}>
                      <div className="text-base font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7B2D1E" }}>{s.val}</div>
                      <div className="text-[10px]" style={{ color: "#7A6555" }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <Link href={`/banjar/${banjarPreview.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "#25D366", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Phone size={13} /> {t("Hubungi Banjar")}
                </Link>
              </div>
            )}
            
            <div className="absolute top-56 right-10 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-xs" style={{ background: "rgba(250,244,236,0.95)", color: "#1E1208" }}>
              <CheckCircle size={12} style={{ color: "#4A6741" }} /> {(statistik.banjar || 0).toLocaleString('id-ID')} {t("Banjar Terverifikasi")}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20">
            <path d="M0,60 C360,10 720,80 1080,40 C1260,20 1380,60 1440,60 L1440,80 L0,80Z" fill="#F5EDE0" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14" style={{ background: "#F5EDE0" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.1)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(123,45,30,0.08)" }}>
                <s.icon size={20} style={{ color: "#7B2D1E" }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7B2D1E" }}>{s.value}</div>
                <div className="text-xs" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Banjar */}
      <section className="py-20" style={{ background: "#F5EDE0" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#C9861A", fontFamily: "'JetBrains Mono', monospace" }}>
                {t("Banjar Unggulan")}
              </div>
              <h2 className="text-4xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
                {t("Profil Banjar Terpopuler")}
              </h2>
            </div>
            <Link href="/cari" className="hidden lg:flex items-center gap-2 text-sm font-medium" style={{ color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Lihat Semua")} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {banjarUnggulan.length > 0 ? (
              banjarUnggulan.map((banjar: any) => (
                <div key={banjar.id} className="rounded-3xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                  <div className="relative h-52 overflow-hidden" style={{ background: "#E8DACC" }}>
                    <img src={banjar.img} alt={banjar.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    <button onClick={() => toggleLike(banjar.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(250,244,236,0.9)" }}>
                      <Heart size={14} fill={liked.has(banjar.id) ? "#7B2D1E" : "transparent"} style={{ color: liked.has(banjar.id) ? "#7B2D1E" : "#5A4A3A" }} />
                    </button>
                    
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {banjar.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "rgba(250,244,236,0.92)", color: "#1E1208" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>{banjar.name}</h3>
                        <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#7A6555" }}>
                         <MapPin size={10} className="flex-shrink-0" /> <span className="truncate w-40">{banjar.kecamatan}, {banjar.kabupaten}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "#F5EDE0", color: "#7B2D1E", fontFamily: "'JetBrains Mono', monospace" }}>
                        <Star size={10} fill="#C9861A" style={{ color: "#C9861A" }} /> {banjar.rating}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 my-4">
                      {[
                        { val: banjar.members, lbl: "Anggota" },
                        { val: banjar.umkm, lbl: "UMKM" },
                        { val: banjar.views?.toLocaleString('id-ID'), lbl: t("Views") },
                      ].map((s) => (
                        <div key={s.lbl} className="text-center py-2 rounded-xl" style={{ background: "#F0E8DA" }}>
                          <div className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7B2D1E" }}>{s.val}</div>
                          <div className="text-[10px]" style={{ color: "#7A6555" }}>{s.lbl}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/banjar/${banjar.id}`} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border text-center transition-colors hover:bg-black/5" style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E" }}>
                        {t("Lihat Profil")}
                      </Link>
                      <a href={`https://wa.me/${banjar.phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: "#25D366", color: "#fff" }}>
                        <Phone size={11} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                {t("Belum ada banjar yang terverifikasi dan aktif.")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#7B2D1E" }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <circle cx="200" cy="200" r="150" stroke="#C9861A" strokeWidth="1" fill="none" />
            <path d="M200 50 L230 130 L310 130 L250 175 L275 255 L200 210 L125 255 L150 175 L90 130 L170 130Z" stroke="#C9861A" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
            {t("Daftarkan Banjarmu")}<br />{t("di")} <span style={{ color: "#F0C060" }}>banjar.id</span>
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(253,248,242,0.72)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("Hadirkan komunitas Anda di platform digital Dunia.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "#C9861A", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Daftarkan Banjar Gratis")}
            </Link>
            <Link href="/peta" className="px-8 py-4 rounded-full text-sm font-semibold border-2 hover:bg-white/10 transition-colors" style={{ borderColor: "rgba(253,248,242,0.4)", color: "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Jelajah Peta")}
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// Import library Searchable Dropdown yang baru di-install
import Select from "react-select";

import PublicLayout from '../../Layouts/PublicLayout';

const STATS = [
  { value: "1.480", label: "Banjar Terdaftar", icon: Building2 },
  { value: "342", label: "Kegiatan Aktif", icon: Activity },
  { value: "5.200+", label: "UMKM Lokal", icon: ShoppingBag },
  { value: "9", label: "Kabupaten/Kota", icon: MapPin },
];

export default function Home() {
  const { banjarsData }: any = usePage().props;

  const BANJAR_LIST = banjarsData || [
    {
      id: "1", name: "Banjar Penglipuran", kecamatan: "Bangli", kabupaten: "Bangli",
      img: "photo-1604665515776-0c5b9e11e6f2", members: 320, umkm: 82, views: 3500, rating: 4.9,
      tags: ["Budaya", "Wisata", "UMKM"], phone: "6281122334455"
    },
    {
      id: "2", name: "Banjar Kaja Sesetan", kecamatan: "Denpasar Selatan", kabupaten: "Denpasar",
      img: "photo-1537953773345-d172ccf13cf1", members: 450, umkm: 120, views: 2800, rating: 4.8,
      tags: ["Sosial", "Kuliner"], phone: "6281122334466"
    },
    {
      id: "3", name: "Banjar Sydney", kecamatan: "Kensington", kabupaten: "Sydney",
      img: "photo-1512453979436-5a536909e91f", members: 45, umkm: 3, views: 890, rating: 4.9,
      tags: ["Diaspora", "Global"], phone: "61400000000"
    }
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

  // Ambil Data Negara dari API
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then((res) => res.json())
      .then((resData) => {
        const names = resData.data.map((c: any) => c.name);
        setCountries(names);
      })
      .catch((err) => console.error("Gagal memuat negara:", err));
  }, []);

  // Ambil Data Provinsi dari API
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

  // Ambil Data Kota dari API
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

  // ==========================================
  // KUSTOMISASI DESAIN DROPDOWN (REACT-SELECT)
  // ==========================================
  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: "48px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#C9861A" : "#E5E7EB",
      backgroundColor: "#ffffff",
      boxShadow: "none",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "14px",
      fontWeight: "600",
      color: "#1E1208",
      "&:hover": { borderColor: "#C9861A" }
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      zIndex: 999,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "#C9861A" 
        : state.isFocused 
          ? "rgba(201,134,26,0.08)" 
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#1E1208",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      "&:active": { backgroundColor: "#C9861A" }
    }),
    placeholder: (base: any) => ({ ...base, color: "#7A6555" }),
    singleValue: (base: any) => ({ ...base, color: "#1E1208" })
  };

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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

  // Format array string dari API menjadi format yang dimengerti react-select yaitu [{ value, label }]
  const countryOptions = countries.map(c => ({ value: c, label: c }));
  const provinceOptions = provinces.map(p => ({ value: p, label: p }));
  const cityOptions = cities.map(c => ({ value: c, label: c }));

  return (
    <PublicLayout>
      <Head title="Beranda | Direktori Banjar Global" />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(160deg, #2A1208 0%, #5C1F12 40%, #7B2D1E 70%, #A0431C 100%)" }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&h=900&fit=crop&auto=format"
            alt="Bali"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(30,8,2,0.85) 0%, rgba(123,45,30,0.7) 60%, rgba(74,103,65,0.4) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 tracking-wider uppercase" style={{ background: "rgba(201,134,26,0.2)", border: "1px solid rgba(201,134,26,0.4)", color: "#F0C060", fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Platform Komunitas Banjar Global
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
              Jelajahi<br /><span style={{ color: "#F0C060" }}>Komunitas</span> di<br />Seluruh Dunia
            </h1>
            <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: "rgba(253,248,242,0.72)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Temukan dan terhubung dengan komunitas adat Banjar, baik di daerah asal maupun diaspora global.
            </p>

            {/* FORM PENCARIAN PREMIUM DENGAN REACT-SELECT */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl mb-6 shadow-xl" style={{ background: "#FAF4EC", border: "1px solid #E5D5C5" }}>
              
              {/* Dropdown 1: Negara */}
              <div className="flex-1 w-full text-left">
                <Select
                  options={countryOptions}
                  styles={customSelectStyles}
                  placeholder="1. Pilih Negara..."
                  value={selectedCountry ? { value: selectedCountry, label: selectedCountry } : null}
                  onChange={(newValue: any) => setSelectedCountry(newValue ? newValue.value : "")}
                />
              </div>

              {/* Dropdown 2: Provinsi */}
              <div className="flex-1 w-full text-left">
                <Select
                  options={provinceOptions}
                  styles={customSelectStyles}
                  placeholder={loadingProvince ? "Memuat..." : "2. Pilih Provinsi..."}
                  isDisabled={!selectedCountry || loadingProvince}
                  value={selectedProvince ? { value: selectedProvince, label: selectedProvince } : null}
                  onChange={(newValue: any) => setSelectedProvince(newValue ? newValue.value : "")}
                />
              </div>

              {/* Dropdown 3: Kota */}
              <div className="flex-1 w-full text-left">
                <Select
                  options={cityOptions}
                  styles={customSelectStyles}
                  placeholder={loadingCity ? "Memuat..." : "3. Pilih Kota..."}
                  isDisabled={!selectedProvince || loadingCity}
                  value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
                  onChange={(newValue: any) => setSelectedCity(newValue ? newValue.value : "")}
                />
              </div>

              <button type="submit" disabled={!selectedCity} className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity w-full sm:w-auto disabled:opacity-50" style={{ background: "#C9861A", color: "#1E1208" }}>
                <Search size={16} /> Cari
              </button>
            </form>

            <div className="flex items-center gap-6">
              <Link href="/peta" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#F0C060", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Globe size={14} /> Jelajah Peta Interaktif <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Floating preview card */}
          <div className="hidden lg:block relative h-[480px]">
            <div className="absolute top-8 right-0 w-72 rounded-2xl p-5 shadow-2xl" style={{ background: "rgba(250,244,236,0.95)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden" style={{ background: "#E8DACC" }}>
                  <img src="https://images.unsplash.com/photo-1604665515776-0c5b9e11e6f2?w=80&h=80&fit=crop&auto=format" alt="Banjar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>Banjar Penglipuran</div>
                  <div className="text-xs flex items-center gap-1" style={{ color: "#7A6555" }}>
                    <MapPin size={10} /> Bangli
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#F0F7EE", color: "#4A6741" }}>
                  <Star size={10} fill="#4A6741" /> 4.9
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { val: "320", lbl: "KK" },
                  { val: "82", lbl: "UMKM" },
                  { val: "3.5K", lbl: "Views" },
                ].map((s) => (
                  <div key={s.lbl} className="text-center rounded-xl py-2" style={{ background: "#F5EDE0" }}>
                    <div className="text-base font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7B2D1E" }}>{s.val}</div>
                    <div className="text-[10px]" style={{ color: "#7A6555" }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <Link href="/banjar/1" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "#25D366", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Phone size={13} /> Hubungi via WhatsApp
              </Link>
            </div>
            
            <div className="absolute bottom-24 left-0 w-60 rounded-2xl p-4 shadow-xl" style={{ background: "rgba(250,244,236,0.92)", border: "1px solid rgba(201,134,26,0.2)" }}>
              <div className="text-xs font-medium mb-3 tracking-wide uppercase" style={{ color: "#C9861A", fontFamily: "'JetBrains Mono', monospace" }}>
                Kegiatan Terkini
              </div>
              {[
                { name: "Ngaben Massal", banjar: "Kaja Sesetan", color: "#7B2D1E" },
                { name: "Pameran Bambu", banjar: "Tegal Jaya", color: "#4A6741" },
              ].map((a) => (
                <div key={a.name} className="flex items-center gap-2.5 py-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                  <div>
                    <div className="text-xs font-medium" style={{ color: "#1E1208" }}>{a.name}</div>
                    <div className="text-[10px]" style={{ color: "#7A6555" }}>{a.banjar}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute top-56 right-10 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-xs" style={{ background: "rgba(250,244,236,0.95)", color: "#1E1208" }}>
              <CheckCircle size={12} style={{ color: "#4A6741" }} /> 1.480 Banjar Terverifikasi
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
                Banjar Unggulan
              </div>
              <h2 className="text-4xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
                Profil Banjar Terpopuler
              </h2>
            </div>
            <Link href="/cari" className="hidden lg:flex items-center gap-2 text-sm font-medium" style={{ color: "#7B2D1E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {BANJAR_LIST.slice(0, 3).map((banjar: any) => (
              <div key={banjar.id} className="rounded-3xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
                <div className="relative h-52 overflow-hidden" style={{ background: "#E8DACC" }}>
                  <img src={`https://images.unsplash.com/${banjar.img}?w=600&h=400&fit=crop&auto=format`} alt={banjar.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                        <MapPin size={10} /> {banjar.kecamatan}, {banjar.kabupaten}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: "#F5EDE0", color: "#7B2D1E", fontFamily: "'JetBrains Mono', monospace" }}>
                      <Star size={10} fill="#C9861A" style={{ color: "#C9861A" }} /> {banjar.rating}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 my-4">
                    {[
                      { val: banjar.members, lbl: "KK" },
                      { val: banjar.umkm, lbl: "UMKM" },
                      { val: banjar.views?.toLocaleString(), lbl: "Views" },
                    ].map((s) => (
                      <div key={s.lbl} className="text-center py-2 rounded-xl" style={{ background: "#F0E8DA" }}>
                        <div className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#7B2D1E" }}>{s.val}</div>
                        <div className="text-[10px]" style={{ color: "#7A6555" }}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/banjar/${banjar.id}`} className="flex-1 py-2.5 rounded-xl text-xs font-semibold border text-center transition-colors hover:bg-black/5" style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E" }}>
                      Lihat Profil
                    </Link>
                    <a href={`https://wa.me/${banjar.phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: "#25D366", color: "#fff" }}>
                      <Phone size={11} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
            Daftarkan Banjarmu<br />di <span style={{ color: "#F0C060" }}>banjar.id</span>
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(253,248,242,0.72)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Hadirkan komunitas Anda di platform digital Dunia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "#C9861A", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Daftarkan Banjar Gratis
            </Link>
            <Link href="/peta" className="px-8 py-4 rounded-full text-sm font-semibold border-2 hover:bg-white/10 transition-colors" style={{ borderColor: "rgba(253,248,242,0.4)", color: "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Jelajah Peta
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
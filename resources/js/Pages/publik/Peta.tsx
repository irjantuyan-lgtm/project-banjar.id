import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { MapPin, Search, Star, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import Select from "react-select";

// @ts-ignore
import PublicLayout from '../../Layouts/PublicLayout';

// IMPORT COMPONENT PETA (LEAFLET)
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Perbaikan bug icon marker default Leaflet di React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component pembantu untuk menggerakkan kamera peta secara otomatis
function ChangeMapView({ coords, zoom }: { coords: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}

export default function Peta() {
  // 1. AMBIL PROPS DAN TRANSLATIONS DARI LARAVEL INERTIA
  const { banjarsData = [], queryKota, translations }: any = usePage().props;

  // 2. FUNGSI TRANSLATE 
  const t = (key: string) => translations?.[key] || key;

  // 3. STATE INTEGRASI API WILAYAH & PENCARIAN
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState(queryKota || "");
  
  const [isFilterMinimized, setIsFilterMinimized] = useState(false);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  // Koordinat Peta Default
  const [mapCenter, setMapCenter] = useState<[number, number]>([-8.409518, 115.188919]);
  const [mapZoom, setMapZoom] = useState(9);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then((res) => res.json())
      .then((resData) => setCountries(resData.data.map((c: any) => c.name)))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setProvinces([]);
      setCities([]);
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
        setProvinces(resData.data.states.map((s: any) => s.name));
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

  // =========================================================================
  // 4. LOGIKA PENCARIAN REAL-TIME (SUPER CERDAS)
  // =========================================================================
  const filteredBanjars = useMemo(() => {
    return banjarsData.filter((b: any) => {
      // Filter Dropdown
      const matchNegara = !selectedCountry || b.negara === selectedCountry;
      const matchProvinsi = !selectedProvince || b.provinsi === selectedProvince;
      const matchKota = !selectedCity || (b.kota && b.kota.toLowerCase() === selectedCity.toLowerCase());
      
      // Filter Ketikan (Search Bar) - Cek 4 data sekaligus (Nama, Kota, Provinsi, Negara)
      const queryLower = searchQuery.toLowerCase();
      const nama = (b.nama_banjar || "").toLowerCase();
      const kota = (b.kota || "").toLowerCase();
      const provinsi = (b.provinsi || "").toLowerCase();
      const negara = (b.negara || "indonesia").toLowerCase(); // Fallback ke indonesia jika null

      const matchSearch = !searchQuery || 
                          nama.includes(queryLower) || 
                          kota.includes(queryLower) ||
                          provinsi.includes(queryLower) ||
                          negara.includes(queryLower);
      
      return matchNegara && matchProvinsi && matchKota && matchSearch;
    });
  }, [banjarsData, selectedCountry, selectedProvince, selectedCity, searchQuery]);

 // =========================================================================
  // 5. AUTO-FOCUS KAMERA PETA 
  // =========================================================================
  useEffect(() => {
    const isFilterActive = searchQuery !== "" || selectedCountry !== "" || selectedProvince !== "" || selectedCity !== "";

    if (!isFilterActive) {
      // 1. TAMPILAN AWAL (KOSONG / BELUM MENCARI)
      setMapCenter([-2.5489, 118.0149]); // Tengah Indonesia
      setMapZoom(5); 
      return;
    }

    if (filteredBanjars.length > 0) {
      // 2. JIKA ADA BANJAR DITEMUKAN, FOKUS KE BANJAR TERSEBUT
      if (searchQuery.toLowerCase() === 'indonesia' || selectedCountry === 'Indonesia') {
        setMapCenter([-2.5489, 118.0149]);
        setMapZoom(5);
      } else {
        setMapCenter([filteredBanjars[0].lat, filteredBanjars[0].lng]);
        setMapZoom(filteredBanjars.length === 1 ? 14 : 9); 
      }
    } else {
      // 3. JIKA BANJAR KOSONG, CARI KOORDINAT LOKASI DI PETA DUNIA!
      const targetLocation = selectedCity || selectedProvince || selectedCountry || searchQuery;
      
      if (targetLocation.toLowerCase() === 'indonesia') {
        setMapCenter([-2.5489, 118.0149]);
        setMapZoom(5);
      } else if (targetLocation && targetLocation.length > 2) {
        // Gunakan delay (debounce) 1 detik agar pencarian halus saat mengetik
        const delaySearch = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${targetLocation}`)
            .then((res) => res.json())
            .then((data) => {
              if (data && data.length > 0) {
                // Lokasi ditemukan di dunia, terbang ke titik tersebut!
                setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                // Sesuaikan level zoom (Kota lebih dekat dari Negara)
                setMapZoom(selectedCity ? 11 : selectedProvince ? 7 : 6);
              }
            })
            .catch((err) => console.error("Gagal mencari lokasi:", err));
        }, 1000); 

        return () => clearTimeout(delaySearch);
      }
    }
  }, [filteredBanjars, selectedCountry, selectedProvince, selectedCity, searchQuery]);

  // Styling Custom untuk Select Dropdown
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "rgba(30, 18, 8, 0.95)",
      borderColor: state.isFocused ? "#C9861A" : "rgba(201, 134, 26, 0.3)",
      color: "#FDF8F2",
      minHeight: "38px",
      borderRadius: "10px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "12px",
      fontWeight: "500",
      boxShadow: "none",
      "&:hover": { borderColor: "#C9861A" }
    }),
    singleValue: (base: any) => ({ ...base, color: "#FDF8F2" }),
    placeholder: (base: any) => ({ ...base, color: "#8C7A6B" }),
    menu: (base: any) => ({ ...base, backgroundColor: "#1E1208", borderRadius: "10px", zIndex: 99999 }),
    menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#C9861A" : state.isFocused ? "rgba(201,134,26,0.15)" : "transparent",
      color: "#FDF8F2",
      cursor: "pointer",
      fontSize: "12px"
    }),
  };

  return (
    <PublicLayout>
      <div className="flex flex-col min-h-screen" style={{ background: "#1E1208" }}>
        <Head title={`${t("Peta Persebaran")} | banjar.id`} />
        
        {/* CONTAINER FILTER DI ATAS (DI BAWAH NAVBAR) */}
        {isFilterMinimized ? (
          <button 
            onClick={() => setIsFilterMinimized(false)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#1E1208] border-b border-[#C9861A]/30 text-xs font-bold text-[#FDF8F2] transition-all hover:bg-[#25170b] flex-shrink-0 shadow-md z-20 mt-16"
          >
            <div className="flex items-center gap-2 truncate">
              <SlidersHorizontal size={15} style={{ color: "#C9861A" }} />
              <span className="truncate">
                {selectedCountry || selectedProvince || selectedCity || searchQuery ? (
                  <span style={{ color: "#C9861A" }}>{t("Filter Aktif (Ketuk untuk ubah)")}</span>
                ) : (
                  t("Cari & Filter Wilayah...")
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: "#C9861A" }}>
              <span>{t("Buka")}</span>
              <ChevronDown size={16} />
            </div>
          </button>
        ) : (
          <div className="p-3 bg-[#1E1208] border-b border-[#C9861A]/30 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:flex-nowrap gap-2 items-center shadow-md flex-shrink-0 z-20 mt-16">
            <Link href="/" className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold shadow transition-transform hover:scale-105 col-span-2 sm:col-span-1 lg:flex-shrink-0" style={{ background: "#C9861A", color: "#1E1208" }}>
              ← {t("Beranda")}
            </Link>

            <div className="w-full lg:w-40">
              <Select
                value={selectedCountry ? { value: selectedCountry, label: selectedCountry } : null}
                options={countries.map(c => ({ value: c, label: c }))}
                styles={selectStyles}
                placeholder={t("1. Pilih Negara...")}
                isClearable
                isSearchable={true}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                onChange={(val: any) => setSelectedCountry(val?.value || "")}
              />
            </div>

            <div className="w-full lg:w-44">
              <Select
                value={selectedProvince ? { value: selectedProvince, label: selectedProvince } : null}
                options={provinces.map(p => ({ value: p, label: p }))}
                styles={selectStyles}
                placeholder={loadingProvince ? t("Memuat...") : t("2. Pilih Provinsi...")}
                isDisabled={!selectedCountry || loadingProvince}
                isClearable
                isSearchable={true}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                onChange={(val: any) => setSelectedProvince(val?.value || "")}
              />
            </div>

            <div className="w-full lg:w-44">
              <Select
                value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
                options={cities.map(c => ({ value: c, label: c }))}
                styles={selectStyles}
                placeholder={loadingCity ? t("Memuat...") : t("3. Pilih Kota...")}
                isDisabled={!selectedProvince || loadingCity}
                isClearable
                isSearchable={true}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                onChange={(val: any) => setSelectedCity(val?.value || "")}
              />
            </div>

            <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:flex-1 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border" style={{ background: "rgba(30, 18, 8, 0.9)", borderColor: "rgba(201, 134, 26, 0.3)" }}>
              <div className="flex items-center gap-2 flex-1">
                <Search size={14} style={{ color: "#C9861A" }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Cari kata kunci khusus...")}
                  className="w-full bg-transparent outline-none text-xs text-[#FDF8F2]"
                />
              </div>
              <button 
                onClick={() => setIsFilterMinimized(true)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 text-[10px]"
                style={{ color: "#C9861A" }}
                title={t("Tutup Filter")}
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION UTAMA BAWAH: PETA & LIST BANJAR */}
        <div className="flex flex-col lg:flex-row relative" style={{ height: "calc(100vh - 115px)" }}>
          
          {/* PETA CONTAINER */}
          <div className="w-full lg:flex-1 relative z-0 h-[450px] lg:h-full">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              zoomControl={false} 
              className="w-full h-full"
              minZoom={3} 
              worldCopyJump={true} 
              style={{ backgroundColor: "#0e0e0e", width: "100%", height: "100%" }} 
            >
              <ChangeMapView coords={mapCenter} zoom={mapZoom} />
              
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
              />
              
              {/* RENDER PIN BIRU UNTUK SETIAP BANJAR YANG TAMPIL */}
              {filteredBanjars.map((banjar: any) => (
                <Marker key={banjar.id} position={[banjar.lat, banjar.lng]}>
                  <Popup>
                    <div className="text-center p-1 w-44">
                      <img 
                        src={banjar.foto_url || '/images/default-banjar.jpg'} 
                        alt={banjar.nama_banjar} 
                        className="w-full h-20 object-cover rounded-lg mb-2" 
                      />
                      <h3 className="font-bold text-sm text-[#1E1208] mb-0.5">{banjar.nama_banjar}</h3>
                      <p className="text-[10px] text-gray-500 mb-2">{banjar.kota}, {banjar.negara}</p>
                      <Link href={`/banjar/${banjar.id}`} className="block w-full py-1.5 rounded text-xs font-bold text-white text-center transition-opacity hover:opacity-90" style={{ backgroundColor: "#7B2D1E" }}>
                        {t("Lihat Profil")}
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* PANEL KANAN: LIST CARD DAFTAR BANJAR */}
          <div className="w-full lg:w-96 flex flex-col shadow-2xl z-10 h-[45vh] lg:h-full overflow-hidden" style={{ background: "#FAF4EC", borderLeft: "1px solid rgba(123,45,30,0.1)" }}>
            
            <div className="p-4 lg:p-6 border-b flex-shrink-0" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
              <h2 className="font-bold text-lg lg:text-xl mb-1" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
                {t("Daftar Banjar")}
              </h2>
              <p className="text-xs" style={{ color: "#7A6555" }}>
                {t("Menampilkan")} <strong style={{ color: "#7B2D1E" }}>{filteredBanjars.length}</strong> {t("komunitas adat terdaftar.")}
              </p>
            </div>

            <div className="flex-1 p-3 lg:p-4 space-y-3 overflow-y-auto custom-scrollbar">
              {filteredBanjars.length > 0 ? (
                filteredBanjars.map((b: any) => (
                  <Link href={`/banjar/${b.id}`} key={b.id} className="block p-3 rounded-2xl border transition-all hover:shadow-md bg-white" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                    <div className="flex gap-3">
                      <img 
                        src={b.foto_url || '/images/default-banjar.jpg'} 
                        className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl object-cover flex-shrink-0" 
                        alt={b.nama_banjar} 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#1E1208] truncate">{b.nama_banjar}</h3>
                        <div className="text-[10px] text-[#7A6555] flex items-center gap-1 mt-1 mb-2">
                          <MapPin size={10} className="flex-shrink-0" /> <span className="truncate">{b.kota}, {b.negara}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#C9861A" }}>
                            <Star size={10} fill="#C9861A" /> {b.rating}
                          </span>
                          <span className="text-[10px] font-semibold text-[#7B2D1E]">{b.jumlah_anggota ?? 0} {t("Anggota")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-sm" style={{ color: '#7A6555' }}>
                  {t("Tidak ada data banjar di wilayah ini.")}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
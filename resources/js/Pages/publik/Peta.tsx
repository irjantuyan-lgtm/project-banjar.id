import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { MapPin, Search, Star, Phone } from "lucide-react";
import Select from "react-select";

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
  // 1. AMBIL PROPS DARI LARAVEL INERTIA
  const { props, url } = usePage();
  const { banjarsData }: any = props;

  // 2. MASTER DATA BANJAR GLOBAL (Dilengkapi Lat & Lng Koordinat)
  const BANJAR_LIST = banjarsData || [
    {
      id: "1", name: "Banjar Adat Kaja", kecamatan: "Denpasar Utara", kota: "Denpasar", provinsi: "Bali", negara: "Indonesia",
      lat: -8.6500, lng: 115.2190,
      img: "photo-1537953773345-d172ccf13cf1", rating: 4.8, members: 150, phone: "6281234567890"
    },
    {
      id: "2", name: "Banjar Penglipuran", kecamatan: "Bangli", kota: "Bangli", provinsi: "Bali", negara: "Indonesia",
      lat: -8.4215, lng: 115.3582,
      img: "photo-1604665515776-0c5b9e11e6f2", rating: 4.9, members: 320, phone: "6281122334455"
    },
    {
      id: "3", name: "Banjar Sydney", kecamatan: "Kensington", kota: "Sydney", provinsi: "New South Wales", negara: "Australia",
      lat: -33.9173, lng: 151.2253,
      img: "photo-1512453979436-5a536909e91f", rating: 4.9, members: 45, phone: "61400000000"
    }
  ];

  // 3. STATE INTEGRASI API WILAYAH 3 TINGKAT
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  // Koordinat Peta Default (Bali)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-8.409518, 115.188919]);
  const [mapZoom, setMapZoom] = useState(9);

  // API 1: Muat Seluruh Negara
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then((res) => res.json())
      .then((resData) => setCountries(resData.data.map((c: any) => c.name)))
      .catch((err) => console.error(err));
  }, []);

  // API 2: Muat Provinsi berdasarkan Negara yang dipilih
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

  // API 3: Muat Kota/Kabupaten berdasarkan Provinsi yang dipilih
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

  // LOGIKA AUTO-FOCUS KONTEKS DENGAN URUTAN KOORDINAT PETA GLOBAL
  useEffect(() => {
    if (selectedCountry === "Australia") {
      setMapCenter([-33.8688, 151.2093]); // Fokus langsung ke Sydney
      setMapZoom(6);
    } else if (selectedCountry === "Indonesia") {
      setMapCenter([-8.409518, 115.188919]); // Fokus ke Bali
      setMapZoom(9);
    } else if (selectedCountry === "") {
      setMapCenter([0, 115]); // Pandangan dunia menyeluruh
      setMapZoom(3);
    }
  }, [selectedCountry]);

  // 4. LOGIKA PROSES FILTERING DATA BANJAR
  const filteredBanjars = BANJAR_LIST.filter((b: any) => {
    const matchNegara = !selectedCountry || b.negara === selectedCountry;
    const matchProvinsi = !selectedProvince || b.provinsi === selectedProvince;
    const matchKota = !selectedCity || b.kota.toLowerCase() === selectedCity.toLowerCase();
    const matchSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.kota.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchNegara && matchProvinsi && matchKota && matchSearch;
  });

  // Kustomisasi Desain Premium untuk React-Select (Tema Kopi Esspreso-Emas)
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "rgba(30, 18, 8, 0.85)",
      borderColor: state.isFocused ? "#C9861A" : "rgba(201, 134, 26, 0.3)",
      color: "#FDF8F2",
      minHeight: "44px",
      borderRadius: "12px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "13px",
      fontWeight: "500",
      boxShadow: "none",
      "&:hover": { borderColor: "#C9861A" }
    }),
    singleValue: (base: any) => ({ ...base, color: "#FDF8F2" }),
    placeholder: (base: any) => ({ ...base, color: "#8C7A6B" }),
    menu: (base: any) => ({ ...base, backgroundColor: "#1E1208", borderRadius: "12px", zIndex: 9999 }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#C9861A" : state.isFocused ? "rgba(201,134,26,0.15)" : "transparent",
      color: "#FDF8F2",
      cursor: "pointer"
    }),
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col" style={{ background: "#1E1208" }}>
      <Head title="Peta Persebaran Global | banjar.id" />
      
      <div className="flex-1 flex relative">
        
        {/* ========================================== */}
        {/* PANEL KIRI: PETA TILE MAP LIVE */}
        {/* ========================================== */}
        <div className="flex-1 relative z-0">
          
          {/* Overlay Filter yang Melayang di Atas Peta */}
          <div className="absolute top-6 left-6 right-6 z-[999] flex flex-wrap lg:flex-nowrap gap-3 items-center">
            
            {/* Tombol Kembali ke Dashboard Utama */}
            <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 flex-shrink-0" style={{ background: "#C9861A", color: "#1E1208" }}>
              ← Beranda
            </Link>

            {/* Dropdown 1: Negara */}
            <div className="w-44 shadow-lg">
              <Select
                options={countries.map(c => ({ value: c, label: c }))}
                styles={selectStyles}
                placeholder="1. Negara..."
                isClearable
                onChange={(val: any) => setSelectedCountry(val?.value || "")}
              />
            </div>

            {/* Dropdown 2: Provinsi */}
            <div className="w-48 shadow-lg">
              <Select
                options={provinces.map(p => ({ value: p, label: p }))}
                styles={selectStyles}
                placeholder={loadingProvince ? "Memuat..." : "2. Provinsi..."}
                isDisabled={!selectedCountry || loadingProvince}
                isClearable
                onChange={(val: any) => setSelectedProvince(val?.value || "")}
              />
            </div>

            {/* Dropdown 3: Kota/Kabupaten */}
            <div className="w-52 shadow-lg">
              <Select
                options={cities.map(c => ({ value: c, label: c }))}
                styles={selectStyles}
                placeholder={loadingCity ? "Memuat..." : "3. Kota/Kabupaten..."}
                isDisabled={!selectedProvince || loadingCity}
                isClearable
                onChange={(val: any) => setSelectedCity(val?.value || "")}
              />
            </div>

            {/* Input Pencarian Text Cepat */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-lg border" style={{ background: "rgba(30, 18, 8, 0.85)", borderColor: "rgba(201, 134, 26, 0.3)", backdropFilter: "blur(8px)" }}>
              <Search size={16} style={{ color: "#C9861A" }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci khusus..."
                className="w-full bg-transparent outline-none text-sm text-[#FDF8F2]"
              />
            </div>
          </div>

          {/* ENGINE UTAMA MAP LEAFLET CONTAINER */}
          <MapContainer center={mapCenter} zoom={mapZoom} zoomControl={false} className="w-full h-full">
            <ChangeMapView coords={mapCenter} zoom={mapZoom} />
            
            {/* Mengunci Skin Peta Menjadi Premium Dark Mode */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
            />
            
            {/* Pemetaan Pin Lokasi */}
            {filteredBanjars.map((banjar: any) => (
              <Marker key={banjar.id} position={[banjar.lat, banjar.lng]}>
                <Popup>
                  <div className="text-center p-1 w-44">
                    <img src={`https://images.unsplash.com/${banjar.img}?w=240&h=120&fit=crop`} alt={banjar.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                    <h3 className="font-bold text-sm text-[#1E1208] mb-0.5">{banjar.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-2">{banjar.kota}, {banjar.negara}</p>
                    <Link href={`/banjar/${banjar.id}`} className="block w-full py-1.5 rounded text-xs font-bold text-white text-center transition-opacity hover:opacity-90" style={{ backgroundColor: "#7B2D1E" }}>
                      Lihat Profil
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* ========================================== */}
        {/* PANEL KANAN: LIST CARD DAFTAR BANJAR */}
        {/* ========================================== */}
        <div className="w-96 flex flex-col hidden lg:flex shadow-2xl z-10" style={{ background: "#FAF4EC", borderLeft: "1px solid rgba(123,45,30,0.1)" }}>
          
          <div className="p-6 border-b" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
            <h2 className="font-bold text-xl mb-1" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
              Daftar Banjar
            </h2>
            <p className="text-xs" style={{ color: "#7A6555" }}>
              Menampilkan <strong style={{ color: "#7B2D1E" }}>{filteredBanjars.length}</strong> komunitas adat terdaftar.
            </p>
          </div>

          {/* Iterasi Card Banjar */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
            {filteredBanjars.length > 0 ? (
              filteredBanjars.map((b: any) => (
                <div key={b.id} className="p-3 rounded-2xl border transition-all hover:shadow-md bg-white" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                  <div className="flex gap-3">
                    <img src={`https://images.unsplash.com/${b.img}?w=100&h=100&fit=crop`} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt={b.name} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[#1E1208] truncate">{b.name}</h3>
                      <div className="text-[10px] text-[#7A6555] flex items-center gap-1 mt-1 mb-2">
                        <MapPin size={10} /> {b.kota}, {b.negara}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#C9861A" }}>
                          <Star size={10} fill="#C9861A" /> {b.rating}
                        </span>
                        <span className="text-[10px] font-semibold text-[#7B2D1E]">{b.members} KK</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-sm style={{ color: '#7A6555' }}">
                Tidak ada data banjar di wilayah ini.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { MapPin, Save, Navigation, AlertCircle, Link as LinkIcon, ExternalLink } from "lucide-react";
// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout"; 

export default function PetaAdmin() {
  const { banjar }: any = usePage().props;

  const [detecting, setDetecting] = useState(false);

  // Ambil koordinat awal dari database
  const initialLat = String(banjar?.latitude || "");
  const initialLng = String(banjar?.longitude || "");
  
  // Jika di database belum ada link tapi sudah ada koordinat, buatkan otomatis!
  const initialLink = String(
    banjar?.link_peta || 
    (initialLat && initialLng ? `https://www.google.com/maps/search/?api=1&query=${initialLat},${initialLng}` : "")
  );

  // Inisialisasi state form 
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    lat: initialLat,
    lng: initialLng,
    link_peta: initialLink, 
  });

  // Fungsi 1: Deteksi lokasi otomatis dari GPS
  const handleDetect = () => {
    setDetecting(true);
    
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur Geolocation.");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedLat = position.coords.latitude.toString();
        const detectedLng = position.coords.longitude.toString();
        const autoGoogleMapsLink = `https://www.google.com/maps/search/?api=1&query=${detectedLat},${detectedLng}`;

        setData(prevData => ({
          ...prevData,
          lat: detectedLat,
          lng: detectedLng,
          link_peta: autoGoogleMapsLink
        }));
        
        setDetecting(false);
      },
      (error) => {
        alert("Gagal mengambil lokasi. Pastikan Anda memberikan izin akses (Allow) lokasi pada browser.");
        console.error(error);
        setDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Fungsi 2: Sinkronisasi Angka -> Link
  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    const newLat = field === 'lat' ? value : data.lat;
    const newLng = field === 'lng' ? value : data.lng;
    
    setData(prev => ({
      ...prev,
      [field]: value,
      link_peta: (newLat && newLng) ? `https://www.google.com/maps/search/?api=1&query=${newLat},${newLng}` : prev.link_peta
    }));
  };

  // Fungsi 3: Sinkronisasi Link -> Angka (Ekstrak otomatis)
  const handleLinkChange = (value: string) => {
    let extractedLat = data.lat;
    let extractedLng = data.lng;

    // Rumus mencari kordinat dari link panjang Google Maps
    const regexAt = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const regexQuery = /query=(-?\d+\.\d+),(-?\d+\.\d+)/;

    const match = value.match(regexAt) || value.match(regexQuery);
    
    if (match) {
      extractedLat = match[1];
      extractedLng = match[2];
    }

    setData(prev => ({
      ...prev,
      link_peta: value,
      lat: extractedLat,
      lng: extractedLng
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    patch('/admin/peta/update', {
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Koordinat Peta</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Tentukan lokasi banjar dan tautan Google Maps</p>
        </div>

        {/* Map preview yang BISA DI-KLIK */}
        <a 
          href={data.link_peta || "#"} 
          target={data.link_peta ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="block relative rounded-3xl overflow-hidden group cursor-pointer border border-transparent hover:border-[#C9861A] transition-all" 
          style={{ height: 300, background: "#D4C9B8" }}
          title={data.link_peta ? "Klik untuk buka di Google Maps" : "Isi link terlebih dahulu"}
        >
          <img src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=400&fit=crop&auto=format" alt="Peta" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
          
          {/* Lapisan hover agar terlihat bisa diklik */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl border-2 border-white transform group-hover:-translate-y-2 transition-transform" style={{ background: "#7B2D1E" }}>
                <MapPin size={18} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(250,244,236,0.95)", backdropFilter: "blur(8px)", color: "#1E1208" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {data.lat || "-"}, {data.lng || "-"}
            </span>
          </div>
          
          {/* Indikator klik */}
          {data.link_peta && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#2563EB", color: "#FFFFFF" }}>
              <ExternalLink size={12} /> Buka Peta
            </div>
          )}
        </a>

        {/* Tombol GPS */}
        <div className="flex justify-end">
          <button type="button" onClick={handleDetect} disabled={detecting} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-70 cursor-pointer" style={{ background: "#FAF4EC", border: "1px solid rgba(201,134,26,0.4)", color: "#7B2D1E" }}>
            <Navigation size={14} className={detecting ? "animate-spin" : ""} />
            {detecting ? "Mendeteksi GPS..." : "Gunakan Lokasiku"}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Data Lokasi Banjar</h2>
            
            {/* Input Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Latitude</label>
                <input 
                  type="text" 
                  value={data.lat} 
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)} 
                  placeholder="-8.650000" 
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm focus:ring-1 focus:ring-[#7B2D1E] transition-shadow" 
                  style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)", fontFamily: "'JetBrains Mono', monospace" }} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Longitude</label>
                <input 
                  type="text" 
                  value={data.lng} 
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)} 
                  placeholder="115.216667" 
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm focus:ring-1 focus:ring-[#7B2D1E] transition-shadow" 
                  style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)", fontFamily: "'JetBrains Mono', monospace" }} 
                />
              </div>
            </div>

            {/* Input Link Google Maps */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: "#3A2E24" }}>
                <LinkIcon size={12} /> Tautan Google Maps
              </label>
              <input 
                type="url" 
                value={data.link_peta} 
                onChange={(e) => handleLinkChange(e.target.value)} 
                placeholder="Paste link Google Maps di sini..." 
                className="w-full px-4 py-3 rounded-xl outline-none text-sm focus:ring-1 focus:ring-[#7B2D1E] transition-shadow" 
                style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)" }} 
              />
              
              {/* Link untuk tes buka peta */}
              {data.link_peta && (
                <div className="mt-2 pl-1">
                  <a 
                    href={data.link_peta} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                    style={{ color: "#2563EB" }}
                  >
                    <ExternalLink size={10} /> Test Buka Tautan Ini
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs" style={{ background: "rgba(201,134,26,0.08)", border: "1px solid rgba(201,134,26,0.2)" }}>
            <AlertCircle size={13} style={{ color: "#C9861A", flexShrink: 0 }} />
            <span style={{ color: "#7A6555" }}>Anda bisa mengetik kordinat, memakai GPS, atau langsung mem-paste Tautan Google Maps yang panjang.</span>
          </div>

          <button type="submit" disabled={processing} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all cursor-pointer" style={{ background: recentlySuccessful ? "#4A6741" : "#C9861A", color: "#1E1208" }}>
            <Save size={14} />
            {recentlySuccessful ? "Data Tersimpan!" : "Simpan Lokasi"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { MapPin, Save, Navigation, AlertCircle } from "lucide-react";
import AdminLayout from "../../Layouts/AdminLayout"; 

export default function PetaAdmin() {
  const { banjar }: any = usePage().props; // Data diambil dari Laravel
  const [detecting, setDetecting] = useState(false);

  // Gunakan useForm agar data tersimpan ke database
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    lat: String(banjar.lat || ""),
    lng: String(banjar.lng || ""),
  });

  const handleDetect = () => {
    setDetecting(true);
    // Simulasi deteksi lokasi (bisa pakai navigator.geolocation asli nanti)
    setTimeout(() => {
      setData({ lat: "-8.6890", lng: "115.2140" });
      setDetecting(false);
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    patch('/admin/peta/update');
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Koordinat Peta</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Tentukan lokasi banjar di peta interaktif</p>
        </div>

        {/* Map preview */}
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 300, background: "#D4C9B8" }}>
          <img src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=400&fit=crop&auto=format" alt="Peta" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl border-2 border-white" style={{ background: "#7B2D1E" }}>
                <MapPin size={18} className="text-white" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(250,244,236,0.95)", backdropFilter: "blur(8px)", color: "#1E1208" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{data.lat}, {data.lng}</span>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={handleDetect} disabled={detecting} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity" style={{ background: "rgba(250,244,236,0.95)", color: "#7B2D1E" }}>
              <Navigation size={12} className={detecting ? "animate-spin" : ""} />
              {detecting ? "Mendeteksi..." : "Gunakan Lokasiku"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Input Koordinat Manual</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Latitude</label>
                <input type="text" value={data.lat} onChange={(e) => setData('lat', e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)", fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Longitude</label>
                <input type="text" value={data.lng} onChange={(e) => setData('lng', e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)", fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs" style={{ background: "rgba(201,134,26,0.08)", border: "1px solid rgba(201,134,26,0.2)" }}>
            <AlertCircle size={13} style={{ color: "#C9861A" }} />
            <span style={{ color: "#7A6555" }}>Pastikan koordinat tepat agar muncul di peta publik.</span>
          </div>

          <button type="submit" disabled={processing} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all" style={{ background: recentlySuccessful ? "#4A6741" : "#C9861A", color: "#1E1208" }}>
            <Save size={14} />
            {recentlySuccessful ? "Koordinat Tersimpan!" : "Simpan Koordinat"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
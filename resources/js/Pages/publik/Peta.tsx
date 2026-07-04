import { useState } from "react";
import { Link } from "@inertiajs/react";
import { MapPin, Search } from "lucide-react";

// Data sementara langsung ditaruh di sini agar tidak error mencari file eksternal
const PINS = [
  { id: "1", x: "32%", y: "62%", name: "Denpasar", color: "#7B2D1E", count: 312 },
  { id: "4", x: "50%", y: "40%", name: "Ubud", color: "#4A6741", count: 241 },
];

export default function Peta() {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  // Menggunakan tipe any agar TypeScript tidak protes
  const activePin = PINS.find((p: any) => p.id === selectedPin);

  return (
    <div className="pt-16 min-h-screen text-[#FDF8F2]" style={{ background: "#1E1208" }}>
      <div className="h-[calc(100vh-4rem)] flex relative overflow-hidden">
        
        {/* Sidebar Peta */}
        <div className="w-1/3 p-8 bg-[#2A231C] border-r border-[#3D352E] z-10 flex flex-col">
          <h1 className="text-3xl font-bold mb-6 text-[#C9861A] flex items-center gap-3">
            <MapPin size={32} /> Peta Banjar
          </h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama banjar atau kabupaten..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1E1208] border border-[#3D352E] outline-none focus:border-[#C9861A] transition-colors"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
             <p className="text-gray-400 text-sm mb-4">Pilih titik pada peta untuk melihat detailnya.</p>
             
             {/* Render list pin di sidebar (Menyelesaikan error parameter 'b') */}
             <div className="space-y-2">
                {PINS.map((b: any) => (
                    <div key={b.id} className="p-3 bg-[#1E1208] rounded-lg border border-[#3D352E]">
                        {b.name} - {b.count} Warga
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Area Peta (Mockup) */}
        <div className="flex-1 relative bg-[#1E1208] flex items-center justify-center">
            <p className="text-gray-500 opacity-50">Area Visual Peta Interaktif</p>
        </div>

      </div>
    </div>
  );
}
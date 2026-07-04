import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { MapPin, Search, Filter, Star } from "lucide-react";

// Ganti BANJAR_LIST dengan data dari API atau tetap gunakan import data sementara
import { BANJAR_LIST } from "../../data"; 

const PINS = [
  { id: "1", x: "32%", y: "62%", name: "Denpasar", color: "#7B2D1E", count: 312 },
  { id: "4", x: "50%", y: "40%", name: "Ubud", color: "#4A6741", count: 241 },
  // ... (tambahkan pin lainnya)
];

export default function Peta() {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const activePin = PINS.find((p) => p.id === selectedPin);

  return (
    <div className="pt-16 min-h-screen" style={{ background: "#1E1208" }}>
      <div className="h-[calc(100vh-4rem)] flex">
        <div className="flex-1 relative overflow-hidden">
          {/* Map Image & Pins logic tetap seperti sebelumnya */}
          {PINS.map((pin) => (
            <button key={pin.id} className="absolute" style={{ left: pin.x, top: pin.y }} onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}>
              <div className="w-6 h-6 rounded-full bg-orange-800" />
            </button>
          ))}
        </div>

        {/* Right Panel: Filtered List */}
        <div className="w-80 bg-[#FAF4EC] overflow-y-auto">
          <div className="p-4 border-b border-orange-900/10">
            <h2 className="font-bold text-base">{selectedPin ? (activePin?.name ?? "Daftar Banjar") : "Daftar Banjar"}</h2>
          </div>
          <div className="p-3 space-y-2">
            {BANJAR_LIST
              .filter((b) => !selectedPin || b.kabupaten.toLowerCase().includes(activePin?.name.toLowerCase() ?? ""))
              .map((b) => (
                <Link key={b.id} to={`/banjar/${b.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5EDE0] hover:shadow-md transition-all">
                  <div className="text-xs font-semibold">{b.name}</div>
                </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
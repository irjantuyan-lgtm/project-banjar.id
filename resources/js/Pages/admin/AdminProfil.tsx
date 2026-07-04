import { useState } from "react";
import { Save } from "lucide-react";

export default function AdminProfil() {
  const [form, setForm] = useState({ name: "", negara: "ID" });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6 p-8 bg-[#2A231C] min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-[#FDF8F2]">Profil & Kontak</h1>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Dropdown Wilayah - Menggunakan Select Bawaan HTML */}
        <div className="grid grid-cols-3 gap-4">
          <select
            value={form.negara}
            onChange={(e: any) => setForm({ ...form, negara: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#1E1208] border border-[#3D352E] text-[#FDF8F2] outline-none focus:border-[#C9861A]"
          >
            <option value="ID">Indonesia</option>
            <option value="MY">Malaysia</option>
          </select>
        </div>

        <input
          className="w-full px-4 py-3 rounded-xl bg-[#1E1208] border border-[#3D352E] text-[#FDF8F2] outline-none focus:border-[#C9861A] placeholder-gray-500"
          placeholder="Nama Banjar"
          value={form.name}
          onChange={(e: any) => setForm({ ...form, name: e.target.value })}
        />

        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 text-[#1E1208]"
          style={{ background: saved ? "#86B87E" : "#C9861A" }}
        >
          <Save size={18} />
          {saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
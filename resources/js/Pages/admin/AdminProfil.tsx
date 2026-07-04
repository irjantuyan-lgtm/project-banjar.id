import { useState } from "react";
import { Save, Camera } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function AdminProfil() {
  const [form, setForm] = useState({ name: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profil & Kontak</h1>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Dropdown Wilayah */}
        <div className="grid grid-cols-3 gap-4">
          <Select>
            <SelectTrigger className="bg-[#EFE6D8] border-0">
              <SelectValue placeholder="Negara" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ID">Indonesia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <input
          className="w-full px-4 py-3 rounded-xl bg-[#EFE6D8]"
          placeholder="Nama Banjar"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: saved ? "#4A6741" : "#C9861A" }}
        >
          {saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
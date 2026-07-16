import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Save, Camera } from "lucide-react";
import AdminLayout from "../../Layouts/AdminLayout";
// Ganti semua import Select di atas dengan ini:
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/select";

export default function AdminProfil() {
  // Mengambil data dari controller Laravel
  const { banjar }: any = usePage().props;

  // Form untuk Laravel Inertia
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    name: banjar?.name || "",
    deskripsi: banjar?.deskripsi || "",
    phone: banjar?.phone || "",
    email: banjar?.email || "",
    adminName: banjar?.adminName || "",
    negara: banjar?.negara || "",
    provinsi: banjar?.provinsi || "",
    kota: banjar?.kota || "",
  });

  // --- LOGIKA DROPDOWN ---
  const [daftarNegara] = useState([
    { id: "ID", nama: "Indonesia" }, 
    { id: "MY", nama: "Malaysia" }, 
    { id: "AU", nama: "Australia" }
  ]);
  const [daftarProvinsi, setDaftarProvinsi] = useState<{ id: string; nama: string }[]>([]);
  const [daftarKota, setDaftarKota] = useState<{ id: string; nama: string }[]>([]);

  useEffect(() => {
    if (data.negara === "ID") setDaftarProvinsi([{ id: "BALI", nama: "Bali" }, { id: "DKI", nama: "DKI Jakarta" }]);
    else if (data.negara === "AU") setDaftarProvinsi([{ id: "NSW", nama: "New South Wales" }]);
    else setDaftarProvinsi([]);
  }, [data.negara]);

  useEffect(() => {
    if (data.provinsi === "BALI") setDaftarKota([{ id: "DPS", nama: "Denpasar" }, { id: "GYR", nama: "Gianyar" }]);
    else if (data.provinsi === "NSW") setDaftarKota([{ id: "SYD", nama: "Sydney" }]);
    else setDaftarKota([]);
  }, [data.provinsi]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    patch("/admin/profil/update");
  };

  const field = (label: string, key: keyof typeof data, type = "text", multiline = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</label>
      {multiline ? (
        <textarea rows={4} value={data[key]} onChange={(e) => setData(key, e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none" style={{ background: "#EFE6D8", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "1.5px solid rgba(123,45,30,0.12)" }} />
      ) : (
        <input type={type} value={data[key]} onChange={(e) => setData(key, e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: "#EFE6D8", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "1.5px solid rgba(123,45,30,0.12)" }} />
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Profil & Kontak</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Informasi publik yang ditampilkan di halaman banjar</p>
        </div>

        {/* Foto Banjar */}
        <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Foto Banjar</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#E8DACC" }}>
              <img src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=200&h=160&fit=crop" alt="Foto banjar" className="w-full h-full object-cover" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5" style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E" }}>
              <Camera size={13} /> Ganti Foto
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-2xl space-y-4" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "#1E1208" }}>Informasi Banjar</h2>
            {field("Nama Banjar", "name")}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Negara</label>
                <Select value={data.negara} onValueChange={(v: any) => setData('negara', v)}>
                  <SelectTrigger className="w-full px-4 py-3 h-auto rounded-xl border-0" style={{ background: "#EFE6D8", border: "1.5px solid rgba(123,45,30,0.12)" }}>
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    {daftarNegara.map((n) => <SelectItem key={n.id} value={n.id}>{n.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Provinsi</label>
                <Select value={data.provinsi} onValueChange={(v: any) => setData('provinsi', v)} disabled={!data.negara}>
                  <SelectTrigger className="w-full px-4 py-3 h-auto rounded-xl border-0" style={{ background: "#EFE6D8", border: "1.5px solid rgba(123,45,30,0.12)" }}>
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    {daftarProvinsi.map((p) => <SelectItem key={p.id} value={p.id}>{p.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Kota/Kabupaten</label>
                <Select value={data.kota} onValueChange={(v: any) => setData('kota', v)} disabled={!data.provinsi}>
                  <SelectTrigger className="w-full px-4 py-3 h-auto rounded-xl border-0" style={{ background: "#EFE6D8", border: "1.5px solid rgba(123,45,30,0.12)" }}>
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    {daftarKota.map((k) => <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {field("Deskripsi Banjar", "deskripsi", "text", true)}
          </div>

          <div className="p-5 rounded-2xl space-y-4" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "#1E1208" }}>Kontak</h2>
            {field("Nomor WhatsApp", "phone", "tel")}
            {field("Email", "email", "email")}
            {field("Nama Admin", "adminName")}
          </div>

          <button type="submit" disabled={processing} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all" style={{ background: recentlySuccessful ? "#4A6741" : "#C9861A", color: "#1E1208" }}>
            <Save size={14} /> {recentlySuccessful ? "Tersimpan!" : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
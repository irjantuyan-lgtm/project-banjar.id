import { useState } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Calendar, ShoppingBag, X } from "lucide-react";
import AdminLayout from "../../Layouts/AdminLayout";

type TabId = "kegiatan" | "umkm";

export default function AdminKonten() {
  const { kegiatan, umkm }: any = usePage().props;
  const [tab, setTab] = useState<TabId>("kegiatan");
  const [modal, setModal] = useState<"kegiatan" | "umkm" | null>(null);

  // Form untuk Kegiatan
  const kForm = useForm({ title: "", tanggal: "", type: "Upacara Adat" });
  // Form untuk UMKM
  const uForm = useForm({ name: "", kategori: "", phone: "" });

  const addKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    kForm.post("/admin/konten/kegiatan", { onSuccess: () => setModal(null) });
  };

  const addUMKM = (e: React.FormEvent) => {
    e.preventDefault();
    uForm.post("/admin/konten/umkm", { onSuccess: () => setModal(null) });
  };

  const deleteItem = (url: string) => {
    if (confirm("Yakin ingin menghapus?")) {
      router.delete(url);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Kegiatan & UMKM</h1>
            <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Kelola konten untuk profil banjar</p>
          </div>
          <button onClick={() => setModal(tab)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#C9861A] text-[#1E1208]">
            <Plus size={14} /> Tambah {tab === "kegiatan" ? "Kegiatan" : "UMKM"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-[#FAF4EC]">
          {([["kegiatan", `Kegiatan (${kegiatan.length})`], ["umkm", `UMKM (${umkm.length})`]] as [TabId, string][]).map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold" style={{ background: tab === id ? "#C9861A" : "transparent", color: tab === id ? "#1E1208" : "#7A6555" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Lists */}
        {tab === "kegiatan" ? (
          <div className="space-y-3">
            {kegiatan.map((k: any) => (
              <div key={k.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF4EC] border border-black/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/5"><Calendar size={16} className="text-[#7B2D1E]" /></div>
                <div className="flex-1"><div className="font-semibold text-sm">{k.title}</div><div className="text-xs text-[#7A6555]">{k.tanggal} · {k.type}</div></div>
                <button onClick={() => deleteItem(`/admin/konten/kegiatan/${k.id}`)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={13} className="text-[#C0392B]" /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {umkm.map((u: any) => (
              <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF4EC] border border-black/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C9861A]/10"><ShoppingBag size={16} className="text-[#C9861A]" /></div>
                <div className="flex-1"><div className="font-semibold text-sm">{u.name}</div><div className="text-xs text-[#7A6555]">{u.kategori} · {u.phone}</div></div>
                <button onClick={() => deleteItem(`/admin/konten/umkm/${u.id}`)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={13} className="text-[#C0392B]" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Tambah (Contoh Kegiatan) */}
        {modal === "kegiatan" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md rounded-3xl p-6 bg-[#FAF4EC]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-base" style={{ fontFamily: "'Libre Baskerville', serif" }}>Tambah Kegiatan</h3>
                <button onClick={() => setModal(null)}><X size={18} /></button>
              </div>
              <form onSubmit={addKegiatan} className="space-y-4">
                <input required value={kForm.data.title} onChange={(e) => kForm.setData('title', e.target.value)} className="w-full px-4 py-2.5 rounded-xl outline-none text-sm bg-[#EFE6D8]" placeholder="Nama Kegiatan" />
                <input type="date" required onChange={(e) => kForm.setData('tanggal', e.target.value)} className="w-full px-4 py-2.5 rounded-xl outline-none text-sm bg-[#EFE6D8]" />
                <button type="submit" className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#C9861A] text-[#1E1208]">Simpan</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
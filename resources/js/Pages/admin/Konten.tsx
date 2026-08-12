import { useState } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import { Plus, Trash2, Calendar, ShoppingBag, X, Pencil, MapPin, Image as ImageIcon } from "lucide-react";
// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout";

type TabId = "kegiatan" | "umkm";

export default function AdminKonten() {
  const { kegiatan = [], umkm = [] }: any = usePage().props;
  const [tab, setTab] = useState<TabId>("kegiatan");
  
  // State untuk Modal dan ID Edit
  const [modal, setModal] = useState<"kegiatan" | "umkm" | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  // 1. Form Kegiatan
  const kForm = useForm<any>({ 
    judul_kegiatan: "", 
    deskripsi: "", 
    tanggal: "",
    lokasi: "",
    foto_kegiatan: null,
    _method: "post" 
  });

  // 2. Form UMKM
  const uForm = useForm<any>({ 
    nama_usaha: "", 
    deskripsi_produk: "", 
    harga: "",
    no_wa_penjual: "",
    lokasi: "",
    foto_produk: null,
    _method: "post" 
  });

  // FUNGSI MEMBUKA MODAL 
  const openModal = (type: "kegiatan" | "umkm", data: any = null) => {
    setModal(type);
    if (data) {
      setEditId(data.id_kegiatan || data.id_umkm);
      if (type === "kegiatan") {
        kForm.setData({
          judul_kegiatan: data.judul_kegiatan,
          deskripsi: data.deskripsi || "",
          tanggal: data.tanggal || "",
          lokasi: data.lokasi || "",
          foto_kegiatan: null, 
        });
      } else {
        uForm.setData({
          nama_usaha: data.nama_usaha,
          deskripsi_produk: data.deskripsi_produk || "",
          harga: data.harga || "",
          no_wa_penjual: data.no_wa_penjual || "",
          lokasi: data.lokasi || "",
          foto_produk: null, 
        });
      }
    } else {
      setEditId(null);
      kForm.reset();
      uForm.reset();
    }
  };

  // FUNGSI SIMPAN KEGIATAN 
  const saveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      kForm.post(`/admin/kegiatan/${editId}`, { 
        forceFormData: true, 
        onSuccess: () => { setModal(null); kForm.reset(); setEditId(null); } 
      });
    } else {
      kForm.post("/admin/kegiatan", { 
        forceFormData: true, 
        onSuccess: () => { setModal(null); kForm.reset(); } 
      });
    }
  };

  // FUNGSI SIMPAN UMKM 
  const saveUMKM = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      uForm.post(`/admin/umkm/${editId}`, { 
        forceFormData: true, 
        onSuccess: () => { setModal(null); uForm.reset(); setEditId(null); } 
      });
    } else {
      uForm.post("/admin/umkm", { 
        forceFormData: true,
        onSuccess: () => { setModal(null); uForm.reset(); } 
      });
    }
  };

  // FUNGSI HAPUS DATA
  const deleteItem = (url: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      router.delete(url);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[900px] space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Kegiatan & UMKM</h1>
            <p className="text-base mt-2" style={{ color: "#8C7A6B" }}>Kelola konten yang akan ditampilkan di profil banjar</p>
          </div>
          <button onClick={() => openModal(tab)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm" style={{ background: "#C9861A", color: "#1E1208" }}>
            <Plus size={16} /> Tambah {tab === "kegiatan" ? "Kegiatan" : "UMKM"}
          </button>
        </div>

        {/* TABS */}
        <div className="flex p-1.5 rounded-full" style={{ background: "#FAF4EC" }}>
          {([["kegiatan", `Kegiatan (${kegiatan.length})`], ["umkm", `UMKM (${umkm.length})`]] as [TabId, string][]).map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} className="flex-1 py-3 rounded-full text-sm font-bold transition-all" style={{ background: tab === id ? "#C9861A" : "transparent", color: tab === id ? "#1E1208" : "#8C7A6B" }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* LIST KONTEN */}
        {tab === "kegiatan" ? (
          <div className="space-y-4">
            {kegiatan.map((k: any) => (
              <div key={k.id_kegiatan} className="flex items-center gap-4 p-5 rounded-[24px] border border-black/5 shadow-sm transition-all" style={{ background: "#FCF9F5" }}>
                <div className="w-12 h-12 rounded-2xl flex flex-shrink-0 items-center justify-center overflow-hidden" style={{ background: "#F4EBE1" }}>
                  {k.foto_kegiatan ? (
                     <img src={`/storage/${k.foto_kegiatan}`} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                     <Calendar size={20} className="text-[#8B5A44]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[16px] truncate" style={{ color: "#1E1208" }}>{k.judul_kegiatan}</div>
                  <div className="text-[13px] mt-1 flex flex-wrap gap-2 items-center" style={{ color: "#8C7A6B" }}>
                    <span>{k.tanggal || "Belum ada tanggal"}</span> 
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-[150px]"><MapPin size={12}/> {k.lokasi || "-"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">

                  {/* BADGE STATUS KEGIATAN (DIPERBAIKI AGAR MENGENALI 'rejected') */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ 
                    background: k.status_moderasi === 'approved' ? '#EBF0EB' 
                              : k.status_moderasi === 'pending' || k.status_moderasi === 'submitted' ? '#FFF9E6' 
                              : k.status_moderasi === 'rejected' ? '#FDE8E8' 
                              : '#FFF5E5', 
                    color: k.status_moderasi === 'approved' ? '#4A6741' 
                         : k.status_moderasi === 'pending' || k.status_moderasi === 'submitted' ? '#B7791F' 
                         : k.status_moderasi === 'rejected' ? '#C0392B' 
                         : '#C9861A' 
                  }}>
                    {k.status_moderasi === 'approved' ? 'Aktif' 
                     : (k.status_moderasi === 'pending' || k.status_moderasi === 'submitted' ? 'Menunggu Tinjauan' 
                     : k.status_moderasi === 'rejected' ? 'Ditolak' 
                     : 'Draft')}
                  </span>

                  <button onClick={() => openModal("kegiatan", k)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                    <Pencil size={18} className="text-[#8C7A6B]" />
                  </button>
                  
                  <button onClick={() => deleteItem(`/admin/kegiatan/${k.id_kegiatan}`)} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={18} className="text-[#C0392B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {umkm.map((u: any) => (
              <div key={u.id_umkm} className="flex items-center gap-4 p-5 rounded-[24px] border border-black/5 shadow-sm transition-all" style={{ background: "#FCF9F5" }}>
                <div className="w-12 h-12 rounded-2xl flex flex-shrink-0 items-center justify-center overflow-hidden" style={{ background: "#F4EBE1" }}>
                  {u.foto_produk ? (
                     <img src={`/storage/${u.foto_produk}`} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                     <ShoppingBag size={20} className="text-[#8B5A44]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[16px] truncate" style={{ color: "#1E1208" }}>{u.nama_usaha}</div>
                  <div className="text-[13px] mt-1 flex flex-wrap gap-2 items-center" style={{ color: "#8C7A6B" }}>
                    <span>{u.no_wa_penjual || "No WA belum diset"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-[150px]"><MapPin size={12}/> {u.lokasi || "-"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  
                  {/* BADGE STATUS UMKM (DIPERBAIKI AGAR MENGENALI 'rejected') */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ 
                    background: u.status_moderasi === 'approved' ? '#EBF0EB' 
                              : u.status_moderasi === 'pending' || u.status_moderasi === 'submitted' ? '#FFF9E6' 
                              : u.status_moderasi === 'rejected' ? '#FDE8E8' 
                              : '#FFF5E5', 
                    color: u.status_moderasi === 'approved' ? '#4A6741' 
                         : u.status_moderasi === 'pending' || u.status_moderasi === 'submitted' ? '#B7791F' 
                         : u.status_moderasi === 'rejected' ? '#C0392B' 
                         : '#C9861A' 
                  }}>
                    {u.status_moderasi === 'approved' ? 'Aktif' 
                     : (u.status_moderasi === 'pending' || u.status_moderasi === 'submitted' ? 'Menunggu Tinjauan' 
                     : u.status_moderasi === 'rejected' ? 'Ditolak' 
                     : 'Draft')}
                  </span>         
                 
                  <button onClick={() => openModal("umkm", u)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                    <Pencil size={18} className="text-[#8C7A6B]" />
                  </button>
                  
                  <button onClick={() => deleteItem(`/admin/umkm/${u.id_umkm}`)} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={18} className="text-[#C0392B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================== */}
        {/* MODAL FORM (UNTUK TAMBAH & EDIT KEDUANYA)            */}
        {/* ==================================================== */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] p-8 shadow-2xl relative border" style={{ background: "#FCF9F5", borderColor: "rgba(123,45,30,0.1)" }}>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
                  {editId ? 'Edit' : 'Tambah'} {modal === "kegiatan" ? 'Kegiatan' : 'UMKM'}
                </h3>
                <button onClick={() => { setModal(null); setEditId(null); }} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                  <X size={20} className="text-[#8C7A6B]" />
                </button>
              </div>

              {/* Form Kegiatan */}
              {modal === "kegiatan" && (
                <form onSubmit={saveKegiatan} className="space-y-4">
                  <input required value={kForm.data.judul_kegiatan} onChange={(e) => kForm.setData('judul_kegiatan', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" placeholder="Judul Kegiatan" />
                  
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                    <input value={kForm.data.lokasi} onChange={(e) => kForm.setData('lokasi', e.target.value)} className="w-full pl-11 pr-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" placeholder="Ketik nama tempat atau paste URL Maps..." />
                  </div>

                  <input type="date" value={kForm.data.tanggal} onChange={(e) => kForm.setData('tanggal', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" />
                  <textarea rows={3} value={kForm.data.deskripsi} onChange={(e) => kForm.setData('deskripsi', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors resize-none" placeholder="Deskripsi Kegiatan (Opsional)" />
                  
                  <div>
                    <label className="block text-xs font-bold mb-2 ml-1" style={{ color: "#8C7A6B" }}>
                      <ImageIcon size={14} className="inline mr-1" /> Upload Foto (Maks 2MB)
                    </label>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => kForm.setData('foto_kegiatan', e.target.files ? e.target.files[0] : null)} 
                      className="w-full px-4 py-3 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#C9861A] file:text-[#1E1208] hover:file:bg-[#b07517] cursor-pointer text-[#8C7A6B]" 
                    />
                  </div>

                  <button type="submit" disabled={kForm.processing} className="w-full py-4 mt-2 rounded-2xl text-sm font-bold shadow-md disabled:opacity-50 transition-all hover:opacity-90" style={{ background: "#C9861A", color: "#1E1208" }}>
                    {kForm.processing ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Kegiatan')}
                  </button>
                </form>
              )}

              {/* Form UMKM */}
              {modal === "umkm" && (
                <form onSubmit={saveUMKM} className="space-y-4">
                  <input required value={uForm.data.nama_usaha} onChange={(e) => uForm.setData('nama_usaha', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" placeholder="Nama Usaha UMKM" />
                  
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
                    <input value={uForm.data.lokasi} onChange={(e) => uForm.setData('lokasi', e.target.value)} className="w-full pl-11 pr-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" placeholder="Ketik nama tempat atau paste URL Maps..." />
                  </div>

                  <input type="number" value={uForm.data.harga} onChange={(e) => uForm.setData('harga', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" placeholder="Harga / Rentang Harga (Contoh: 15000)" />
                  <input type="text" value={uForm.data.no_wa_penjual} onChange={(e) => uForm.setData('no_wa_penjual', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors" placeholder="No. WhatsApp (08xxx)" />
                  <textarea rows={3} value={uForm.data.deskripsi_produk} onChange={(e) => uForm.setData('deskripsi_produk', e.target.value)} className="w-full px-5 py-3.5 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors resize-none" placeholder="Deskripsi Produk (Opsional)" />
                  
                  <div>
                    <label className="block text-xs font-bold mb-2 ml-1" style={{ color: "#8C7A6B" }}>
                      <ImageIcon size={14} className="inline mr-1" /> Upload Foto Produk/Warung
                    </label>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => uForm.setData('foto_produk', e.target.files ? e.target.files[0] : null)} 
                      className="w-full px-4 py-3 rounded-2xl outline-none text-sm bg-[#EFE6D8] border focus:border-[#C9861A] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#C9861A] file:text-[#1E1208] hover:file:bg-[#b07517] cursor-pointer text-[#8C7A6B]" 
                    />
                  </div>

                  <button type="submit" disabled={uForm.processing} className="w-full py-4 mt-2 rounded-2xl text-sm font-bold shadow-md disabled:opacity-50 transition-all hover:opacity-90" style={{ background: "#C9861A", color: "#1E1208" }}>
                    {uForm.processing ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan UMKM')}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
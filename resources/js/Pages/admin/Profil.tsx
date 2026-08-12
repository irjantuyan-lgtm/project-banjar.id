import React, { useEffect, useState, useRef } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Save, Camera, ChevronDown, Search } from "lucide-react";

// Import React Quill Baru yang ramah React 18
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout";

// ========================================================================
// KOMPONEN CUSTOM DROPDOWN (Bisa Diketik / Searchable)
// ========================================================================
function CustomDropdown({ label, value, options, onChange, disabled, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const selectedLabel = options.find((opt: any) => opt.value === value)?.label || placeholder;

  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </label>
      
      <div
        onClick={() => !disabled && setIsOpen(true)}
        className={`w-full px-4 py-3 rounded-xl outline-none text-sm flex justify-between items-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black/5'} ${isOpen ? 'ring-1 ring-[#7B2D1E]' : ''}`}
        style={{ background: "#EFE6D8", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "1.5px solid rgba(123,45,30,0.12)" }}
      >
        {isOpen ? (
          <div className="flex items-center gap-2 w-full">
            <Search size={14} style={{ color: "#7A6555" }} />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent outline-none placeholder-gray-500"
              placeholder="Ketik untuk mencari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : (
          <span className="truncate" style={{ fontWeight: value ? '600' : '400' }}>{selectedLabel}</span>
        )}
        
        <ChevronDown 
          size={16} 
          style={{ 
            color: "#7A6555", 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease-in-out',
            flexShrink: 0 
          }} 
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[999] w-full mt-1 bg-[#FAF4EC] rounded-xl shadow-lg border py-1 max-h-60 overflow-y-auto overscroll-contain" style={{ borderColor: "rgba(123,45,30,0.15)" }}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#7A6555] text-center italic">Memuat data...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#7A6555] text-center italic">Tidak ditemukan</div>
          ) : (
            filteredOptions.map((opt: any, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="px-4 py-2.5 text-sm cursor-pointer hover:bg-black/5 transition-colors"
                style={{ 
                  color: value === opt.value ? "#7B2D1E" : "#1E1208", 
                  fontWeight: value === opt.value ? "700" : "500", 
                  fontFamily: "'Plus Jakarta Sans', sans-serif" 
                }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
// ========================================================================

export default function AdminProfil() {
  const { auth, banjar }: any = usePage().props;
  
  const profileData = banjar || auth?.user || {};

  const [fotoPreview, setFotoPreview] = useState(profileData?.foto_url || "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=200&h=160&fit=crop");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
    foto_profil: null as File | null, 
    // PERBAIKAN: Menyesuaikan dengan nama kolom di database Anda (nama_banjar, no_wa_pengelola)
    name: profileData?.nama_banjar || profileData?.name || "", 
    deskripsi: profileData?.deskripsi || "",
    phone: profileData?.no_wa_pengelola || profileData?.phone || "",
    email: auth?.user?.email || profileData?.email || "",
    adminName: auth?.user?.name || profileData?.adminName || "",
    negara: profileData?.negara || "",
    provinsi: profileData?.provinsi || "",
    kota: profileData?.kota || profileData?.kabupaten || "",
  });

  const [daftarNegara, setDaftarNegara] = useState<any[]>([]);
  const [daftarProvinsi, setDaftarProvinsi] = useState<any[]>([]);
  const [daftarKota, setDaftarKota] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then((res) => res.json())
      .then((response) => {
        if (!response.error) setDaftarNegara(response.data);
      })
      .catch((err) => console.error("Gagal memuat negara:", err));
  }, []);

  useEffect(() => {
    if (data.negara) {
      fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: data.negara }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (!response.error && response.data?.states) setDaftarProvinsi(response.data.states);
          else setDaftarProvinsi([]);
        })
        .catch((err) => console.error("Gagal memuat provinsi:", err));
    } else {
      setDaftarProvinsi([]);
    }
  }, [data.negara]);

  useEffect(() => {
    if (data.negara && data.provinsi) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: data.negara, state: data.provinsi }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (!response.error && response.data) setDaftarKota(response.data);
          else setDaftarKota([]);
        })
        .catch((err) => console.error("Gagal memuat kota:", err));
    } else {
      setDaftarKota([]);
    }
  }, [data.provinsi]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Gagal! Anda hanya diperbolehkan mengunggah file foto (JPG, PNG, WEBP).");
        e.target.value = "";
        return;
      }
      setData("foto_profil", file); 
      setFotoPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/profil/update", {
      forceFormData: true,
      preserveScroll: true,
      onError: (errs) => {
        alert("Gagal menyimpan: \n" + Object.values(errs).join('\n'));
      }
    });
  };

  const field = (label: string, key: keyof typeof data, type = "text") => (
    <div key={key}>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</label>
      <input type={type} value={data[key] as string} onChange={(e) => setData(key, e.target.value as any)} className="w-full px-4 py-3 rounded-xl outline-none text-sm focus:bg-white transition-colors" style={{ background: "#EFE6D8", color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif", border: (errors as any)[key] ? "1.5px solid #ef4444" : "1.5px solid rgba(123,45,30,0.12)" }} />
      {(errors as any)[key] && <p className="text-xs text-red-500 mt-1">{(errors as any)[key]}</p>}
    </div>
  );

  return (
    <AdminLayout>
      <style>{`
        /* Menyamakan warna toolbar Quill dengan tema */
        .ql-toolbar.ql-snow {
          background-color: #FAF4EC !important;
          border-color: rgba(123,45,30,0.12) !important;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        /* Menyamakan warna kotak ketik Quill */
        .ql-container.ql-snow {
          background-color: #EFE6D8 !important;
          border-color: rgba(123,45,30,0.12) !important;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1E1208;
          min-height: 120px;
        }
        .ql-editor.ql-blank::before {
          color: #7A6555;
          font-style: normal;
        }
      `}</style>

      <div className="max-w-2xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Profil & Kontak</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Informasi publik yang ditampilkan di halaman banjar</p>
        </div>

        {/* --- BAGIAN FOTO BANJAR --- */}
        <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Foto Banjar</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200" style={{ background: "#E8DACC" }}>
              <img src={fotoPreview} alt="Foto banjar" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-black/5 cursor-pointer" 
                style={{ borderColor: "rgba(123,45,30,0.2)", color: "#7B2D1E" }}
              >
                <Camera size={13} /> Ganti Foto
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFotoChange} 
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* --- FORM DATA --- */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-5 rounded-2xl space-y-4" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "#1E1208" }}>Informasi Banjar</h2>
            {field("Nama Banjar", "name")}

            {/* --- BAGIAN WILAYAH GLOBAL --- */}
            <div className="grid grid-cols-3 gap-4">
              
              <CustomDropdown 
                label="Negara"
                placeholder="Pilih Negara..."
                value={data.negara}
                onChange={(val: string) => setData(prev => ({ ...prev, negara: val, provinsi: "", kota: "" }))}
                options={daftarNegara.map(n => ({ value: n.name, label: n.name }))}
                disabled={daftarNegara.length === 0}
              />

              <CustomDropdown 
                label="Provinsi / State"
                placeholder={daftarProvinsi.length === 0 && data.negara ? "Memuat..." : "Pilih Provinsi..."}
                value={data.provinsi}
                disabled={!data.negara || daftarProvinsi.length === 0}
                onChange={(val: string) => setData(prev => ({ ...prev, provinsi: val, kota: "" }))}
                options={daftarProvinsi.map(p => ({ value: p.name, label: p.name }))}
              />

              <CustomDropdown 
                label="Kota / Kabupaten"
                placeholder={daftarKota.length === 0 && data.provinsi ? "Memuat..." : "Pilih Kota..."}
                value={data.kota}
                disabled={!data.provinsi || daftarKota.length === 0}
                onChange={(val: string) => setData('kota', val as never)}
                options={daftarKota.map(k => ({ value: k, label: k }))}
              />

            </div>

            {/* PENGGUNAAN REACT QUILL UNTUK DESKRIPSI */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Deskripsi Banjar
              </label>
              <ReactQuill 
                theme="snow" 
                value={data.deskripsi} 
                onChange={(val) => setData("deskripsi", val)} 
                placeholder="Ceritakan sedikit tentang banjar Anda..."
              />
              {(errors as any).deskripsi && <p className="text-xs text-red-500 mt-1">{(errors as any).deskripsi}</p>}
            </div>
          </div>

          <div className="p-5 rounded-2xl space-y-4" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm" style={{ color: "#1E1208" }}>Kontak</h2>
            {field("Nomor WhatsApp", "phone", "tel")}
            {field("Email", "email", "email")}
            {field("Nama Admin", "adminName")}
          </div>

          <button type="submit" disabled={processing} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all cursor-pointer" style={{ background: recentlySuccessful ? "#4A6741" : "#C9861A", color: "#1E1208" }}>
            <Save size={14} /> {processing ? "Menyimpan..." : recentlySuccessful ? "Tersimpan!" : "Simpan Perubahan"}
          </button>
        </form>

      </div>
    </AdminLayout>
  );
}
import React, { useState } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import {
  MapPin, CheckCircle, Building2,
  Lock, ChevronRight, ArrowLeft, Search, Users
} from "lucide-react";

interface Banjar {
  id?: number;
  id_banjar?: number;
  nama_banjar: string;
  kota: string;
  provinsi: string;
  negara: string;
  foto_profil?: string;
  kode_verifikasi?: string;
}

export default function GabungBanjar({ banjars = [] }: { banjars: Banjar[] }) {
  const { translations }: any = usePage().props;
  const t = (key: string) => translations?.[key] || key;

  // Transform data sebelum di post: 
  // Jika ID kosong = Warga. Jika terisi = Anggota Banjar.
  const { data, setData, post, processing, errors, transform } = useForm({
    role: "warga", 
    selectedBanjarId: "",
    inviteCode: "",
  });

  transform((data) => ({
    ...data,
    role: data.selectedBanjarId === "" ? "warga" : "anggota_banjar",
  }));

  const [banjarSearch, setBanjarSearch] = useState("");

  const filteredBanjar = banjars.filter((b) => {
    const namaBanjar = b.nama_banjar || "";
    const kotaBanjar = b.kota || "";
    return (
      !banjarSearch || 
      namaBanjar.toLowerCase().includes(banjarSearch.toLowerCase()) ||
      kotaBanjar.toLowerCase().includes(banjarSearch.toLowerCase())
    );
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/gabung-banjar");
  };

  // Membatalkan sesi Google (Logout & Kembali ke awal)
  const handleBack = () => {
    router.post("/batal-gabung");
  };

  const accentColor = "#4A6741"; // Warna hijau warga persis seperti Register.tsx
  const steps = [t("Data Diri (Google)"), t("Pilih Banjar"), t("Selesai")];

  return (
    <Layout step={2} totalSteps={3} stepLabels={steps} onBack={handleBack} accentColor={accentColor} t={t}>
      <StepHeader icon={MapPin} title={t("Pilih Banjar")} subtitle={t("Pilih banjar asal Anda (opsional)")} color={accentColor} />
      
      <form onSubmit={submit}>
        <div className="space-y-3">
          {/* Kolom Pencarian */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors focus-within:bg-white" style={{ background: "#EFE6D8", border: "1.5px solid rgba(123,45,30,0.12)" }}>
            <Search size={14} style={{ color: "#7A6555" }} />
            <input 
              value={banjarSearch} 
              onChange={(e) => setBanjarSearch(e.target.value)} 
              placeholder={t("Cari nama atau kabupaten...")} 
              className="flex-1 bg-transparent outline-none text-sm" 
              style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }} 
            />
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            
            {/* OPSI LEWATI - (Diposisikan sebagai list item persis Register.tsx) */}
            <button
              type="button"
              onClick={() => { setData({ ...data, selectedBanjarId: "", inviteCode: "" }); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all hover:bg-black/5"
              style={{ borderColor: data.selectedBanjarId === "" ? accentColor : "rgba(123,45,30,0.1)", background: data.selectedBanjarId === "" ? `${accentColor}08` : "transparent" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(123,45,30,0.06)" }}>
                <Users size={15} style={{ color: "#7A6555" }} />
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t("Lewati — pilih nanti")}</div>
                <div className="text-xs" style={{ color: "#7A6555" }}>{t("Anda bisa memilih banjar kapan saja")}</div>
              </div>
              {data.selectedBanjarId === "" && <CheckCircle size={16} className="ml-auto flex-shrink-0" style={{ color: accentColor }} />}
            </button>

            {/* LIST BANJAR */}
            {filteredBanjar.map((b: any) => {
              const banjarId = b.id_banjar || b.id;
              const isSelected = String(data.selectedBanjarId) === String(banjarId);
              
              let srcFoto = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=72&h=72&fit=crop&auto=format';
              if (b.foto_profil) {
                srcFoto = `/storage/${b.foto_profil}`; 
              }

              return (
                <button
                  type="button"
                  key={banjarId}
                  onClick={() => setData("selectedBanjarId", String(banjarId))}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all hover:bg-black/5"
                  style={{ 
                    borderColor: isSelected ? accentColor : "rgba(123,45,30,0.08)", 
                    background: isSelected ? `${accentColor}08` : "#FAF4EC" 
                  }}
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border" style={{ background: "#E8DACC", borderColor: "rgba(123,45,30,0.05)" }}>
                    <img 
                      src={srcFoto} 
                      alt={b.nama_banjar} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=72&h=72&fit=crop&auto=format'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {b.nama_banjar}
                    </div>
                    <div className="text-xs flex items-center gap-1 truncate" style={{ color: "#7A6555" }}>
                      <MapPin size={10} className="flex-shrink-0" />
                      <span className="truncate">{b.kota}, {b.provinsi}</span>
                    </div>
                  </div>
                  {isSelected && <CheckCircle size={16} className="flex-shrink-0" style={{ color: accentColor }} />}
                </button>
              );
            })}
          </div>

          {/* KOTAK KODE VERIFIKASI (MUNCUL JIKA BANJAR DIPILIH) */}
          {data.selectedBanjarId !== "" && (
            <div className="mt-4 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2" style={{ background: "rgba(74,103,65,0.08)", border: `1px solid ${accentColor}` }}>
              <Field label={t("Kode Undangan Banjar (Wajib)")} error={errors.inviteCode}>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7A6555" }} />
                  <input
                    type="text"
                    value={data.inviteCode}
                    onChange={(e) => setData("inviteCode", e.target.value.toUpperCase())}
                    placeholder="Contoh: BANJAR123"
                    className="w-full py-3 pl-10 pr-4 rounded-xl outline-none text-sm transition-colors focus:bg-white"
                    style={{ ...inputStyle, borderColor: errors.inviteCode ? '#ef4444' : undefined, textTransform: 'uppercase' }}
                  />
                </div>
              </Field>
              <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "#5A4A3A" }}>
                {t("*Masukkan kode rahasia yang diberikan oleh Admin Banjar Anda untuk bergabung secara resmi sebagai warga komunitas.")}
              </p>
            </div>
          )}

        </div>
        <NextButton processing={processing} color={accentColor} label={t("Lanjutkan")} t={t} />
      </form>
    </Layout>
  );
}

// ── KOMPONEN DUPLIKAT DARI REGISTER.TSX AGAR DESAIN 100% IDENTIK ──────────

function Layout({ children, step, totalSteps, stepLabels, onBack, accentColor = "#7B2D1E", hideBack = false, t }: any) {
  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE0" }}>
      {/* SIDEBAR */}
      <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #2A1208 0%, #7B2D1E 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            <circle cx="200" cy="300" r="180" stroke="#C9861A" strokeWidth="1" fill="none" />
            <circle cx="200" cy="300" r="120" stroke="#C9861A" strokeWidth="0.5" fill="none" />
            <path d="M200 100 L230 190 L320 190 L250 245 L275 335 L200 280 L125 335 L150 245 L80 190 L170 190Z" stroke="#C9861A" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(201,134,26,0.3)" }}>
              <MapPin size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
              banjar<span style={{ color: "#F0C060" }}>.id</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold mb-3 leading-snug" style={{ fontFamily: "'Libre Baskerville', serif", color: "#FDF8F2" }}>
            {t("Bergabung dengan")}<br />{t("Komunitas Banjar Global")}
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(253,248,242,0.6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("Daftarkan diri Anda dan mulai terhubung dengan ribuan banjar di seluruh dunia.")}
          </p>
          <div className="space-y-2">
            {stepLabels.map((lbl: string, i: number) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={lbl} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all" style={{ background: done ? "#4A6741" : active ? "#C9861A" : "rgba(255,255,255,0.1)", color: done || active ? "#fff" : "rgba(255,255,255,0.3)" }}>
                    {done ? <CheckCircle size={12} /> : s}
                  </div>
                  <span className="text-xs" style={{ color: active ? "#F0C060" : done ? "rgba(253,248,242,0.6)" : "rgba(253,248,242,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: active ? 600 : 400 }}>
                    {lbl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative z-10 p-10">
          <p className="text-xs" style={{ color: "rgba(253,248,242,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: "#C9861A" }}>Om</span> Swastiastu
          </p>
        </div>
      </div>

      {/* KONTEN */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#7B2D1E" }}>
              <MapPin size={12} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#7B2D1E" }}>
              banjar<span style={{ color: "#C9861A" }}>.id</span>
            </span>
          </Link>

          {/* Progress Mobile */}
          <div className="flex gap-1.5 mb-6 lg:hidden">
            {stepLabels.map((_: any, i: number) => (
              <div key={i} className="h-1 rounded-full flex-1 transition-all" style={{ background: i + 1 < step ? accentColor : i + 1 === step ? accentColor : "#E8DACC" }} />
            ))}
          </div>

          {!hideBack && (
            <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6 hover:opacity-70 transition-opacity" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ArrowLeft size={13} /> {t("Kembali")}
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

function StepHeader({ icon: Icon, title, subtitle, color }: any) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <h2 className="font-bold text-lg" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>{title}</h2>
        <p className="text-xs" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: "#C0392B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</p>}
    </div>
  );
}

function NextButton({ processing = false, color, label = "Lanjutkan", t }: any) {
  return (
    <button type="submit" disabled={processing} className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: color, color: color === "#C9861A" ? "#1E1208" : "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {processing ? t("Memproses...") : <>{t(label)} <ChevronRight size={15} /></>}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#EFE6D8",
  color: "#1E1208",
  border: "1.5px solid rgba(123,45,30,0.12)",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};
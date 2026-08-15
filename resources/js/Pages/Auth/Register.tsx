import React, { useState, useEffect, useRef } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import {
  MapPin, Eye, EyeOff, CheckCircle, Building2, User,
  Mail, Phone, Lock, ChevronRight, ArrowLeft, Search, Users, ChevronDown
} from "lucide-react";

// 1. IMPORT REACT QUILL & CSS-NYA
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type Role = "admin_banjar" | "warga";

// @ts-ignore
import PublicLayout from '../../Layouts/PublicLayout';

// ========================================================================
// KOMPONEN CUSTOM DROPDOWN
// ========================================================================
function CustomDropdown({ value, options, onChange, disabled, placeholder, t }: any) {
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
    <div className="relative w-full text-left" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(true)}
        className={`w-full px-4 h-12 rounded-xl outline-none text-sm flex justify-between items-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black/5'}`}
        style={{ 
          background: "#EFE6D8", 
          color: "#1E1208", 
          border: isOpen ? "1.5px solid #C9861A" : "1.5px solid rgba(123,45,30,0.12)", 
          fontFamily: "'Plus Jakarta Sans', sans-serif" 
        }}
      >
        {isOpen ? (
          <div className="flex items-center gap-2 w-full">
            <Search size={14} style={{ color: "#7A6555" }} />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent outline-none placeholder-gray-500"
              placeholder={t("Ketik untuk mencari...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        ) : (
          <span className="truncate" style={{ color: value ? "#1E1208" : "#7A6555", fontWeight: value ? "600" : "400" }}>
            {selectedLabel}
          </span>
        )}
        <ChevronDown size={16} style={{ color: "#7A6555", transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-[999] w-full top-full mt-1 bg-[#FAF4EC] rounded-xl shadow-xl border py-2 max-h-48 overflow-y-auto overscroll-contain" style={{ borderColor: "rgba(123,45,30,0.15)" }}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#7A6555] text-center italic">{t("Memuat data...")}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#7A6555] text-center italic">{t("Tidak ditemukan")}</div>
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
                style={{ color: value === opt.value ? "#7B2D1E" : "#1E1208", fontWeight: value === opt.value ? "700" : "500", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
// HALAMAN UTAMA REGISTER
// ========================================================================
export default function Register() {
  const { translations }: any = usePage().props;
  const t = (key: string) => translations?.[key] || key;
  
  // LOGIKA BARU: Warga jauh lebih singkat (Langsung Buat Password di Step 2)
  const STEP_LABELS: Record<Role, string[]> = {
    admin_banjar: [t("Pilih Peran"), t("Data Diri"), t("Info Banjar"), t("Verifikasi"), t("Selesai")],
    warga: [t("Pilih Peran"), t("Data Diri"), t("Buat Password"), t("Selesai")],
  };

  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  const [step, setStep] = useState(0); 
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Form data tanpa 'selectedBanjarId' dan 'inviteCode'
  const { data, setData, post, processing, errors, transform } = useForm({
    role: null as Role | null,
    name: "",      
    username: "",  
    email: "", 
    phone: "",
    banjarName: "", negara: "", provinsi: "", kota: "", kecamatan: "", deskripsi: "",
    password: "", 
    password_confirmation: "", 
    agree: false,
  });

  transform((data) => ({
    ...data,
    password: data.role === 'admin_banjar' ? 'AUTO_GENERATED_PWD' : data.password,
    password_confirmation: data.role === 'admin_banjar' ? 'AUTO_GENERATED_PWD' : data.password_confirmation,
  }));

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/iso")
      .then(res => res.json())
      .then(d => setCountries(d.data.map((c: any) => c.name)))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!data.negara) {
      setProvinces([]);
      setCities([]);
      return;
    }
    setLoadingProv(true);
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: data.negara }),
    })
      .then(res => res.json())
      .then(d => {
        setProvinces(d.data.states.map((s: any) => s.name));
        setCities([]);
        setLoadingProv(false);
      })
      .catch(() => setLoadingProv(false));
  }, [data.negara]);

  useEffect(() => {
    if (!data.negara || !data.provinsi) {
      setCities([]);
      return;
    }
    setLoadingCity(true);
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: data.negara, state: data.provinsi }),
    })
      .then(res => res.json())
      .then(d => {
        setCities(d.data || []);
        setLoadingCity(false);
      })
      .catch(() => setLoadingCity(false));
  }, [data.provinsi, data.negara]);

  const countryOptions = countries.map(c => ({ value: c, label: c }));
  const provinceOptions = provinces.map(p => ({ value: p, label: p }));
  const cityOptions = cities.map(c => ({ value: c, label: c }));

  const displayErrors = { ...localErrors, ...errors };
  const role = data.role!;
  const steps = role ? STEP_LABELS[role] : [t("Pilih Peran")];
  const totalSteps = role ? steps.length - 1 : 1;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    
    if (step === 1) {
      if (!data.name.trim()) e.name = t("Nama wajib diisi");
      if (!data.username.trim()) e.username = t("Username wajib diisi");
      if (!data.email.includes("@")) e.email = t("Email tidak valid");
      
      // Nomor WhatsApp HANYA divalidasi jika memilih Admin Banjar
      if (role === "admin_banjar" && data.phone.length < 9) {
        e.phone = t("Nomor WhatsApp tidak valid (Wajib untuk Admin)");
      }
    }
    
    if (step === 2) {
      if (role === "admin_banjar") {
        if (!data.banjarName.trim()) e.banjarName = t("Nama banjar wajib diisi");
        if (!data.kecamatan.trim()) e.kecamatan = t("Kecamatan wajib diisi");
      } else if (role === "warga") {
        if (data.password.length < 8) e.password = t("Minimal 8 karakter");
        if (data.password !== data.password_confirmation) e.password_confirmation = t("Password tidak cocok");
        if (!data.agree) e.agree = t("Setujui syarat & ketentuan");
      }
    }
    
    if (step === 3 && role === "admin_banjar") {
      if (!data.agree) e.agree = t("Setujui syarat & ketentuan");
    }
    
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else if (step === totalSteps - 1) {
      post('/register', {
        preserveScroll: true,
        onSuccess: () => setStep(totalSteps), 
        onError: (errs) => alert(Object.values(errs).flat().join('\n'))
      });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setData("role", null);
      setStep(0);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFinish = () => {
    router.visit(role === "admin_banjar" ? "/login" : "/");
  };

  const strengthScore = data.password.length === 0 ? 0
    : data.password.length < 6 ? 1
    : data.password.length < 10 ? 2
    : /[A-Z]/.test(data.password) && /\d/.test(data.password) ? 4 : 3;
  const strengthLabel = ["", t("Sangat Lemah"), t("Lemah"), t("Sedang"), t("Kuat")][strengthScore];
  const strengthColor = ["transparent", "#C0392B", "#E07070", "#C9861A", "#4A6741"][strengthScore];

  const accentColor = role === "admin_banjar" ? "#C9861A" : "#4A6741";

  // ── STEP 0: Role chooser ─────────────────────────────────────────────────
  if (step === 0 || !data.role) {
    return (
      <Layout step={0} totalSteps={1} stepLabels={[t("Pilih Peran")]} onBack={() => router.visit("/login")} t={t}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            {t("Buat Akun Baru")}
          </h1>
          <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("Pilih jenis akun yang ingin Anda buat")}
          </p>
        </div>

        <div className="space-y-4">
          <RoleCard
            icon={Building2}
            title={t("Admin Banjar")}
            subtitle={t("Daftarkan banjar baru dan kelola komunitas")}
            features={[t("Kelola profil banjar"), t("Input kegiatan & UMKM"), t("Submit konten ke pusat"), t("Akses dashboard admin")]}
            color="#C9861A"
            bg="rgba(201,134,26,0.06)"
            border="rgba(201,134,26,0.2)"
            onClick={() => { setData("role", "admin_banjar"); setStep(1); }}
          />
          <RoleCard
            icon={Users}
            title={t("Warga / Publik")}
            subtitle={t("Bergabung sebagai warga dan ikuti aktivitas banjar")}
            features={[t("Jelajah peta interaktif"), t("Riview dan Rating Banjar"), t("Ikuti kegiatan adat"), t("Hubungi UMKM lokal")]}
            color="#4A6741"
            bg="rgba(74,103,65,0.06)"
            border="rgba(74,103,65,0.2)"
            onClick={() => { setData("role", "warga"); setStep(1); }} 
          />
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {t("Sudah punya akun?")}{" "}
          <Link href="/login" className="font-semibold underline" style={{ color: "#7B2D1E" }}>{t("Masuk di sini")}</Link>
        </p>
      </Layout>
    );
  }

  // ── STEP 1: Data Diri ────────────────────────────────────────────────────
  if (step === 1) return (
    <Layout step={1} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor} t={t}>
      <StepHeader
        icon={User}
        title={t("Data Diri")}
        subtitle={t("Informasi akun pribadi Anda")}
        color={accentColor}
      />

      {/* FITUR LOGIN GOOGLE KHUSUS WARGA */}
      {role === "warga" && ( 
        <div className="mb-6">
          <a
            href="/auth/google"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-colors hover:bg-black/5 shadow-sm hover:shadow-md"
            style={{ borderColor: "rgba(123,45,30,0.15)", color: "#1E1208", background: "#FAF4EC" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.2 21.34 7.22 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.4l4.08-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.2 2.66 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
            </svg>
            <span className="font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Daftar Instan dengan Google")}
            </span>
          </a>
          
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-[#7A6555]" style={{ opacity: 0.2 }}></div>
            <span className="flex-shrink-0 mx-4 text-xs" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("atau isi form manual")}
            </span>
            <div className="flex-grow border-t border-[#7A6555]" style={{ opacity: 0.2 }}></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Field label={t("Nama Lengkap")} error={displayErrors.name}>
          <input
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="Contoh: I Wayan Sujana"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-colors focus:bg-black/5"
            style={{ ...inputStyle, borderColor: displayErrors.name ? '#ef4444' : undefined }}
          />
        </Field>

        <Field label={t("Username")} error={displayErrors.username}>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7A6555" }} />
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData("username", e.target.value.toLowerCase().replace(/\s/g, ''))} 
              placeholder="contoh_username123"
              className="w-full py-3 pl-10 pr-4 rounded-xl outline-none text-sm transition-colors focus:bg-black/5"
              style={{ ...inputStyle, borderColor: displayErrors.username ? '#ef4444' : undefined }}
            />
          </div>
        </Field>

        <Field label={t("Email")} error={displayErrors.email}>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7A6555" }} />
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="nama@email.com"
              className="w-full py-3 pl-10 pr-4 rounded-xl outline-none text-sm transition-colors focus:bg-black/5"
              style={{ ...inputStyle, borderColor: displayErrors.email ? '#ef4444' : undefined }}
            />
          </div>
        </Field>
        
        {role === "admin_banjar" && (
          <Field label={t("Nomor WhatsApp")} error={displayErrors.phone}>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7A6555" }} />
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="0812 3456 7890"
                className="w-full py-3 pl-10 pr-4 rounded-xl outline-none text-sm transition-colors focus:bg-black/5"
                style={{ ...inputStyle, borderColor: displayErrors.phone ? '#ef4444' : undefined }}
              />
            </div>
          </Field>
        )}

        {role === "admin_banjar" && (
          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(201,134,26,0.06)", border: "1px solid rgba(201,134,26,0.2)" }}>
            <p style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Akun Admin Banjar memerlukan verifikasi oleh Super Admin sebelum aktif. Anda akan menerima konfirmasi melalui email.")}
            </p>
          </div>
        )}
      </div>
      <NextButton onClick={handleNext} color={accentColor} t={t} />
    </Layout>
  );

  // ── STEP 2: Info Banjar (Admin) ATAU Buat Password (Warga) ─────────────────
  if (step === 2) {
    if (role === "admin_banjar") return (
      <Layout step={2} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor} t={t}>
        <StepHeader icon={Building2} title={t("Informasi Banjar Global")} subtitle={t("Data banjar yang ingin Anda daftarkan")} color={accentColor} />
        <div className="space-y-4">
          <Field label={t("Nama Banjar")} error={displayErrors.banjarName}>
            <input value={data.banjarName} onChange={(e) => setData("banjarName", e.target.value)} placeholder={t("Contoh: Banjar Kaja Sesetan")} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ ...inputStyle, borderColor: displayErrors.banjarName ? '#ef4444' : undefined }} />
          </Field>
          
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("Negara")}>
              <CustomDropdown
                t={t}
                placeholder={t("1. Pilih Negara...")}
                value={data.negara}
                options={countryOptions}
                onChange={(val: string) => { setData({ ...data, negara: val, provinsi: "", kota: "" }); }}
                disabled={countries.length === 0}
              />
            </Field>

            <Field label={t("Provinsi / State")}>
              <CustomDropdown
                t={t}
                placeholder={loadingProv ? t("Memuat...") : t("2. Pilih Provinsi...")}
                value={data.provinsi}
                options={provinceOptions}
                onChange={(val: string) => { setData({ ...data, provinsi: val, kota: "" }); }}
                disabled={loadingProv || !data.negara || provinceOptions.length === 0}
              />
            </Field>

            <Field label={t("Kabupaten / Kota")}>
              <CustomDropdown
                t={t}
                placeholder={loadingCity ? t("Memuat...") : t("3. Pilih Kota...")}
                value={data.kota}
                options={cityOptions}
                onChange={(val: string) => setData("kota", val)}
                disabled={loadingCity || !data.provinsi || cityOptions.length === 0}
              />
            </Field>
            
            <Field label={t("Kecamatan / Suburb")} error={displayErrors.kecamatan}>
              <input value={data.kecamatan} onChange={(e) => setData("kecamatan", e.target.value)} placeholder={t("Contoh: Denpasar Selatan")} className="w-full px-4 py-3 h-12 rounded-xl outline-none text-sm" style={{ ...inputStyle, borderColor: displayErrors.kecamatan ? '#ef4444' : undefined }} />
            </Field>
          </div>

          <Field label={t("Deskripsi Singkat (opsional)")}>
            <div className="bg-white rounded-xl overflow-hidden mb-12" style={{ border: "1.5px solid rgba(123,45,30,0.12)" }}>
              <ReactQuill 
                theme="snow"
                value={data.deskripsi}
                onChange={(content) => setData("deskripsi", content)}
                placeholder={t("Ceritakan sedikit tentang banjar Anda...")}
                className="h-32" 
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
              />
            </div>
          </Field>
          
          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(201,134,26,0.06)", border: "1px solid rgba(201,134,26,0.2)" }}>
            <p style={{ color: "#7A6555" }}>{t("Banjar akan tampil di peta setelah disetujui oleh Super Admin. Proses verifikasi 1–3 hari kerja.")}</p>
          </div>
        </div>
        <NextButton onClick={handleNext} color={accentColor} t={t} />
      </Layout>
    );

    // BILA WARGA, STEP 2 ADALAH BUAT PASSWORD DAN SETUJUI SYARAT
    return (
      <Layout step={2} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor} t={t}>
        <StepHeader icon={Lock} title={t("Buat Password")} subtitle={t("Amankan akun Anda dengan password yang kuat")} color={accentColor} />
        <div className="space-y-4">
          <Field label={t("Password")} error={displayErrors.password}>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={data.password} onChange={(e) => setData("password", e.target.value)} placeholder={t("Minimal 8 karakter")} className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11 focus:bg-black/5 transition-colors" style={{ ...inputStyle, borderColor: displayErrors.password ? '#ef4444' : undefined }} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                {showPass ? <EyeOff size={14} style={{ color: "#7A6555" }} /> : <Eye size={14} style={{ color: "#7A6555" }} />}
              </button>
            </div>
            {data.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= strengthScore ? strengthColor : "#E8DACC" }} />
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: strengthColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{strengthLabel}</p>
              </div>
            )}
          </Field>

          <Field label={t("Konfirmasi Password")} error={displayErrors.password_confirmation}>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                value={data.password_confirmation} 
                onChange={(e) => setData("password_confirmation", e.target.value)} 
                placeholder={t("Ulangi password")} 
                className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11 focus:bg-black/5 transition-colors" 
                style={{ ...inputStyle, borderColor: displayErrors.password_confirmation ? '#ef4444' : undefined }} 
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                {showConfirm ? <EyeOff size={14} style={{ color: "#7A6555" }} /> : <Eye size={14} style={{ color: "#7A6555" }} />}
              </button>
            </div>
          </Field>
        </div>

        <div className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setData("agree", !data.agree)}
              className="w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer hover:bg-black/5"
              style={{ borderColor: data.agree ? accentColor : "rgba(123,45,30,0.25)", background: data.agree ? accentColor : "transparent" }}
            >
              {data.agree && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className="text-xs leading-relaxed" style={{ color: "#5A4A3A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("Saya menyetujui")}{" "}
              <span className="underline cursor-pointer" style={{ color: "#7B2D1E" }}>{t("Syarat & Ketentuan")}</span>
              {" "}{t("dan")}{" "}
              <span className="underline cursor-pointer" style={{ color: "#7B2D1E" }}>{t("Kebijakan Privasi")}</span>
              {" "}banjar.id
            </span>
          </label>
          {displayErrors.agree && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{displayErrors.agree}</p>}
        </div>

        <NextButton onClick={handleNext} color={accentColor} label={t("Buat Akun")} processing={processing} t={t} />
      </Layout>
    );
  }

  // ── STEP 3: Persetujuan Admin Banjar ─────────────────────────────────────
  if (step === 3 && role === "admin_banjar") return (
    <Layout step={3} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor} t={t}>
      <StepHeader icon={Mail} title={t("Keamanan & Verifikasi")} subtitle={t("Sistem keamanan otomatis untuk Admin Banjar")} color={accentColor} />
      <div className="space-y-4">
        <div className="p-5 rounded-xl mb-4 text-sm" style={{ background: "rgba(201,134,26,0.06)", border: "1px solid rgba(201,134,26,0.2)" }}>
          <p style={{ color: "#7A6555", lineHeight: "1.6" }}>
            Demi menjaga keamanan dan keaslian data banjar, sistem kami akan <strong>membuatkan kata sandi acak</strong> secara otomatis.
            <br/><br/>
            Kata sandi tersebut akan dikirimkan ke email <strong>{data.email}</strong> tepat setelah pendaftaran Anda disetujui oleh Super Admin.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setData("agree", !data.agree)}
            className="w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer hover:bg-black/5"
            style={{ borderColor: data.agree ? accentColor : "rgba(123,45,30,0.25)", background: data.agree ? accentColor : "transparent" }}
          >
            {data.agree && <CheckCircle size={12} className="text-white" />}
          </div>
          <span className="text-xs leading-relaxed" style={{ color: "#5A4A3A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("Saya menyetujui")}{" "}
            <span className="underline cursor-pointer" style={{ color: "#7B2D1E" }}>{t("Syarat & Ketentuan")}</span>
            {" "}{t("dan")}{" "}
            <span className="underline cursor-pointer" style={{ color: "#7B2D1E" }}>{t("Kebijakan Privasi")}</span>
            {" "}banjar.id
          </span>
        </label>
        {displayErrors.agree && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{displayErrors.agree}</p>}
      </div>

      <NextButton onClick={handleNext} color={accentColor} label={t("Kirim Pendaftaran")} processing={processing} t={t} />
    </Layout>
  );

  // ── STEP 4: Success ───────────────────────────────────────────────────────
  if (step === totalSteps) {
    return (
      <Layout step={totalSteps} totalSteps={totalSteps} stepLabels={steps} onBack={() => {}} accentColor={accentColor} hideBack t={t}>
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${accentColor}15`, border: `2px solid ${accentColor}30` }}>
            <CheckCircle size={36} style={{ color: accentColor }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            {t("Akun Berhasil Dibuat!")}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {role === "admin_banjar"
              ? t("Permohonan Admin Banjar Anda sedang ditinjau oleh Super Admin.")
              : t("Selamat bergabung di banjar.id!")}
          </p>

          <div className="p-4 rounded-2xl text-left space-y-2.5 mb-6" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.1)" }}>
            {[
              { lbl: t("Nama"), val: data.name }, 
              { lbl: t("Username"), val: data.username },
              { lbl: t("Email"), val: data.email },
              { lbl: t("Peran"), val: role === "admin_banjar" ? t("Admin Banjar") : t("Warga / Publik") },
              ...(role === "admin_banjar" ? [{ lbl: t("Banjar"), val: `${data.banjarName} (${data.kota}, ${data.negara})` }] : []),
            ].map((r) => (
              <div key={r.lbl} className="flex justify-between gap-4">
                <span className="text-xs" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.lbl}</span>
                <span className="text-xs font-semibold text-right" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.val}</span>
              </div>
            ))}
          </div>

          {role === "admin_banjar" && (
            <div className="p-3 rounded-xl text-xs mb-4" style={{ background: "rgba(201,134,26,0.08)", border: "1px solid rgba(201,134,26,0.2)" }}>
              <p style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("Pemberitahuan persetujuan dan ")} <span style={{ color: "#C9861A", fontWeight: 600 }}>Password Anda</span> {t("akan dikirimkan secara otomatis ke ")} {data.email}.
              </p>
            </div>
          )}

          <button
            onClick={handleFinish}
            className="w-full py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: accentColor, color: role === "admin_banjar" ? "#1E1208" : "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {role === "admin_banjar" ? t("Kembali ke Halaman Login") : t("Mulai Jelajah")}
          </button>
        </div>
      </Layout>
    );
  }

  return null;
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function Layout({
  children, step, totalSteps, stepLabels, onBack, accentColor = "#7B2D1E", hideBack = false, t
}: {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  stepLabels: string[];
  onBack: () => void;
  accentColor?: string;
  hideBack?: boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE0" }}>
      <Head title={`${t("Buat Akun Baru")} | banjar.id`} />
      <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #2A1208 0%, #7B2D1E 100%)" }}>
        <div className="absolute inset-0 opacity-10">
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
          {step > 0 && (
            <div className="space-y-2">
              {stepLabels.slice(1).map((lbl, i) => {
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
          )}
        </div>
        <div className="relative z-10 p-10">
          <p className="text-xs" style={{ color: "rgba(253,248,242,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: "#C9861A" }}>Om</span> Swastiastu
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#7B2D1E" }}>
              <MapPin size={12} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#7B2D1E" }}>
              banjar<span style={{ color: "#C9861A" }}>.id</span>
            </span>
          </Link>

          {step > 0 && (
            <div className="flex gap-1.5 mb-6 lg:hidden">
              {stepLabels.slice(1).map((_, i) => (
                <div key={i} className="h-1 rounded-full flex-1 transition-all" style={{ background: i < step ? accentColor : i === step - 1 ? accentColor : "#E8DACC" }} />
              ))}
            </div>
          )}

          {!hideBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6 hover:opacity-70 transition-opacity" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ArrowLeft size={13} /> {t("Kembali")}
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, subtitle, features, color, bg, border, onClick }: {
  icon: React.ElementType; title: string; subtitle: string;
  features: string[]; color: string; bg: string; border: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full text-left p-5 rounded-2xl border-2 hover:shadow-lg transition-all duration-200 group focus:outline-none" style={{ background: bg, border: `2px solid ${border}` }}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1E1208" }}>{title}</h3>
            <ChevronRight size={16} style={{ color }} />
          </div>
          <p className="text-xs mt-0.5 mb-3" style={{ color: "#7A6555" }}>{subtitle}</p>
          <div className="grid grid-cols-2 gap-1">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-xs" style={{ color: "#5A4A3A" }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function StepHeader({ icon: Icon, title, subtitle, color }: { icon: React.ElementType; title: string; subtitle: string; color: string }) {
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: "#C0392B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</p>}
    </div>
  );
}

function NextButton({ onClick, color, label = "Lanjutkan", processing = false, t }: { onClick: () => void; color: string; label?: string, processing?: boolean, t: (k:string) => string }) {
  return (
    <button disabled={processing} onClick={onClick} className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: color, color: color === "#C9861A" ? "#1E1208" : "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
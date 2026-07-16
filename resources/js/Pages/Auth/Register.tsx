import { useState, useEffect } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import {
  MapPin, Eye, EyeOff, CheckCircle, Building2, User,
  Mail, Phone, Lock, ChevronRight, ArrowLeft, Search, Users,
} from "lucide-react";

type Role = "admin_banjar" | "anggota";

const STEP_LABELS: Record<Role, string[]> = {
  admin_banjar: ["Pilih Peran", "Data Diri", "Info Banjar", "Password", "Selesai"],
  anggota: ["Pilih Peran", "Data Diri", "Pilih Banjar", "Password", "Selesai"],
};

export default function Register() {
  const { banjarsData }: any = usePage().props;
  
  const BANJAR_LIST = banjarsData || [
    { id: "1", name: "Banjar Adat Kaja", kecamatan: "Denpasar Utara", kabupaten: "Denpasar", img: "photo-1537953773345-d172ccf13cf1", rating: 4.8 },
    { id: "2", name: "Banjar Penglipuran", kecamatan: "Bangli", kabupaten: "Bangli", img: "photo-1604665515776-0c5b9e11e6f2", rating: 4.9 },
    { id: "3", name: "Banjar Sydney", kecamatan: "Kensington", kabupaten: "Sydney", img: "photo-1512453979436-5a536909e91f", rating: 4.9 },
  ];

  // === STATE UNTUK API WILAYAH GLOBAL ===
  const [countries, setCountries] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  const [step, setStep] = useState(0); 
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [banjarSearch, setBanjarSearch] = useState("");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const { data, setData, post, processing, errors } = useForm({
    role: null as Role | null,
    fullName: "", email: "", phone: "",
    banjarName: "", negara: "", provinsi: "", kabupaten: "", kecamatan: "", deskripsi: "",
    selectedBanjarId: "",
    inviteCode: "", 
    password: "", confirm: "", agree: false,
  });

  // === LOGIKA FETCH API WILAYAH GLOBAL ===
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


  const displayErrors = { ...localErrors, ...errors };
  const role = data.role!;
  const steps = role ? STEP_LABELS[role] : ["Pilih Peran"];
  const totalSteps = role ? steps.length - 1 : 1;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!data.fullName.trim()) e.fullName = "Nama wajib diisi";
      if (!data.email.includes("@")) e.email = "Email tidak valid";
      if (data.phone.length < 9) e.phone = "Nomor WhatsApp tidak valid";
    }
    if (step === 2 && role === "admin_banjar") {
      if (!data.banjarName.trim()) e.banjarName = "Nama banjar wajib diisi";
      if (!data.kecamatan.trim()) e.kecamatan = "Kecamatan wajib diisi";
    }
    if (step === 2 && role === "anggota") {
      if (data.selectedBanjarId !== "" && !data.inviteCode.trim()) {
        e.inviteCode = "Kode Undangan wajib diisi untuk bergabung";
      }
    }
    if (step === 3) {
      if (data.password.length < 8) e.password = "Minimal 8 karakter";
      if (data.password !== data.confirm) e.confirm = "Password tidak cocok";
      if (!data.agree) e.agree = "Setujui syarat & ketentuan";
    }
    setLocalErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    // === SIMULASI PENGECEKAN KODE INSTAN ===
    if (step === 2 && role === "anggota" && data.selectedBanjarId !== "") {
      if (data.inviteCode !== "BANJAR123") {
        setLocalErrors({ inviteCode: "Kode Undangan tidak valid atau kadaluarsa." });
        return; 
      }
    }
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else if (step === totalSteps - 1) {
      post('/register', {
        preserveScroll: true,
        onSuccess: () => setStep(totalSteps), 
        onError: () => alert("Ada kesalahan validasi dari server. Silakan periksa kembali data Anda.")
      });
    }
  };

  // === PERBAIKAN LOGIKA TOMBOL KEMBALI ===
  const handleBack = () => {
    if (step === 1) {
      setData("role", null);
      setStep(0);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFinish = () => {
    router.visit(role === "admin_banjar" ? "/admin/dashboard" : "/");
  };

  const strengthScore = data.password.length === 0 ? 0
    : data.password.length < 6 ? 1
    : data.password.length < 10 ? 2
    : /[A-Z]/.test(data.password) && /\d/.test(data.password) ? 4 : 3;
  const strengthLabel = ["", "Sangat Lemah", "Lemah", "Sedang", "Kuat"][strengthScore];
  const strengthColor = ["transparent", "#C0392B", "#E07070", "#C9861A", "#4A6741"][strengthScore];

  const filteredBanjar = BANJAR_LIST.filter((b: any) =>
    !banjarSearch || b.name.toLowerCase().includes(banjarSearch.toLowerCase()) ||
    b.kecamatan.toLowerCase().includes(banjarSearch.toLowerCase())
  );

  // ── STEP 0: Role chooser ─────────────────────────────────────────────────
  if (step === 0 || !data.role) {
    return (
      <Layout step={0} totalSteps={1} stepLabels={["Pilih Peran"]} onBack={() => router.visit("/login")}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            Buat Akun Baru
          </h1>
          <p className="text-sm" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pilih jenis akun yang ingin Anda buat
          </p>
        </div>

        <div className="space-y-4">
          <RoleCard
            icon={Building2}
            title="Admin Banjar"
            subtitle="Daftarkan banjar baru dan kelola komunitas"
            features={["Kelola profil banjar", "Input kegiatan & UMKM", "Submit konten ke pusat", "Akses dashboard admin"]}
            color="#C9861A"
            bg="rgba(201,134,26,0.06)"
            border="rgba(201,134,26,0.2)"
            onClick={() => { setData("role", "admin_banjar"); setStep(1); }}
          />
          <RoleCard
            icon={Users}
            title="Anggota / Publik"
            subtitle="Bergabung sebagai warga dan ikuti aktivitas banjar"
            features={["Jelajah peta interaktif", "Simpan banjar favorit", "Ikuti kegiatan adat", "Hubungi UMKM lokal"]}
            color="#4A6741"
            bg="rgba(74,103,65,0.06)"
            border="rgba(74,103,65,0.2)"
            onClick={() => { setData("role", "anggota"); setStep(1); }}
          />
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold underline" style={{ color: "#7B2D1E" }}>Masuk di sini</Link>
        </p>
      </Layout>
    );
  }

  const accentColor = role === "admin_banjar" ? "#C9861A" : "#4A6741";

  // ── STEP 1: Data Diri ────────────────────────────────────────────────────
  if (step === 1) return (
    <Layout step={1} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor}>
      <StepHeader
        icon={User}
        title="Data Diri"
        subtitle="Informasi akun pribadi Anda"
        color={accentColor}
      />
      <div className="space-y-4">
        <Field label="Nama Lengkap" error={displayErrors.fullName}>
          <input
            value={data.fullName}
            onChange={(e) => setData("fullName", e.target.value)}
            placeholder="I Wayan Sujana"
            className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-colors focus:bg-black/5"
            style={{ ...inputStyle, borderColor: displayErrors.fullName ? '#ef4444' : undefined }}
          />
        </Field>
        <Field label="Email" error={displayErrors.email}>
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
        <Field label="Nomor WhatsApp" error={displayErrors.phone}>
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
        {role === "admin_banjar" && (
          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(201,134,26,0.06)", border: "1px solid rgba(201,134,26,0.2)" }}>
            <p style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Akun Admin Banjar memerlukan verifikasi oleh Super Admin sebelum aktif.
              Anda akan menerima konfirmasi melalui email.
            </p>
          </div>
        )}
      </div>
      <NextButton onClick={handleNext} color={accentColor} />
    </Layout>
  );

  // ── STEP 2: Info Banjar (admin) / Pilih Banjar (anggota) ─────────────────
  if (step === 2) {
    if (role === "admin_banjar") return (
      <Layout step={2} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor}>
        <StepHeader icon={Building2} title="Informasi Banjar Global" subtitle="Data banjar yang ingin Anda daftarkan" color={accentColor} />
        <div className="space-y-4">
          <Field label="Nama Banjar" error={displayErrors.banjarName}>
            <input value={data.banjarName} onChange={(e) => setData("banjarName", e.target.value)} placeholder="Contoh: Banjar Kaja Sesetan" className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ ...inputStyle, borderColor: displayErrors.banjarName ? '#ef4444' : undefined }} />
          </Field>
          
          {/* MULTI DROPDOWN WILAYAH GLOBAL API */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Negara">
              <select 
                value={data.negara} 
                onChange={(e) => {
                  setData({ ...data, negara: e.target.value, provinsi: "", kabupaten: "" });
                }} 
                className="w-full px-4 py-3 rounded-xl outline-none text-sm" 
                style={inputStyle}
              >
                <option value="">Pilih Negara</option>
                {countries.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>

            <Field label="Provinsi / State">
              <select 
                value={data.provinsi} 
                onChange={(e) => {
                  setData({ ...data, provinsi: e.target.value, kabupaten: "" });
                }} 
                className="w-full px-4 py-3 rounded-xl outline-none text-sm" 
                style={inputStyle}
                disabled={loadingProv || !data.negara}
              >
                <option value="">{loadingProv ? "Memuat..." : "Pilih Provinsi"}</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <Field label="Kabupaten / Kota">
              <select 
                value={data.kabupaten} 
                onChange={(e) => setData("kabupaten", e.target.value)} 
                className="w-full px-4 py-3 rounded-xl outline-none text-sm" 
                style={inputStyle}
                disabled={loadingCity || !data.provinsi}
              >
                <option value="">{loadingCity ? "Memuat..." : "Pilih Kota"}</option>
                {cities.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            
            <Field label="Kecamatan / Suburb" error={displayErrors.kecamatan}>
              <input value={data.kecamatan} onChange={(e) => setData("kecamatan", e.target.value)} placeholder="Contoh: Denpasar Selatan" className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ ...inputStyle, borderColor: displayErrors.kecamatan ? '#ef4444' : undefined }} />
            </Field>
          </div>

          <Field label="Deskripsi Singkat (opsional)">
            <textarea rows={3} value={data.deskripsi} onChange={(e) => setData("deskripsi", e.target.value)} placeholder="Ceritakan sedikit tentang banjar Anda..." className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none" style={inputStyle} />
          </Field>
          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(201,134,26,0.06)", border: "1px solid rgba(201,134,26,0.2)" }}>
            <p style={{ color: "#7A6555" }}>Banjar akan tampil di peta setelah disetujui oleh Super Admin. Proses verifikasi 1–3 hari kerja.</p>
          </div>
        </div>
        <NextButton onClick={handleNext} color={accentColor} />
      </Layout>
    );

    // Anggota: pilih banjar & Masukkan Kode Undangan
    return (
      <Layout step={2} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor}>
        <StepHeader icon={MapPin} title="Pilih Banjar" subtitle="Pilih banjar asal Anda (opsional)" color={accentColor} />
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#EFE6D8", border: "1.5px solid rgba(123,45,30,0.12)" }}>
            <Search size={14} style={{ color: "#7A6555" }} />
            <input value={banjarSearch} onChange={(e) => setBanjarSearch(e.target.value)} placeholder="Cari nama atau kecamatan..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {/* Skip option */}
            <button
              onClick={() => { setData({ ...data, selectedBanjarId: "", inviteCode: "" }); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all hover:bg-black/5"
              style={{ borderColor: data.selectedBanjarId === "" ? accentColor : "rgba(123,45,30,0.1)", background: data.selectedBanjarId === "" ? `${accentColor}08` : "transparent" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(123,45,30,0.06)" }}>
                <Users size={15} style={{ color: "#7A6555" }} />
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lewati — pilih nanti</div>
                <div className="text-xs" style={{ color: "#7A6555" }}>Anda bisa memilih banjar kapan saja</div>
              </div>
              {data.selectedBanjarId === "" && <CheckCircle size={16} className="ml-auto flex-shrink-0" style={{ color: accentColor }} />}
            </button>

            {filteredBanjar.map((b: any) => (
              <button
                key={b.id}
                onClick={() => setData("selectedBanjarId", b.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all hover:bg-black/5"
                style={{ borderColor: data.selectedBanjarId === b.id ? accentColor : "rgba(123,45,30,0.08)", background: data.selectedBanjarId === b.id ? `${accentColor}08` : "#FAF4EC" }}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#E8DACC" }}>
                  <img src={`https://images.unsplash.com/${b.img}?w=72&h=72&fit=crop&auto=format`} alt={b.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: "#1E1208", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.name}</div>
                  <div className="text-xs flex items-center gap-1" style={{ color: "#7A6555" }}>
                    <MapPin size={9} />{b.kecamatan}, {b.kabupaten}
                  </div>
                </div>
                {data.selectedBanjarId === b.id && <CheckCircle size={16} className="flex-shrink-0" style={{ color: accentColor }} />}
              </button>
            ))}
          </div>

          {/* FUNGSI BARU: KODE UNDANGAN (Tampil jika memilih Banjar) */}
          {data.selectedBanjarId !== "" && (
            <div className="mt-4 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2" style={{ background: "rgba(74,103,65,0.08)", border: `1px solid ${accentColor}` }}>
              <Field label="Kode Undangan Banjar (Wajib)" error={displayErrors.inviteCode}>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7A6555" }} />
                  <input
                    type="text"
                    value={data.inviteCode}
                    onChange={(e) => setData("inviteCode", e.target.value.toUpperCase())}
                    placeholder="Contoh: BANJAR123"
                    className="w-full py-3 pl-10 pr-4 rounded-xl outline-none text-sm transition-colors focus:bg-white"
                    style={{ ...inputStyle, borderColor: displayErrors.inviteCode ? '#ef4444' : undefined, textTransform: 'uppercase' }}
                  />
                </div>
              </Field>
              <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "#5A4A3A" }}>
                *Masukkan kode rahasia yang diberikan oleh Admin Banjar Anda untuk bergabung secara resmi sebagai warga komunitas.
              </p>
            </div>
          )}

        </div>
        <NextButton onClick={handleNext} color={accentColor} label="Lanjutkan" />
      </Layout>
    );
  }

  // ── STEP 3: Password ─────────────────────────────────────────────────────
  if (step === 3) return (
    <Layout step={3} totalSteps={totalSteps} stepLabels={steps} onBack={handleBack} accentColor={accentColor}>
      <StepHeader icon={Lock} title="Buat Password" subtitle="Amankan akun Anda dengan password yang kuat" color={accentColor} />
      <div className="space-y-4">
        <Field label="Password" error={displayErrors.password}>
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={data.password} onChange={(e) => setData("password", e.target.value)} placeholder="Minimal 8 karakter" className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11 focus:bg-black/5 transition-colors" style={{ ...inputStyle, borderColor: displayErrors.password ? '#ef4444' : undefined }} />
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

        <Field label="Konfirmasi Password" error={displayErrors.confirm}>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} value={data.confirm} onChange={(e) => setData("confirm", e.target.value)} placeholder="Ulangi password" className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11 focus:bg-black/5 transition-colors" style={{ ...inputStyle, borderColor: displayErrors.confirm ? '#ef4444' : undefined }} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
              {showConfirm ? <EyeOff size={14} style={{ color: "#7A6555" }} /> : <Eye size={14} style={{ color: "#7A6555" }} />}
            </button>
          </div>
        </Field>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setData("agree", !data.agree)}
              className="w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer hover:bg-black/5"
              style={{ borderColor: data.agree ? accentColor : "rgba(123,45,30,0.25)", background: data.agree ? accentColor : "transparent" }}
            >
              {data.agree && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className="text-xs leading-relaxed" style={{ color: "#5A4A3A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Saya menyetujui{" "}
              <span className="underline cursor-pointer" style={{ color: "#7B2D1E" }}>Syarat & Ketentuan</span>
              {" "}dan{" "}
              <span className="underline cursor-pointer" style={{ color: "#7B2D1E" }}>Kebijakan Privasi</span>
              {" "}banjar.id
            </span>
          </label>
          {displayErrors.agree && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{displayErrors.agree}</p>}
        </div>
      </div>
      <NextButton onClick={handleNext} color={accentColor} label="Buat Akun" processing={processing} />
    </Layout>
  );

  // ── STEP 4: Success ───────────────────────────────────────────────────────
  if (step === 4) {
    const selectedBanjar = BANJAR_LIST.find((b: any) => b.id === data.selectedBanjarId);

    return (
      <Layout step={4} totalSteps={totalSteps} stepLabels={steps} onBack={() => {}} accentColor={accentColor} hideBack>
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${accentColor}15`, border: `2px solid ${accentColor}30` }}>
            <CheckCircle size={36} style={{ color: accentColor }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            Akun Berhasil Dibuat!
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {role === "admin_banjar"
              ? "Permohonan Admin Banjar Anda sedang ditinjau oleh Super Admin."
              : "Selamat bergabung di banjar.id!"}
          </p>

          <div className="p-4 rounded-2xl text-left space-y-2.5 mb-6" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.1)" }}>
            {[
              { lbl: "Nama", val: data.fullName },
              { lbl: "Email", val: data.email },
              { lbl: "Peran", val: role === "admin_banjar" ? "Admin Banjar" : "Anggota" },
              ...(role === "admin_banjar" ? [{ lbl: "Banjar", val: `${data.banjarName} (${data.kabupaten}, ${data.negara})` }] : []),
              ...(role === "anggota" && selectedBanjar ? [{ lbl: "Banjar Asal", val: selectedBanjar.name }] : []),
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
                Email konfirmasi dikirim ke <span style={{ color: "#C9861A", fontWeight: 600 }}>{data.email}</span>.
                Akun akan aktif setelah disetujui Super Admin (1–3 hari kerja).
              </p>
            </div>
          )}

          <button
            onClick={handleFinish}
            className="w-full py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: accentColor, color: role === "admin_banjar" ? "#1E1208" : "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {role === "admin_banjar" ? "Masuk ke Dashboard" : "Mulai Jelajah"}
          </button>
        </div>
      </Layout>
    );
  }

  return null;
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function Layout({
  children, step, totalSteps, stepLabels, onBack, accentColor = "#7B2D1E", hideBack = false,
}: {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  stepLabels: string[];
  onBack: () => void;
  accentColor?: string;
  hideBack?: boolean;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE0" }}>
      <Head title="Buat Akun Baru | banjar.id" />
      {/* Left decorative panel */}
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
            Bergabung dengan<br />Komunitas Banjar Global
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(253,248,242,0.6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Daftarkan diri Anda dan mulai terhubung dengan ribuan banjar di seluruh dunia.
          </p>
          {/* Step progress */}
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

      {/* Right: form area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#7B2D1E" }}>
              <MapPin size={12} className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#7B2D1E" }}>
              banjar<span style={{ color: "#C9861A" }}>.id</span>
            </span>
          </Link>

          {/* Mobile step dots */}
          {step > 0 && (
            <div className="flex gap-1.5 mb-6 lg:hidden">
              {stepLabels.slice(1).map((_, i) => (
                <div key={i} className="h-1 rounded-full flex-1 transition-all" style={{ background: i < step ? accentColor : i === step - 1 ? accentColor : "#E8DACC" }} />
              ))}
            </div>
          )}

          {/* Back button */}
          {!hideBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6 hover:opacity-70 transition-opacity" style={{ color: "#7A6555", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <ArrowLeft size={13} /> Kembali
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

function NextButton({ onClick, color, label = "Lanjutkan", processing = false }: { onClick: () => void; color: string; label?: string, processing?: boolean }) {
  return (
    <button disabled={processing} onClick={onClick} className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: color, color: color === "#C9861A" ? "#1E1208" : "#FDF8F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {processing ? "Memproses..." : <>{label} <ChevronRight size={15} /></>}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#EFE6D8",
  color: "#1E1208",
  border: "1.5px solid rgba(123,45,30,0.12)",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};
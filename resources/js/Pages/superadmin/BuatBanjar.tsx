import React, { useState, useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  MapPin, LayoutGrid, BarChart2, PlusCircle, ShieldCheck, 
  Globe, Bell, LogOut, HelpCircle, Save, ChevronDown, User, ArrowRight, ArrowLeft, Search
} from "lucide-react";

// Import Library Wilayah Global
import { Country, State, City } from "country-state-city";

// Import React Quill
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout";

export default function BuatBanjar() {
  const theme = {
    bgMain: "#140A05",
    bgPanel: "#1C100A",
    gold: "#C9861A",
    goldLight: "#E6BA75",
    textMuted: "#8C7A6B",
    textLight: "#FDF8F2",
    border: "rgba(201, 134, 26, 0.15)",
    inputBg: "rgba(253, 248, 242, 0.03)",
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountryCode, setSelectedCountryCode] = useState("ID"); 
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const { data, setData, post, processing, errors } = useForm({
    nama_banjar: "",
    negara: "Indonesia",
    provinsi: "",
    kota: "",
    kecamatan: "",
    deskripsi: "",
    admin_name: "",
    admin_username: "",
    admin_email: "",
    password: "",
  });

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(selectedCountryCode);
  const cities = City.getCitiesOfState(selectedCountryCode, selectedStateCode);

  useEffect(() => {
    const idStates = State.getStatesOfCountry("ID");
    if (idStates.length > 0) {
      const firstState = idStates[0];
      setSelectedStateCode(firstState.isoCode);
      
      const firstCities = City.getCitiesOfState("ID", firstState.isoCode);
      const firstCityName = firstCities.length > 0 ? firstCities[0].name : "";

      setData(prev => ({
        ...prev,
        negara: "Indonesia",
        provinsi: firstState.name,
        kota: firstCityName
      }));
    }
  }, []);

  const handleCountryChange = (isoCode: string) => {
    const countryObj = Country.getCountryByCode(isoCode);
    setSelectedCountryCode(isoCode);
    const newStates = State.getStatesOfCountry(isoCode);
    const firstState = newStates.length > 0 ? newStates[0] : null;
    setSelectedStateCode(firstState ? firstState.isoCode : "");
    const newCities = firstState ? City.getCitiesOfState(isoCode, firstState.isoCode) : [];
    const firstCityName = newCities.length > 0 ? newCities[0].name : "";

    setData({
      ...data,
      negara: countryObj?.name || "",
      provinsi: firstState ? firstState.name : "",
      kota: firstCityName
    });
  };

  const handleStateChange = (stateIsoCode: string) => {
    const stateObj = State.getStateByCodeAndCountry(stateIsoCode, selectedCountryCode);
    setSelectedStateCode(stateIsoCode);
    const newCities = City.getCitiesOfState(selectedCountryCode, stateIsoCode);
    const firstCityName = newCities.length > 0 ? newCities[0].name : "";

    setData({
      ...data,
      provinsi: stateObj?.name || "",
      kota: firstCityName
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!data.nama_banjar || !data.kecamatan) {
        alert("Harap lengkapi Nama Banjar dan Kecamatan terlebih dahulu!");
        return;
      }
      setCurrentStep(2); 
      return;
    }

    post('/superadmin/buat-banjar', {
      onSuccess: () => {
        alert("Banjar & Akun Admin berhasil didaftarkan ke sistem global!");
        setCurrentStep(1); 
      }
    });
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
     
      <Head>
        <title>Dashboard Super Admin | banjar.id</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Head title="Buat Akun Banjar | banjar.id" />

      {/* --- CSS KHUSUS REACT QUILL DARK MODE --- */}
      <style>{`
        .ql-toolbar.ql-snow {
          background-color: ${theme.bgPanel} !important;
          border-color: ${theme.border} !important;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        .ql-toolbar.ql-snow .ql-stroke { stroke: ${theme.textLight} !important; }
        .ql-toolbar.ql-snow .ql-fill { fill: ${theme.textLight} !important; }
        .ql-toolbar.ql-snow .ql-picker { color: ${theme.textLight} !important; }
        
        .ql-container.ql-snow {
          background-color: ${theme.inputBg} !important;
          border-color: ${theme.border} !important;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          color: ${theme.textLight};
          min-height: 120px;
          font-family: inherit;
          font-size: 0.875rem;
        }
        .ql-editor.ql-blank::before {
          color: ${theme.textMuted};
          font-style: normal;
        }
      `}</style>

      {/* SIDEBAR KIRI */}
      <aside className="w-64 flex-shrink-0 flex flex-col justify-between border-r" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(201,134,26,0.15)" }}>
              <MapPin size={18} style={{ color: theme.gold }} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none" style={{ fontFamily: "'Libre Baskerville', serif", color: theme.textLight }}>
                banjar<span style={{ color: theme.gold }}>.id</span>
              </h1>
              <p className="text-[10px] font-bold tracking-widest mt-1" style={{ color: theme.gold }}>SUPER ADMIN</p>
            </div>
          </div>

          {/* LENCANA AKSES PENUH DIKEMBALIKAN */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: "rgba(201,134,26,0.05)", borderColor: theme.border, color: theme.gold }}>
              <ShieldCheck size={14} />
              <span className="text-xs font-semibold">Akses Penuh Sistem</span>
            </div>
          </div>

          <nav className="px-3 space-y-1">
            <Link href="/superadmin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><LayoutGrid size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Dashboard</span></Link>
            <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><BarChart2 size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Statistik Global</span></Link>
            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}><PlusCircle size={18} /><span className="text-sm font-semibold">Buat Akun Banjar</span></Link>
            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><ShieldCheck size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Moderasi Konten</span></Link>
            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><Globe size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Pantau Platform</span></Link>
            <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}><Globe size={18} style={{ color: theme.textMuted }} /><span className="text-sm font-medium">Manajemen Admin</span></Link>
          </nav>
        </div>

        {/* PROFIL & LOGOUT DIKEMBALIKAN */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#E74C3C" }}>
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Super Administrator</p>
              <p className="text-xs truncate" style={{ color: theme.textMuted }}>banjar.id</p>
            </div>
            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <LogOut size={16} style={{ color: theme.textMuted }} />
            </Link>
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Buat Akun Banjar</h2>
          <div className="flex items-center gap-4">
            {/* IKON NOTIFIKASI DIKEMBALIKAN */}
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
            </button>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>SUPER ADMIN</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Registrasi Banjar & Admin</h1>
              <p style={{ color: theme.textMuted }}>Daftarkan komunitas banjar beserta akun pengelolanya ke sistem</p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center gap-4 mb-8 text-sm font-semibold">
              <div className="flex items-center gap-2" style={{ color: currentStep >= 1 ? theme.gold : theme.textMuted }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-[#140A05] transition-colors" style={{ backgroundColor: currentStep >= 1 ? theme.gold : "transparent", border: currentStep >= 1 ? "none" : `1px solid ${theme.border}`, color: currentStep >= 1 ? "#140A05" : theme.textMuted }}>1</span>
                Info Banjar
              </div>
              <div className="w-16 h-[1px]" style={{ backgroundColor: currentStep >= 2 ? theme.gold : theme.border }}></div>
              <div className="flex items-center gap-2" style={{ color: currentStep >= 2 ? theme.gold : theme.textMuted }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors" style={{ backgroundColor: currentStep >= 2 ? theme.gold : "transparent", border: currentStep >= 2 ? "none" : `1px solid ${theme.border}`, color: currentStep >= 2 ? "#140A05" : theme.textMuted }}>2</span>
                Akun Admin
              </div>
            </div>

            {/* Form Box */}
            <div className="rounded-2xl p-8 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex items-center gap-2 mb-6 font-bold" style={{ color: theme.goldLight }}>
                {currentStep === 1 ? <MapPin size={18} /> : <User size={18} />}
                <h3>{currentStep === 1 ? "Informasi Wilayah Banjar" : "Informasi Akun Admin"}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* --- STEP 1: INFO BANJAR --- */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Nama Banjar</label>
                      <input type="text" required value={data.nama_banjar} onChange={e => setData('nama_banjar', e.target.value)} className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }} placeholder="Contoh: Banjar Kaja Sesetan" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Negara</label>
                        <CustomDropdown value={selectedCountryCode} options={countries.map(c => ({ value: c.isoCode, label: c.name }))} onChange={handleCountryChange} theme={theme} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Provinsi / State</label>
                        <CustomDropdown value={selectedStateCode} options={states.map(s => ({ value: s.isoCode, label: s.name }))} onChange={handleStateChange} theme={theme} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Kabupaten / Kota</label>
                        <CustomDropdown value={data.kota} options={cities.map(c => ({ value: c.name, label: c.name }))} onChange={(val: string) => setData('kota', val)} theme={theme} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Kecamatan / Suburb</label>
                        <input type="text" required value={data.kecamatan} onChange={e => setData('kecamatan', e.target.value)} className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }} placeholder="Contoh: Denpasar Selatan" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Deskripsi Singkat</label>
                      <ReactQuill 
                        theme="snow" 
                        value={data.deskripsi} 
                        onChange={(val) => setData('deskripsi', val)} 
                        placeholder="Tuliskan deskripsi singkat mengenai banjar ini..."
                      />
                    </div>
                  </div>
                )}

                {/* --- STEP 2: INFO ADMIN BANJAR --- */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Nama Lengkap Pengelola</label>
                      <input type="text" required value={data.admin_name} onChange={e => setData('admin_name', e.target.value)} className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }} placeholder="Masukkan nama pengurus..." />
                      {errors.admin_name && <p className="text-red-500 text-xs mt-1">{errors.admin_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Username Akun</label>
                        <input type="text" required value={data.admin_username} onChange={e => setData('admin_username', e.target.value)} className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }} placeholder="Contoh: admin_sesetan" />
                        {errors.admin_username && <p className="text-red-500 text-xs mt-1">{errors.admin_username}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Alamat Email</label>
                        <input type="email" required value={data.admin_email} onChange={e => setData('admin_email', e.target.value)} className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }} placeholder="admin@contoh.com" />
                        {errors.admin_email && <p className="text-red-500 text-xs mt-1">{errors.admin_email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Password Default</label>
                      <input type="text" required value={data.password} onChange={e => setData('password', e.target.value)} className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }} placeholder="Sandi untuk login admin pertama kali" />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                  </div>
                )}

                {/* Tombol Navigasi Bawah */}
                <div className="pt-6 flex gap-4">
                  {currentStep === 2 && (
                    <button type="button" onClick={() => setCurrentStep(1)} className="flex items-center gap-2 p-3.5 px-6 rounded-xl font-bold border transition-colors hover:bg-white/5" style={{ borderColor: theme.border, color: theme.textLight }}>
                      <ArrowLeft size={18} /> Kembali
                    </button>
                  )}
                  
                  <button type="submit" disabled={processing} className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl font-bold text-[#140A05] transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: theme.gold }}>
                    {currentStep === 1 ? (
                      <>Selanjutnya <ArrowRight size={18} /></>
                    ) : (
                      <><Save size={18} /> {processing ? "Memproses..." : "Simpan Banjar & Buat Akun"}</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==============================================================================
// KOMPONEN CUSTOM DROPDOWN (Bisa Diketik/Searchable)
// ==============================================================================
function CustomDropdown({ value, options, onChange, theme }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options.find((opt: any) => opt.value === value);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-colors hover:border-[#C9861A]" 
        style={{ backgroundColor: theme.inputBg, borderColor: isOpen ? theme.gold : theme.border, color: theme.textLight }}
      >
        {isOpen ? (
          <div className="flex items-center gap-2 w-full">
            <Search size={14} style={{ color: theme.textMuted }} />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent outline-none placeholder-gray-500"
              placeholder="Ketik untuk mencari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} 
              style={{ color: theme.textLight }}
            />
          </div>
        ) : (
          <span className="truncate">{selectedOption ? selectedOption.label : "Pilih..."}</span>
        )}
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} style={{ color: theme.textMuted, flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => { setIsOpen(false); setSearchTerm(""); }}
        ></div>
      )}
      
      {isOpen && (
        <div 
          className="absolute z-50 top-full mt-2 left-0 w-full rounded-xl border shadow-2xl py-2 overflow-y-auto custom-scrollbar" 
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.border, maxHeight: "220px" }}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-center italic" style={{ color: theme.textMuted }}>
              Tidak ditemukan
            </div>
          ) : (
            filteredOptions.map((opt: any) => (
              <div 
                key={opt.value} 
                onClick={() => { onChange(opt.value); setIsOpen(false); setSearchTerm(""); }} 
                className="px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center" 
                style={{ backgroundColor: value === opt.value ? "rgba(201,134,26,0.1)" : "transparent", color: value === opt.value ? theme.gold : theme.textLight }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? "rgba(201,134,26,0.1)" : "transparent"}
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
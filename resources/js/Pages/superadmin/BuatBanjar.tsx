import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  MapPin, LayoutGrid, BarChart2, PlusCircle, ShieldCheck, 
  Globe, Bell, LogOut, HelpCircle, ArrowRight, Save, ChevronDown
} from "lucide-react";
// @ts-ignore
import AdminLayout from "../../Layouts/AdminLayout";

// Import Library Wilayah Global
import { Country, State, City } from "country-state-city";

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

  const [selectedCountryCode, setSelectedCountryCode] = useState("ID"); 
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const { data, setData, post, processing, errors } = useForm({
    nama_banjar: "",
    negara: "Indonesia",
    provinsi: "",
    kota: "",
    kecamatan: "",
    deskripsi: "",
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
    post('/superadmin/buat-banjar', {
      onSuccess: () => {
        alert("Banjar berhasil didaftarkan ke sistem global!");
      }
    });
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Buat Akun Banjar | banjar.id" />

      {/* ========================================== */}
      {/* 1. SIDEBAR KIRI */}
      {/* ========================================== */}
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

          <div className="px-6 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: "rgba(201,134,26,0.05)", borderColor: theme.border, color: theme.gold }}>
              <ShieldCheck size={14} />
              <span className="text-xs font-semibold">Akses Penuh Sistem</span>
            </div>
          </div>

          <nav className="px-3 space-y-1">
            <Link href="/superadmin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <LayoutGrid size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/superadmin/statistik" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <BarChart2 size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Statistik Global</span>
            </Link>
            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <PlusCircle size={18} />
              <span className="text-sm font-semibold">Buat Akun Banjar</span>
            </Link>
            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <ShieldCheck size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Moderasi Konten</span>
            </Link>
            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>
            <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Manajemen Admin</span>
            </Link>
          </nav>
        </div>

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

      {/* ========================================== */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <h2 className="text-xl font-bold">Buat Akun Banjar</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={18} style={{ color: theme.textLight }} />
            </button>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>
              SUPER ADMIN
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Buat Akun Banjar Baru</h1>
              <p style={{ color: theme.textMuted }}>Daftarkan komunitas banjar dari seluruh dunia ke platform banjar.id</p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center gap-4 mb-8 text-sm font-semibold">
              <div className="flex items-center gap-2" style={{ color: theme.gold }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-[#140A05]" style={{ backgroundColor: theme.gold }}>1</span>
                Info Banjar
              </div>
              <div className="w-16 h-[1px]" style={{ backgroundColor: theme.border }}></div>
              <div className="flex items-center gap-2" style={{ color: theme.textMuted }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: theme.border }}>2</span>
                Admin
              </div>
              <div className="w-16 h-[1px]" style={{ backgroundColor: theme.border }}></div>
              <div className="flex items-center gap-2" style={{ color: theme.textMuted }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border" style={{ borderColor: theme.border }}>3</span>
                Akses
              </div>
            </div>

            {/* Form Box */}
            <div className="rounded-2xl p-8 border" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
              <div className="flex items-center gap-2 mb-6 font-bold" style={{ color: theme.goldLight }}>
                <MapPin size={18} />
                <h3>Informasi Banjar (Global)</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nama Banjar */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Nama Banjar</label>
                  <input 
                    type="text" 
                    required
                    value={data.nama_banjar}
                    onChange={e => setData('nama_banjar', e.target.value)}
                    className="w-full rounded-xl p-3 border outline-none transition-colors focus:border-[#C9861A]"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                    placeholder="Contoh: Banjar Kaja Sesetan"
                  />
                  {errors.nama_banjar && <p className="text-red-500 text-xs mt-1">{errors.nama_banjar}</p>}
                </div>

                {/* Grid: Negara & Provinsi (MENGGUNAKAN CUSTOM DROPDOWN) */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Negara</label>
                    <CustomDropdown 
                      value={selectedCountryCode}
                      options={countries.map(c => ({ value: c.isoCode, label: c.name }))}
                      onChange={handleCountryChange}
                      theme={theme}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Provinsi / State</label>
                    {states.length === 0 ? (
                      <div className="w-full rounded-xl p-3 border opacity-50 cursor-not-allowed" style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}>
                        Tidak Ada Provinsi
                      </div>
                    ) : (
                      <CustomDropdown 
                        value={selectedStateCode}
                        options={states.map(s => ({ value: s.isoCode, label: s.name }))}
                        onChange={handleStateChange}
                        theme={theme}
                      />
                    )}
                  </div>
                </div>

                {/* Grid: Kabupaten & Kecamatan */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Kabupaten / Kota / City</label>
                    {cities.length > 0 ? (
                      <CustomDropdown 
                        value={data.kota}
                        options={cities.map(c => ({ value: c.name, label: c.name }))}
                        onChange={(val: string) => setData('kota', val)}
                        theme={theme}
                      />
                    ) : (
                      <input 
                        type="text" 
                        required
                        value={data.kota}
                        onChange={e => setData('kota', e.target.value)}
                        className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]"
                        style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                        placeholder="Ketik nama kota..."
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Kecamatan / Suburb</label>
                    <input 
                      type="text" 
                      required
                      value={data.kecamatan}
                      onChange={e => setData('kecamatan', e.target.value)}
                      className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A]"
                      style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                      placeholder="Contoh: Denpasar Selatan"
                    />
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.textLight }}>Deskripsi Singkat</label>
                  <textarea 
                    rows={4}
                    value={data.deskripsi}
                    onChange={e => setData('deskripsi', e.target.value)}
                    className="w-full rounded-xl p-3 border outline-none focus:border-[#C9861A] resize-none"
                    style={{ backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textLight }}
                    placeholder="Tuliskan deksripsi singkat mengenai banjar ini..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl font-bold text-[#140A05] transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: theme.gold }}
                  >
                    <Save size={18} /> {processing ? "Menyimpan..." : "Simpan Data Banjar"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </main>

      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:bg-white/10" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <HelpCircle size={18} style={{ color: theme.textMuted }} />
      </button>
    </div>
  );
}

// ==============================================================================
// KOMPONEN CUSTOM DROPDOWN (Solusi Agar Menu Turun ke Bawah & Bisa Di-Scroll)
// ==============================================================================
function CustomDropdown({ value, options, onChange, theme }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mencari label dari value yang aktif
  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className="relative w-full">
      {/* Kotak Input (Clickable) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl p-3 border cursor-pointer transition-colors hover:border-[#C9861A]"
        style={{ 
          backgroundColor: theme.inputBg, 
          borderColor: isOpen ? theme.gold : theme.border, 
          color: theme.textLight 
        }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : "Pilih..."}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} style={{ color: theme.textMuted }} />
      </div>

      {/* Layer transparan di background agar dropdown tertutup saat klik di luar area */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Daftar Menu (Akan selalu terbuka ke Bawah (top-full)) */}
      {isOpen && (
        <div 
          className="absolute z-50 top-full mt-2 left-0 w-full rounded-xl border shadow-2xl py-2 overflow-y-auto custom-scrollbar"
          style={{ 
            backgroundColor: theme.bgPanel, 
            borderColor: theme.border,
            maxHeight: "220px" // Membatasi tinggi agar tidak bablas ke bawah layar
          }}
        >
          {options.map((opt: any) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center"
              style={{
                backgroundColor: value === opt.value ? "rgba(201,134,26,0.1)" : "transparent",
                color: value === opt.value ? theme.gold : theme.textLight
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === opt.value ? "rgba(201,134,26,0.1)" : "transparent"}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
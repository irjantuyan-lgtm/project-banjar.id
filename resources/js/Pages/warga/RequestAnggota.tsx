import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { UploadCloud, FileText, CheckCircle, MapPin, AlertCircle, ArrowLeft, Search, ChevronDown } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout'; 

interface Banjar {
    id_banjar: number;
    nama_banjar: string;
    kota: string;
    provinsi: string;
}

export default function RequestAnggota({ banjars }: { banjars: Banjar[] }) {
    const { data, setData, post, processing, errors } = useForm({
        id_banjar: '',
        surat_domisili: null as File | null,
    });

    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State baru untuk filter wilayah & pencarian ketik
    const [selectedProvinsi, setSelectedProvinsi] = useState<string>('');
    const [selectedKota, setSelectedKota] = useState<string>('');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

    // Ambil daftar unik Provinsi & Kota dari data banjars yang ada
    const daftarProvinsi = Array.from(new Set(banjars.map(b => b.provinsi).filter(Boolean)));
    const daftarKota = Array.from(
        new Set(
            banjars
                .filter(b => !selectedProvinsi || b.provinsi === selectedProvinsi)
                .map(b => b.kota)
                .filter(Boolean)
        )
    );

    // Filter banjar berdasarkan pilihan wilayah dan kata kunci ketikan
    const filteredBanjars = banjars.filter(b => {
        const matchProvinsi = !selectedProvinsi || b.provinsi === selectedProvinsi;
        const matchKota = !selectedKota || b.kota === selectedKota;
        const matchKeyword = !searchKeyword || 
            b.nama_banjar.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            b.kota.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            b.provinsi.toLowerCase().includes(searchKeyword.toLowerCase());
        
        return matchProvinsi && matchKota && matchKeyword;
    });

    // Cari nama banjar yang sedang dipilih untuk ditampilkan di kotak input
    const selectedBanjarObj = banjars.find(b => String(b.id_banjar) === String(data.id_banjar));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('surat_domisili', file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/request-anggota-banjar');
    };

    return (
        <PublicLayout>
            <Head title="Pengajuan Anggota Banjar - Banjar.id" />

            <div className="min-h-screen bg-[#FAF4EC] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto">
                    
                    {/* Tombol Kembali */}
                    <Link href="/" className="inline-flex items-center gap-2 text-[#7B2D1E] hover:underline font-semibold mb-6">
                        <ArrowLeft size={20} /> Kembali ke Beranda
                    </Link>

                    {/* Kartu Formulir */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border" style={{ borderColor: "rgba(123,45,30,0.1)" }}>
                        
                        {/* Header Kartu */}
                        <div className="bg-[#7B2D1E] p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
                                <FileText size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Pengajuan Anggota Banjar</h2>
                            <p className="text-orange-100 text-sm">Bergabunglah dengan komunitas Banjar pilihan Anda secara resmi.</p>
                        </div>

                        {/* Isi Formulir */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            
                            {/* Alert Edukasi Keamanan */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start">
                                <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-blue-800 leading-relaxed">
                                    <strong>Edukasi Keamanan:</strong> Demi keamanan data Anda, unggah Surat Keterangan Domisili/Kipem. Jika mengunggah KTP, pastikan telah diberi <i>watermark</i> teks: <b>"HANYA UNTUK BANJAR.ID"</b>.
                                </div>
                            </div>

                            {/* PILIHAN WILAYAH (FILTER PROVINSI & KOTA) */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#1E1208] mb-1">Filter Provinsi</label>
                                    <select
                                        value={selectedProvinsi}
                                        onChange={(e) => {
                                            setSelectedProvinsi(e.target.value);
                                            setSelectedKota(''); // Reset kota jika provinsi berubah
                                        }}
                                        className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:ring-[#C9861A] focus:border-[#C9861A]"
                                    >
                                        <option value="">Semua Provinsi</option>
                                        {daftarProvinsi.map((prov, idx) => (
                                            <option key={idx} value={prov}>{prov}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#1E1208] mb-1">Filter Kota/Kabupaten</label>
                                    <select
                                        value={selectedKota}
                                        onChange={(e) => setSelectedKota(e.target.value)}
                                        className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs bg-gray-50 focus:ring-[#C9861A] focus:border-[#C9861A]"
                                    >
                                        <option value="">Semua Kota</option>
                                        {daftarKota.map((kota, idx) => (
                                            <option key={idx} value={kota}>{kota}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* PILIH BANJAR DENGAN FITUR KETIK / PENCARIAN CUSTOM */}
                            <div>
                                <label className="block text-sm font-bold text-[#1E1208] mb-2">
                                    Pilih Banjar Tujuan <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    
                                    {/* Kotak Utama / Trigger Dropdown */}
                                    <div 
                                        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                                        className={`w-full pl-10 pr-10 py-3 border ${errors.id_banjar ? 'border-red-500' : 'border-gray-300'} rounded-xl bg-gray-50 cursor-pointer flex items-center justify-between text-sm transition-colors`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <MapPin size={18} className="text-gray-400 shrink-0" />
                                            <span className={selectedBanjarObj ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                                {selectedBanjarObj ? `${selectedBanjarObj.nama_banjar} (${selectedBanjarObj.kota}, ${selectedBanjarObj.provinsi})` : '-- Pilih atau Ketik Nama Banjar --'}
                                            </span>
                                        </div>
                                        <ChevronDown size={16} className="text-gray-400 shrink-0" />
                                    </div>

                                    {/* Menu Dropdown Yang Ada Kotak Pencariannya */}
                                    {isOpenDropdown && (
                                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                                            
                                            {/* Input Pencarian */}
                                            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                                <Search size={16} className="text-gray-400" />
                                                <input 
                                                    type="text"
                                                    placeholder="Ketik nama banjar / kota..."
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                                    className="w-full bg-transparent text-xs focus:outline-none text-gray-800"
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Daftar Hasil Filter */}
                                            <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                                                {filteredBanjars.length > 0 ? (
                                                    filteredBanjars.map((b) => (
                                                        <div 
                                                            key={b.id_banjar}
                                                            onClick={() => {
                                                                setData('id_banjar', String(b.id_banjar));
                                                                setIsOpenDropdown(false);
                                                                setSearchKeyword('');
                                                            }}
                                                            className="p-3 text-xs hover:bg-orange-50 cursor-pointer flex flex-col transition-colors"
                                                        >
                                                            <span className="font-bold text-[#1E1208]">{b.nama_banjar}</span>
                                                            <span className="text-gray-500 text-[11px]">{b.kota}, {b.provinsi}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-xs text-gray-400">
                                                        Banjar tidak ditemukan. Coba ubah kata kunci atau filter wilayah.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.id_banjar && <p className="mt-1 text-xs text-red-500">{errors.id_banjar}</p>}
                            </div>

                            {/* Area Upload Dokumen */}
                            <div>
                                <label className="block text-sm font-bold text-[#1E1208] mb-2">
                                    Surat Domisili / Identitas <span className="text-red-500">*</span>
                                </label>
                                
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:bg-orange-50 ${errors.surat_domisili ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                                >
                                    <div className="space-y-2 text-center">
                                        {fileName ? (
                                            <div className="flex flex-col items-center">
                                                <CheckCircle size={36} className="text-green-500 mb-2" />
                                                <p className="text-sm font-bold text-gray-700">{fileName}</p>
                                                <p className="text-xs text-[#C9861A] font-semibold mt-1">Klik untuk mengganti file</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <UploadCloud size={36} className="text-gray-400 mb-2" />
                                                <div className="text-sm text-gray-600 font-medium">
                                                    <span className="text-[#7B2D1E] hover:underline font-bold">Klik untuk unggah</span> atau seret file ke sini
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG hingga 2MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,image/jpeg,image/png,image/jpg"
                                    onChange={handleFileChange}
                                />
                                {errors.surat_domisili && <p className="mt-1 text-xs text-red-500">{errors.surat_domisili}</p>}
                            </div>

                            {/* Tombol Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#1E1208] hover:bg-[#3A2311] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9861A] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    {processing ? 'Sedang Mengirim...' : 'Kirim & Dapatkan OTP'}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Dengan menekan tombol di atas, kode OTP akan dikirimkan ke email Anda untuk tahap verifikasi akhir.
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
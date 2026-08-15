import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  MapPin, LayoutGrid, BarChart2, PlusCircle, ShieldCheck, 
  Globe, Bell, LogOut, Clock, Calendar, ShoppingBag, 
  Users, X, CheckCircle, XCircle, Eye, MapPinned, Store, Image as ImageIcon
} from "lucide-react";

export default function Moderasi() {
  const { auth, superadminName, antrian = [], riwayat = [], stats = {} }: any = usePage().props;
  const adminName = superadminName || auth?.user?.name || "Super Administrator";

  const [activeTab, setActiveTab] = useState<'menunggu' | 'disetujui' | 'ditolak'>('menunggu');
  
  // State untuk Modal Pop-up Detail
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [catatan, setCatatan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback untuk membaca field status asli dari database
  const getStatus = (item: any) => item.status || item.status_moderasi;
  const approvedList = riwayat.filter((item: any) => getStatus(item) === 'approved' || getStatus(item) === 'disetujui' || getStatus(item) === 'aktif');
  const rejectedList = riwayat.filter((item: any) => getStatus(item) === 'rejected' || getStatus(item) === 'ditolak');

  const theme = {
    bgMain: "#140A05", bgPanel: "#1C100A", gold: "#C9861A",
    goldLight: "#E6BA75", textMuted: "#8C7A6B", textLight: "#FDF8F2",
    green: "#4A9E60", red: "#C0392B", border: "rgba(201, 134, 26, 0.15)",
  };

  // Fungsi membuka modal detail
  const openDetailModal = (item: any) => {
    setSelectedItem(item);
    setCatatan('');
  };

  // Fungsi submit persetujuan/penolakan ke Laravel
  const submitModeration = (status: 'approved' | 'rejected') => {
    const actionText = status === 'approved' ? 'MENYETUJUI' : 'MENOLAK';
    
    if (confirm(`Yakin ingin ${actionText} konten ini?`)) {
        setIsProcessing(true);

        // Ambil ID dan Type yang benar dari database
        const itemId = selectedItem.id || selectedItem.id_kegiatan || selectedItem.id_umkm;
        const itemType = getType(selectedItem);

        router.post('/superadmin/moderasi/proses', {
          id: itemId,
          type: itemType,
          status: status,
          catatan: catatan
        }, {
          preserveScroll: true,
          onSuccess: () => {
              setSelectedItem(null);
              setIsProcessing(false);
          },
          onError: () => {
              alert("Gagal memproses moderasi.");
              setIsProcessing(false);
          }
        });
    }
  };

  // ==========================================
  // HELPER UNTUK MEMBACA NAMA KOLOM DATABASE
  // ==========================================
  const getTitle = (item: any) => item?.judul_kegiatan || item?.nama_produk || item?.title || "Tanpa Judul";
  const getDescription = (item: any) => item?.deskripsi || item?.deskripsi_produk || item?.description || "<i>Tidak ada deskripsi yang ditulis.</i>";
  const getDate = (item: any) => item?.tanggal || item?.date || null;
  const getPrice = (item: any) => item?.harga || item?.price || null;
  
  // PEMISAHAN INFO LOKASI DAN INFO PENGIRIM (SUBMIT)
  const getLokasiSpesifik = (item: any) => item?.lokasi || item?.lokasi_spesifik || "Tidak dicantumkan";
  const getInfoPengirim = (item: any) => item?.location || "Banjar Tidak Diketahui";

  const getImage = (item: any) => {
      let src = item?.foto_kegiatan || item?.foto_produk || item?.foto_url;
      // Jika ada nama file tapi tidak diawali http atau /, tambahkan path storage laravel
      if (src && !src.startsWith('http') && !src.startsWith('/')) {
          src = `/storage/${src}`;
      }
      return src;
  };

  const getType = (item: any) => {
    if (item?.type) return item.type;
    if (item?.id_kegiatan || item?.judul_kegiatan) return 'kegiatan';
    if (item?.id_umkm || item?.nama_produk) return 'umkm';
    return 'kegiatan'; 
  };
  
  const getBadge = (item: any) => item?.badge || (getType(item) === 'kegiatan' ? 'Kegiatan Banjar' : 'Produk UMKM');

  // Helper format tanggal Indonesia
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>

      <Head>
        <title>Dashboard Super Admin | banjar.id</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Head title="Moderasi Konten | banjar.id" />

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
            <Link href="/superadmin/buat-banjar" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <PlusCircle size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Buat Akun Banjar</span>
            </Link>
            <Link href="/superadmin/moderasi" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ backgroundColor: "rgba(201,134,26,0.1)", color: theme.gold }}>
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Moderasi Konten</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.gold, color: "#140A05" }}>{stats.menunggu || 0}</span>
            </Link>
            <Link href="/superadmin/pantau" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
              <Globe size={18} style={{ color: theme.textMuted }} />
              <span className="text-sm font-medium">Pantau Platform</span>
            </Link>
            <Link href="/superadmin/manajemen-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5" style={{ color: theme.textLight }}>
               <Users size={18} style={{ color: theme.textMuted }} />
               <span className="text-sm font-medium">Manajemen Admin</span>
            </Link>
          </nav>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "rgba(192,57,43,0.2)", color: "#E74C3C" }}>SA</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{adminName}</p>
              <p className="text-xs truncate" style={{ color: theme.textMuted }}>banjar.id</p>
            </div>
            <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <LogOut size={16} style={{ color: theme.textMuted }} />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. KONTEN UTAMA */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="flex items-center justify-between px-10 py-6 flex-shrink-0 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: theme.textLight }}>Moderasi & Approval Konten</h2>
            <p className="text-sm mt-1" style={{ color: theme.textMuted }}>Tinjau dan setujui konten (Kegiatan/UMKM) yang dikirimkan oleh admin banjar.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border" style={{ backgroundColor: "rgba(201,134,26,0.1)", borderColor: theme.gold, color: theme.goldLight }}>SUPER ADMIN</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          
          {/* Menu Statistik / Tabs */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('menunggu')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors font-bold text-sm"
              style={{ 
                backgroundColor: activeTab === 'menunggu' ? "rgba(201,134,26,0.1)" : "transparent",
                borderColor: activeTab === 'menunggu' ? theme.gold : theme.border,
                color: activeTab === 'menunggu' ? theme.goldLight : theme.textMuted
              }}
            >
              <span className="text-lg">{stats?.menunggu || 0}</span> Menunggu
            </button>
            <button 
              onClick={() => setActiveTab('disetujui')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors font-bold text-sm"
              style={{ 
                backgroundColor: activeTab === 'disetujui' ? "rgba(74,158,96,0.1)" : "transparent",
                borderColor: activeTab === 'disetujui' ? theme.green : theme.border,
                color: activeTab === 'disetujui' ? theme.green : theme.textMuted
              }}
            >
              <span className="text-lg">{stats?.disetujui || 0}</span> Disetujui
            </button>
            <button 
              onClick={() => setActiveTab('ditolak')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors font-bold text-sm"
              style={{ 
                backgroundColor: activeTab === 'ditolak' ? "rgba(192, 57, 43, 0.1)" : "transparent",
                borderColor: activeTab === 'ditolak' ? theme.red : theme.border,
                color: activeTab === 'ditolak' ? theme.red : theme.textMuted
              }}
            >
              <span className="text-lg">{stats?.ditolak || 0}</span> Ditolak
            </button>
          </div>

          {/* AREA KONTEN DINAMIS */}
          <div className="mt-8">
            
            {/* 1. ANTRIAN MENUNGGU */}
            {activeTab === 'menunggu' && (
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textLight }}>
                  <Clock size={20} style={{ color: theme.gold }}/> Antrian Menunggu ({antrian.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {antrian.length === 0 ? (
                      <div className="col-span-full p-10 text-center rounded-2xl border border-dashed" style={{ borderColor: theme.border, color: theme.textMuted }}>
                          Belum ada konten yang perlu dimoderasi.
                      </div>
                  ) : antrian.map((item: any, idx: number) => (
                    <ModerationCard 
                      key={idx} item={item} 
                      icon={getType(item) === 'kegiatan' ? Calendar : Store} 
                      iconBg="rgba(201, 134, 26, 0.1)" 
                      iconColor={theme.gold} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. RIWAYAT DISETUJUI */}
            {activeTab === 'disetujui' && (
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textLight }}>
                  <CheckCircle size={20} style={{ color: theme.green }}/> Riwayat Disetujui
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {approvedList.length === 0 ? (
                      <div className="col-span-full p-10 text-center rounded-2xl border border-dashed" style={{ borderColor: theme.border, color: theme.textMuted }}>
                          Belum ada riwayat konten disetujui.
                      </div>
                  ) : approvedList.map((item: any, idx: number) => (
                     <HistoryCard 
                      key={idx} item={item}
                      status="Disetujui" statusColor={theme.green} statusBg="rgba(74, 158, 96, 0.1)" 
                      icon={getType(item) === 'kegiatan' ? Calendar : Store} 
                      iconBg="rgba(74, 158, 96, 0.1)" iconColor={theme.green} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. RIWAYAT DITOLAK */}
            {activeTab === 'ditolak' && (
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textLight }}>
                  <XCircle size={20} style={{ color: theme.red }}/> Riwayat Ditolak
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {rejectedList.length === 0 ? (
                      <div className="col-span-full p-10 text-center rounded-2xl border border-dashed" style={{ borderColor: theme.border, color: theme.textMuted }}>
                          Belum ada riwayat konten ditolak.
                      </div>
                  ) : rejectedList.map((item: any, idx: number) => (
                     <HistoryCard 
                      key={idx} item={item}
                      status="Ditolak" statusColor={theme.red} statusBg="rgba(192, 57, 43, 0.1)" 
                      icon={getType(item) === 'kegiatan' ? Calendar : Store} 
                      iconBg="rgba(192, 57, 43, 0.1)" iconColor={theme.red} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL POP-UP LIHAT FOTO & DETAIL KONTEN */}
        {/* ========================================================= */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
            <div className="border rounded-3xl max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
                
                {/* Header Modal */}
                <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
                    <h3 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily: "'Libre Baskerville', serif", color: theme.goldLight }}>
                        <Eye size={20} /> Review {getBadge(selectedItem)}
                    </h3>
                    <button onClick={() => setSelectedItem(null)} className="p-2 rounded-full transition-colors hover:bg-white/10">
                        <X size={20} style={{ color: theme.textMuted }} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="overflow-y-auto custom-scrollbar">
                    
                    {/* BAGIAN FOTO */}
                    <div className="w-full bg-[#140A05] flex items-center justify-center border-b" style={{ borderColor: theme.border, minHeight: '200px', maxHeight: '400px' }}>
                        {getImage(selectedItem) ? (
                            <img 
                                src={getImage(selectedItem)} 
                                alt={getTitle(selectedItem)} 
                                className="w-full h-auto max-h-[400px] object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2" style={{ color: theme.textMuted }}>
                                <ImageIcon size={40} className="opacity-50" />
                                <p className="text-sm font-medium">Tidak ada foto dilampirkan</p>
                            </div>
                        )}
                    </div>

                    {/* BAGIAN DETAIL TEKS */}
                    <div className="p-6 space-y-5">
                        
                        {/* Judul, Tanggal, Harga */}
                        <div>
                            <h2 className="text-2xl font-bold mb-3" style={{ color: theme.textLight }}>{getTitle(selectedItem)}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold" style={{ color: theme.goldLight }}>
                                
                                {/* Info Submit / Pengirim */}
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: theme.textMuted }}>
                                  <MapPin size={14}/> Dikirim oleh: {getInfoPengirim(selectedItem)}
                                </span>

                                {/* Tampilkan Tanggal Acara */}
                                {getDate(selectedItem) && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(201,134,26,0.1)" }}>
                                      <Calendar size={14}/> Tanggal Pelaksanaan: {formatDate(getDate(selectedItem))}
                                    </span>
                                )}

                                {/* Tampilkan Harga UMKM */}
                                {getPrice(selectedItem) && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(201,134,26,0.1)" }}>
                                      <Store size={14}/> Harga: Rp {parseInt(getPrice(selectedItem)).toLocaleString('id-ID')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Lokasi Spesifik / Tempat Acara DB */}
                        <div className="p-4 rounded-xl border flex gap-3" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: theme.border }}>
                            <MapPinned size={18} className="mt-0.5 shrink-0" style={{ color: theme.gold }} />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: theme.textMuted }}>
                                    {getType(selectedItem) === 'kegiatan' ? 'Lokasi Tempat Acara' : 'Lokasi Penjualan UMKM'}
                                </p>
                                <p className="text-sm font-medium leading-relaxed" style={{ color: theme.textLight }}>{getLokasiSpesifik(selectedItem)}</p>
                            </div>
                        </div>

                        {/* Deskripsi Lengkap DB */}
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: theme.textMuted }}>Deskripsi Lengkap</p>
                            <div 
                                className="text-sm leading-relaxed prose prose-invert max-w-none bg-[#140A05] p-4 rounded-xl border"
                                style={{ color: theme.textLight, borderColor: theme.border }}
                                dangerouslySetInnerHTML={{ __html: getDescription(selectedItem) }}
                            />
                        </div>

                        {/* Input Catatan Moderasi */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: theme.textMuted }}>
                                Catatan Moderasi (Opsional)
                            </label>
                            <textarea 
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Tambahkan alasan mengapa ditolak atau pesan untuk admin banjar..."
                                className="w-full p-4 rounded-xl text-sm outline-none resize-none h-24"
                                style={{ backgroundColor: theme.bgMain, border: `1px solid ${theme.border}`, color: theme.textLight }}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Footer Modal (Aksi) */}
                <div className="p-5 border-t flex gap-3 bg-[#140A05] rounded-b-3xl" style={{ borderColor: theme.border }}>
                    <button 
                        onClick={() => submitModeration('rejected')}
                        disabled={isProcessing}
                        className="flex-1 py-3.5 border font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 disabled:opacity-50"
                        style={{ borderColor: "#E74C3C", color: "#E74C3C" }}
                    >
                        <XCircle size={18}/> Tolak Konten
                    </button>
                    <button 
                        onClick={() => submitModeration('approved')}
                        disabled={isProcessing}
                        className="flex-1 py-3.5 font-bold rounded-xl transition-colors text-sm shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: theme.green, color: "#fff" }}
                    >
                        <CheckCircle size={18} /> Setujui & Publikasikan
                    </button>
                </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );

  // --- Komponen Antrian Menunggu ---
  function ModerationCard({ item, icon: Icon, iconBg, iconColor }: any) {
    const rawDesc = getDescription(item).replace(/<[^>]+>/g, '');
    return (
      <div className="rounded-2xl p-5 border flex flex-col transition-all hover:bg-white/5 h-full" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                <Icon size={18} style={{ color: iconColor }} />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight line-clamp-1" style={{ color: theme.textLight }}>{getTitle(item)}</h4>
                <p className="text-xs mt-1 flex flex-col gap-0.5" style={{ color: theme.textMuted }}>
                    {getDate(item) && <span className="flex items-center gap-1 text-white/70"><Calendar size={12}/> {formatDate(getDate(item))}</span>}
                    <span className="flex items-center gap-1"><MapPin size={12}/> {getInfoPengirim(item)}</span>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border whitespace-nowrap ml-2" style={{ borderColor: theme.border, color: theme.goldLight }}>
              {getBadge(item)}
            </span>
          </div>
          <p className="text-sm mt-3 mb-4 line-clamp-2" style={{ color: theme.textMuted }}>
            {rawDesc || 'Tidak ada deskripsi'}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t flex gap-3" style={{ borderColor: theme.border }}>
          <button 
            onClick={() => openDetailModal(item)}
            className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border"
            style={{ borderColor: theme.gold, color: theme.goldLight, backgroundColor: "rgba(201,134,26,0.05)" }}
          >
            <Eye size={16}/> Lihat Foto & Detail
          </button>
        </div>
      </div>
    );
  }

  // --- Komponen Riwayat ---
  function HistoryCard({ item, status, statusColor, statusBg, icon: Icon, iconBg, iconColor }: any) {
    const note = item.catatan_moderasi || item.note ? `Catatan Super Admin: ${item.catatan_moderasi || item.note}` : null;
    return (
      <div className="rounded-2xl p-5 border flex flex-col transition-all hover:bg-white/5 h-full" style={{ backgroundColor: theme.bgPanel, borderColor: theme.border }}>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
            <Icon size={20} style={{ color: iconColor }} />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-base line-clamp-1" style={{ color: theme.textLight }}>{getTitle(item)}</h4>
              <div className="px-3 py-1 rounded-md text-[10px] font-bold border ml-2" style={{ backgroundColor: statusBg, borderColor: statusColor, color: statusColor }}>
                {status}
              </div>
            </div>
            
            <div className="text-xs space-y-1 mt-1" style={{ color: theme.textMuted }}>
                {getDate(item) && <p className="flex items-center gap-1 text-white/70"><Calendar size={12}/> {formatDate(getDate(item))}</p>}
                <p className="flex items-center gap-1"><MapPin size={12}/> {getInfoPengirim(item)}</p>
            </div>

            {note && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                <div className="p-3 rounded-lg border text-xs leading-relaxed" style={{ backgroundColor: theme.bgMain, borderColor: theme.border, color: statusColor }}>
                  {note}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
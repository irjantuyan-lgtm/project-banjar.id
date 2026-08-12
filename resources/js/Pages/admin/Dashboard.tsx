import { Link, Head, usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { Users, ShoppingBag, Eye, Activity, ArrowRight, TrendingUp, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";

export default function AdminDashboard({ banjar }: { banjar: any }) {
  // Ambil data auth untuk mengecek apakah user adalah admin_banjar atau anggota_banjar (Krama)
  const { auth }: any = usePage().props;
  const userRole = auth?.user?.role;
  const isKrama = userRole === 'anggota_banjar';
  
  // Pengaman jika data banjar gagal dimuat dari Backend
  if (!banjar) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 text-[#7A6555]">
          Memuat data Dashboard...
        </div>
      </AdminLayout>
    );
  }

  // Fungsi pemotong nama (mengambil nama depan/panggilan)
  const getFirstName = (fullName: string) => {
    if (!fullName) return "Admin";
    const parts = fullName.split(" ");
    return parts.length > 1 ? parts[1] : parts[0]; 
  };

  return (
    <AdminLayout>
      <Head title={isKrama ? "Dashboard Krama Banjar" : "Dashboard Admin Banjar"} />
      
      <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        
        {/* BANNER KHUSUS KRAMA (ANGGOTA BANJAR) */}
        {isKrama && (
          <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: "rgba(74,103,65,0.1)", border: "1px solid rgba(74,103,65,0.2)" }}>
            <ShieldAlert size={20} style={{ color: "#4A6741", flexShrink: 0 }} />
            <div className="text-xs" style={{ color: "#3A2E24" }}>
              <span className="font-bold">Mode Anggota Banjar (Krama):</span> Anda masuk sebagai warga resmi Banjar ini. Anda dapat melihat informasi internal dan aktivitas banjar, namun fitur pengelolaan data dikhususkan untuk Admin Banjar.
            </div>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            Selamat Datang, {getFirstName(auth?.user?.name || banjar.adminName)}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>
            {isKrama ? `Portal Informasi Internal ${banjar.name}` : `Kelola ${banjar.name} dari sini`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: banjar.members || 0, lbl: "Krama / Warga", icon: Users, color: "#7B2D1E", trend: "Total terdaftar" },
            { val: banjar.umkm || 0, lbl: "UMKM Aktif", icon: ShoppingBag, color: "#C9861A", trend: "Data UMKM" },
            { val: banjar.views ? banjar.views.toLocaleString() : 0, lbl: "Total Views", icon: Eye, color: "#4A6741", trend: "Pengunjung" },
            { val: banjar.kegiatan ? banjar.kegiatan.length : 0, lbl: "Kegiatan", icon: Activity, color: "#7B2D1E", trend: "Total Kegiatan" },
          ].map((s) => (
            <div key={s.lbl} className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <TrendingUp size={12} style={{ color: "#4A6741" }} />
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color }}>{s.val}</div>
              <div className="text-xs" style={{ color: "#7A6555" }}>{s.lbl}</div>
              <div className="text-[10px] mt-1" style={{ color: "#4A6741" }}>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Status checklist */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Kelengkapan Profil Banjar</h2>
            <div className="space-y-2.5">
              {[
                { label: "Profil & Deskripsi", done: true },
                { label: "Foto & Galeri", done: true },
                { label: "Koordinat Peta", done: false },
                { label: "Kontak WhatsApp", done: true },
                { label: "Kegiatan Aktif", done: true },
                { label: "Minimal 3 UMKM", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle size={14} style={{ color: "#4A6741", flexShrink: 0 }} />
                  ) : (
                    <AlertCircle size={14} style={{ color: "#C9861A", flexShrink: 0 }} />
                  )}
                  <span className="text-xs" style={{ color: item.done ? "#3A2E24" : "#C9861A" }}>{item.label}</span>
                  {!item.done && !isKrama && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(201,134,26,0.1)", color: "#C9861A" }}>Lengkapi</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "#E8DACC" }}>
              <div className="h-full rounded-full" style={{ width: "67%", background: "#4A6741" }} />
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: "#7A6555" }}>67% profil lengkap</p>
          </div>

          <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: "#1E1208" }}>Kegiatan Terbaru</h2>
              {!isKrama && (
                <Link href="/admin/konten" className="text-xs flex items-center gap-1" style={{ color: "#C9861A" }}>Kelola <ArrowRight size={10} /></Link>
              )}
            </div>
            
            {banjar.kegiatan && banjar.kegiatan.length > 0 ? (
              banjar.kegiatan.map((k: any) => (
                <div key={k.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "rgba(123,45,30,0.08)" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: k.status === "published" ? "#4A6741" : "#C9861A" }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: "#1E1208" }}>{k.title || k.nama_kegiatan}</div>
                    <div className="text-[10px]" style={{ color: "#7A6555" }}>{k.tanggal || new Date(k.created_at).toLocaleDateString('id-ID')}</div>
                  </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      k.status_moderasi === 'approved' ? 'bg-[#EBF0EB] text-[#4A6741]' :
                      k.status_moderasi === 'pending' || k.status_moderasi === 'submitted' ? 'bg-[#FFF9E6] text-[#B7791F]' :
                      'bg-[#FFF5E5] text-[#C9861A]'
                    }`}>
                      {k.status_moderasi === 'approved' ? 'Aktif' : 
                      (k.status_moderasi === 'pending' || k.status_moderasi === 'submitted' ? 'Menunggu Tinjauan' : 'Draft')}
                    </span>
                </div>
              ))
            ) : (
               <div className="text-xs text-center py-4" style={{ color: "#7A6555" }}>Belum ada kegiatan yang ditambahkan.</div>
            )}
            
            {/* Tombol Submit ke Pusat hanya muncul untuk admin_banjar */}
            {!isKrama && (
              <div className="mt-4">
                <Link href="/admin/submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                  Submit ke Pusat <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions: Jika Krama, menu manajemen/edit disembunyikan atau dibatasi */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {isKrama ? (
            // Menu khusus untuk Anggota Banjar / Krama (Hanya baca / lihat data warga)
            <>
              <Link href="/admin/warga" className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity col-span-2" style={{ background: "rgba(74,103,65,0.12)", color: "#4A6741", border: "1px solid rgba(74,103,65,0.25)" }}>
                Lihat Daftar Krama / Warga Banjar <ArrowRight size={12} />
              </Link>
            </>
          ) : (
            // Menu lengkap untuk Admin Banjar
            [
              { label: "Edit Profil", href: "/admin/profil", color: "#7B2D1E" },
              { label: "Manajemen Krama", href: "/admin/warga", color: "#4A6741" },
              { label: "Tambah Kegiatan", href: "/admin/konten", color: "#C9861A" },
              { label: "Submit Konten", href: "/admin/submit", color: "#7B2D1E" },
            ].map((a) => (
              <Link key={a.label} href={a.href} className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}25` }}>
                {a.label} <ArrowRight size={12} />
              </Link>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
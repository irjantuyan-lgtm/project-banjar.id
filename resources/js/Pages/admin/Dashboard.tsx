import { Link } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { Users, ShoppingBag, Eye, Activity, ArrowRight, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

// === DATA DUMMY (Akan digantikan oleh data asli dari Laravel) ===
const DUMMY_BANJAR = {
  name: "Banjar Adat Kaja",
  adminName: "Wayan Sujana",
  members: 320,
  umkm: 82,
  views: 3500,
  kegiatan: [
    { id: 1, title: "Ngaben Massal Kaja Sesetan", tanggal: "12 Agustus 2026", status: "published" },
    { id: 2, title: "Pameran Bambu Tegal Jaya", tanggal: "24 Agustus 2026", status: "draft" },
  ]
};

export default function AdminDashboard({ banjar = DUMMY_BANJAR }: { banjar?: any }) {
  return (
    <AdminLayout>
      <div className="space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
            Selamat Datang, {banjar.adminName.split(" ")[1] || banjar.adminName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Kelola {banjar.name} dari sini</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: banjar.members, lbl: "Kepala Keluarga", icon: Users, color: "#7B2D1E", trend: "+8 bulan ini" },
            { val: banjar.umkm, lbl: "UMKM Aktif", icon: ShoppingBag, color: "#C9861A", trend: "+3 bulan ini" },
            { val: banjar.views.toLocaleString(), lbl: "Total Views", icon: Eye, color: "#4A6741", trend: "+124 minggu ini" },
            { val: banjar.kegiatan.length, lbl: "Kegiatan", icon: Activity, color: "#7B2D1E", trend: "1 menunggu" },
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
                  {!item.done && (
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
              <Link href="/admin/konten" className="text-xs flex items-center gap-1" style={{ color: "#C9861A" }}>Kelola <ArrowRight size={10} /></Link>
            </div>
            {banjar.kegiatan.map((k: any) => (
              <div key={k.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "rgba(123,45,30,0.08)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: k.status === "published" ? "#4A6741" : "#C9861A" }} />
                <div className="flex-1">
                  <div className="text-xs font-medium" style={{ color: "#1E1208" }}>{k.title}</div>
                  <div className="text-[10px]" style={{ color: "#7A6555" }}>{k.tanggal}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: k.status === "published" ? "rgba(74,103,65,0.1)" : "rgba(201,134,26,0.1)", color: k.status === "published" ? "#4A6741" : "#C9861A" }}>
                  {k.status === "published" ? "Aktif" : "Draft"}
                </span>
              </div>
            ))}
            <div className="mt-4">
              <Link href="/admin/submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: "#7B2D1E", color: "#FDF8F2" }}>
                Submit ke Pusat <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Edit Profil", href: "/admin/profil", color: "#7B2D1E" },
            { label: "Input Koordinat", href: "/admin/peta", color: "#4A6741" },
            { label: "Tambah Kegiatan", href: "/admin/konten", color: "#C9861A" },
            { label: "Submit Konten", href: "/admin/submit", color: "#7B2D1E" },
          ].map((a) => (
            <Link key={a.label} href={a.href} className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}25` }}>
              {a.label} <ArrowRight size={12} />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
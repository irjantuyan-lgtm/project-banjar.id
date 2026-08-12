import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { Send, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
// @ts-ignore
import AdminLayout from "@/Layouts/AdminLayout"; 

export default function AdminSubmit() {
  const { drafts = [], histories = [], auth }: any = usePage().props;
  
  const isAktif = auth?.user?.status_akun === 'aktif';

  const [items, setItems] = useState(drafts);
  const [submitted, setSubmitted] = useState<string[]>([]);

  useEffect(() => {
    setItems(drafts);
  }, [drafts]);

  // Fungsi Kirim Satuan (Aman & Berjalan Normal)
  const submit = (id: string) => {
    if (!isAktif) return;

    setSubmitted((prev) => [...prev, id]);

    router.post(`/admin/submit-konten/${id}`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setTimeout(() => {
          setItems((prev: any) => prev.filter((i: any) => i.id !== id));
        }, 1000);
      },
      onError: () => {
        alert("Gagal mengirim konten. Silakan coba lagi.");
        setSubmitted((prev) => prev.filter((itemId) => itemId !== id));
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Submit Konten ke Pusat</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Kirimkan konten untuk ditinjau oleh Super Admin sebelum dipublikasikan</p>
        </div>

        {!isAktif && (
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(201,134,26,0.1)", border: "1px solid #C9861A" }}>
            <AlertCircle size={20} style={{ color: "#C9861A", flexShrink: 0 }} />
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "#C9861A" }}>Akun Menunggu Verifikasi</h3>
              <p className="text-xs mt-1" style={{ color: "#7A6555" }}>
                Anda tetap dapat membuat dan menyimpan konten sebagai <strong>Draft</strong>. Namun, fitur pengiriman ke pusat baru dapat digunakan setelah disetujui Super Admin.
              </p>
            </div>
          </div>
        )}

        {/* Alur Moderasi */}
        <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Alur Moderasi</h2>
          <div className="flex items-center gap-2">
            {[
              { label: "Draft", icon: AlertCircle, color: "#C9861A" },
              { label: "Dikirim", icon: Send, color: "#7B2D1E" },
              { label: "Ditinjau", icon: Clock, color: "#C9861A" },
              { label: "Dipublikasi", icon: CheckCircle, color: "#4A6741" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${step.color}15` }}>
                    <step.icon size={14} style={{ color: step.color }} />
                  </div>
                  <span className="text-[10px] mt-1 font-medium" style={{ color: step.color }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight size={12} style={{ color: "#C9B8A8", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Draft items (Tanpa Tombol Kirim Semua, Hanya Kirim Satuan) */}
        {items.length > 0 && (
          <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: "#1E1208" }}>
                Siap Dikirim ({items.length})
              </h2>
            </div>
            
            <div className="space-y-2">
              {items.map((item: any) => (
                <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${submitted.includes(item.id) ? "opacity-50" : ""}`} style={{ background: "#F5EDE0" }}>
                  <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: "#C9861A" }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: "#1E1208" }}>{item.title}</div>
                    <div className="text-[10px] capitalize" style={{ color: "#7A6555" }}>{item.type}</div>
                  </div>
                  <button
                    onClick={() => submit(item.id)}
                    disabled={!isAktif || submitted.includes(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!isAktif ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    style={{ background: submitted.includes(item.id) ? "#4A6741" : "#C9861A", color: submitted.includes(item.id) ? "#FDF8F2" : "#1E1208" }}
                  >
                    {submitted.includes(item.id) ? <><CheckCircle size={10} /> Terkirim</> : <><Send size={10} /> Kirim</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riwayat Submit */}
        <div className="p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#1E1208" }}>Riwayat Submit</h2>
          {histories.length > 0 ? (
            <div className="space-y-2">
              {histories.map((h: any, i: number) => {
                let statusColor = "#C9861A"; 
                let statusBg = "rgba(201,134,26,0.1)";
                let statusText = "Menunggu Tinjauan";

                if (h.status === "approved") {
                  statusColor = "#4A6741"; 
                  statusBg = "rgba(74,103,65,0.1)";
                  statusText = "Disetujui";
                } else if (h.status === "rejected") {
                  statusColor = "#C0392B"; 
                  statusBg = "rgba(192,57,43,0.1)";
                  statusText = "Ditolak";
                }

                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F5EDE0" }}>
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                    <div className="flex-1">
                      <div className="text-xs font-medium" style={{ color: "#1E1208" }}>{h.title}</div>
                      <div className="text-[10px]" style={{ color: "#7A6555" }}>
                        {h.date}{h.note ? ` · ${h.note}` : ""}
                      </div>
                    </div>
                    <span 
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium" 
                      style={{ background: statusBg, color: statusColor }}
                    >
                      {statusText}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: "#7A6555" }}>Belum ada riwayat submit.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
  Bell, Users, ShieldCheck, AlertTriangle, Info, Clock, 
  CheckCircle2, ArrowLeft
} from "lucide-react";

export default function Notifikasi() {
  const { notifications = [] }: any = usePage().props;

  const theme = {
    bgMain: "#140A05", 
    bgPanel: "#1C100A", 
    gold: "#C9861A",
    goldLight: "#E6BA75", 
    textMuted: "#8C7A6B", 
    textLight: "#FDF8F2",
    green: "#4A9E60", 
    border: "rgba(201, 134, 26, 0.15)",
  };

  // Fungsi tandai semua dibaca
  const markAllAsRead = () => {
    router.post('/superadmin/notifikasi/read-all', {}, { preserveScroll: true });
  };

  // Fungsi tandai satu dibaca lalu pindah halaman
  const handleReadAndVisit = (notif: any) => {
    router.post(`/superadmin/notifikasi/read-single/${notif.id}`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        router.visit(notif.link);
      }
    });
  };

  // Ikon dinamis berdasarkan tipe notifikasi
  const getIcon = (type: string) => {
    switch(type) {
      case 'banjar_baru': return <Users size={20} style={{ color: "#3B82F6" }} />;
      case 'konten_baru': return <ShieldCheck size={20} style={{ color: theme.gold }} />;
      case 'peringatan': return <AlertTriangle size={20} style={{ color: "#E74C3C" }} />;
      default: return <Info size={20} style={{ color: theme.green }} />;
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: theme.bgMain, color: theme.textLight }}>
      <Head title="Pusat Notifikasi | banjar.id" />

      {/* HEADER ATAS DENGAN TOMBOL KEMBALI */}
      <header className="border-b sticky top-0 z-10 backdrop-blur-md" style={{ backgroundColor: "rgba(28, 16, 10, 0.8)", borderColor: theme.border }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            {/* TOMBOL KEMBALI */}
            <Link 
              href="/superadmin/dashboard" 
              className="p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all hover:bg-white/10"
              style={{ borderColor: theme.border, color: theme.textLight, backgroundColor: theme.bgPanel }}
            >
              <ArrowLeft size={16} style={{ color: theme.gold }} />
              Kembali
            </Link>

            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Pusat Notifikasi
              </h1>
              <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                Pantau semua aktivitas pendaftaran dan moderasi terbaru.
              </p>
            </div>
          </div>

          {/* TOMBOL TANDAI DIBACA */}
          <button 
            onClick={markAllAsRead} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors hover:bg-white/10 border" 
            style={{ borderColor: theme.border, color: theme.goldLight, backgroundColor: "rgba(201,134,26,0.05)" }}
          >
            <CheckCircle2 size={16} /> Tandai Semua Dibaca
          </button>
        </div>
      </header>

      {/* KONTEN UTAMA FULL WIDTH */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-24 border border-dashed rounded-3xl" style={{ borderColor: theme.border, backgroundColor: theme.bgPanel }}>
              <Bell size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.gold }} />
              <h3 className="text-base font-bold" style={{ color: theme.textMuted }}>Belum ada notifikasi baru saat ini.</h3>
            </div>
          ) : (
            notifications.map((notif: any) => (
              <div 
                key={notif.id} 
                className={`p-5 rounded-2xl border flex gap-4 transition-colors hover:bg-white/5 ${notif.is_read ? 'opacity-70' : ''}`}
                style={{ 
                  backgroundColor: notif.is_read ? theme.bgMain : theme.bgPanel, 
                  borderColor: notif.is_read ? theme.border : theme.gold 
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-base" style={{ color: theme.textLight }}>{notif.title}</h4>
                    <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: theme.textMuted }}>
                      <Clock size={12}/> {notif.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: theme.textMuted }}>{notif.message}</p>
                  
                  {/* Tombol Langsung ke Modul dengan Trigger Read-Single */}
                  {notif.link && (
                    <button 
                      onClick={() => handleReadAndVisit(notif)}
                      className="inline-block mt-3 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-white/10 border cursor-pointer" 
                      style={{ borderColor: theme.border, color: theme.goldLight }}
                    >
                      Lihat Detail &rarr;
                    </button>
                  )}
                </div>

                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: theme.gold }}></div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

    </div>
  );
}
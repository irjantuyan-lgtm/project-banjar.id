import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Eye, EyeOff, Save, ShieldCheck } from "lucide-react";
import AdminLayout from "../../Layouts/AdminLayout";

export default function AdminPassword() {
  // Gunakan useForm agar terhubung ke Laravel
  const { data, setData, post, processing, recentlySuccessful, errors, reset } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/password/update", {
      onSuccess: () => reset(),
    });
  };

  // Logic Strength Meter
  const strength = data.password.length === 0 ? 0 : data.password.length < 6 ? 1 : data.password.length < 10 ? 2 : 3;
  const strengthColor = ["transparent", "#C0392B", "#C9861A", "#4A6741"][strength];
  const strengthLabel = ["", "Lemah", "Sedang", "Kuat"][strength];

  return (
    <AdminLayout>
      <div className="max-w-lg space-y-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>Setup Password</h1>
          <p className="text-sm mt-1" style={{ color: "#7A6555" }}>Perbarui password akun admin banjar Anda</p>
        </div>

        {recentlySuccessful && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(74,103,65,0.1)", border: "1px solid rgba(74,103,65,0.2)" }}>
            <ShieldCheck size={14} style={{ color: "#4A6741" }} />
            <span className="text-sm font-medium" style={{ color: "#4A6741" }}>Password berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 p-5 rounded-2xl" style={{ background: "#FAF4EC", border: "1px solid rgba(123,45,30,0.08)" }}>
          
          {/* Password Saat Ini */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Password Saat Ini</label>
            <div className="relative">
              <input
                type={show.current ? "text" : "password"}
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11"
                style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)" }}
              />
              <button type="button" onClick={() => setShow({...show, current: !show.current})} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                {show.current ? <EyeOff size={14} style={{ color: "#7A6555" }} /> : <Eye size={14} style={{ color: "#7A6555" }} />}
              </button>
            </div>
            {errors.current_password && <p className="text-xs mt-1 text-red-600">{errors.current_password}</p>}
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Password Baru</label>
            <div className="relative">
              <input
                type={show.new ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm pr-11"
                style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)" }}
              />
              <button type="button" onClick={() => setShow({...show, new: !show.new})} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                {show.new ? <EyeOff size={14} style={{ color: "#7A6555" }} /> : <Eye size={14} style={{ color: "#7A6555" }} />}
              </button>
            </div>
            {/* Strength bar */}
            {data.password && (
              <div className="mt-2">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E8DACC" }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength * 33}%`, background: strengthColor }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
              </div>
            )}
            {errors.password && <p className="text-xs mt-1 text-red-600">{errors.password}</p>}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#3A2E24" }}>Konfirmasi Password Baru</label>
            <input
              type={show.confirm ? "text" : "password"}
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{ background: "#EFE6D8", color: "#1E1208", border: "1.5px solid rgba(123,45,30,0.12)" }}
            />
          </div>

          <button type="submit" disabled={processing} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all" style={{ background: "#C9861A", color: "#1E1208" }}>
            <Save size={14} /> {processing ? "Menyimpan..." : "Perbarui Password"}
          </button>
        </form>

        {/* Tips */}
        <div className="p-4 rounded-2xl text-xs space-y-1.5" style={{ background: "rgba(123,45,30,0.04)", color: "#7A6555" }}>
          <p className="font-semibold" style={{ color: "#3A2E24" }}>Tips keamanan password:</p>
          {["Minimal 8 karakter", "Gunakan huruf besar, kecil, dan angka", "Hindari menggunakan nama", "Jangan gunakan password yang sama"].map((t) => (
            <p key={t} className="flex items-center gap-1.5"><span style={{ color: "#C9861A" }}>·</span>{t}</p>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
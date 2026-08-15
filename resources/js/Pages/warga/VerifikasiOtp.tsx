import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link, usePage, router } from '@inertiajs/react';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function VerifikasiOtp() {
    // Tangkap data dari backend (termasuk server_time agar kebal zona waktu)
    const { otp_expired_at, server_time }: any = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Hitung sisa detik secara akurat (Kebal Zona Waktu)
    const calculateTimeLeft = () => {
        if (!otp_expired_at) return 300; // Default 5 menit
        
        const expiredTime = new Date(otp_expired_at).getTime();
        const currentTime = server_time ? new Date(server_time).getTime() : new Date().getTime();
        
        const diff = Math.floor((expiredTime - currentTime) / 1000);
        return diff > 0 ? diff : 0;
    };

    const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());
    const [canResend, setCanResend] = useState<boolean>(timeLeft <= 0);

    // Jalankan timer hitung mundur real-time
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format detik menjadi MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Sinkronisasi state kotak dengan form data Inertia
    useEffect(() => {
        setData('otp', otpValues.join(''));
    }, [otpValues]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; 
        if (!/^[0-9]*$/.test(value)) return; 

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otpValues[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (!/^\d+$/.test(pastedData.join(''))) return; 

        const newOtpValues = [...otpValues];
        pastedData.forEach((char, i) => {
            if (i < 6) newOtpValues[i] = char;
        });
        setOtpValues(newOtpValues);
        
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.otp.length === 6 && timeLeft > 0) {
            post('/verifikasi-otp-pengajuan');
        }
    };

    // Fungsi Kirim Ulang OTP
    const handleResendOtp = () => {
        router.post('/resend-otp-pengajuan', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setTimeLeft(300); // Reset timer 5 menit (300 detik)
                setCanResend(false);
                setOtpValues(['', '', '', '', '', '']); // Kosongkan form
                inputRefs.current[0]?.focus(); // Otomatis fokus ke kotak pertama
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Verifikasi OTP | banjar.id" />

            {/* Background dengan Gradasi & Ornamen Cahaya Lebar */}
            <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F5EDE0] via-[#FAF6F0] to-[#EAE0D5]">
                
                {/* Decorative Blobs */}
                <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-[#D8B991] rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[30rem] h-[30rem] bg-[#E8CBA5] rounded-full mix-blend-multiply filter blur-[120px] opacity-50"></div>

                <div className="relative max-w-md w-full mx-auto z-10">
                    
                    {/* Tombol Batal/Kembali */}
                    <div className="mb-6 flex justify-center sm:justify-start">
                        <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm hover:opacity-80 transition-all duration-300 transform hover:-translate-x-1" style={{ color: "#7B2D1E" }}>
                            <ArrowLeft size={16} /> Batal & Kembali
                        </Link>
                    </div>

                    {/* Kartu Formulir OTP dengan Efek Glassmorphism */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(123,45,30,0.1)] border border-white overflow-hidden text-center p-8 sm:p-10 transition-all duration-500">
                        
                        <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-inner transform rotate-3" style={{ background: "linear-gradient(135deg, rgba(201,134,26,0.2) 0%, rgba(201,134,26,0.05) 100%)" }}>
                            <ShieldCheck size={42} className="transform -rotate-3" style={{ color: "#C9861A" }} />
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight" style={{ fontFamily: "'Libre Baskerville', serif", color: "#1E1208" }}>
                            Verifikasi Email
                        </h2>
                        
                        <p className="text-sm mb-6 leading-relaxed px-2" style={{ color: "#5A4A3A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Kode rahasia 6 digit telah kami kirimkan ke email Anda. Silakan masukkan di bawah ini.
                        </p>

                        {/* Indikator Waktu Real-Time yang Elegan */}
                        <div className={`mb-8 py-2 px-5 rounded-full inline-flex items-center gap-2 border transition-colors duration-300 ${timeLeft > 0 ? 'bg-orange-50/80 border-orange-200/60' : 'bg-red-50/80 border-red-200/60'}`}>
                            {timeLeft > 0 ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-[#C9861A] animate-pulse"></div>
                                    <p className="text-xs font-bold" style={{ color: "#C9861A" }}>
                                        Berlaku dalam <span className="font-mono text-sm ml-1">{formatTime(timeLeft)}</span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <p className="text-xs font-bold text-red-600">Kode OTP telah kedaluwarsa</p>
                                </>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Kotak Input 6 Digit Premium */}
                            <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                                {otpValues.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {inputRefs.current[index] = el;}}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        autoComplete="off" // Mencegah autofill sembarangan dari browser
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`w-12 h-14 sm:w-[3.5rem] sm:h-16 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all duration-300 shadow-sm ${
                                            errors.otp 
                                                ? 'border-red-400 bg-red-50/50 text-red-700' 
                                                : digit !== '' 
                                                    ? 'border-[#C9861A] bg-white text-[#1E1208] shadow-[0_0_15px_rgba(201,134,26,0.15)]'
                                                    : 'border-gray-200 bg-gray-50 text-[#1E1208] focus:border-[#C9861A] focus:bg-white focus:ring-4 focus:ring-[#C9861A]/10 hover:border-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Pesan Error dari Backend */}
                            {errors.otp && (
                                <div className="animate-bounce-short">
                                    <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 py-2.5 px-4 rounded-xl inline-block shadow-sm">
                                        {errors.otp}
                                    </p>
                                </div>
                            )}

                            {/* Tombol Submit Elegan */}
                            <button
                                type="submit"
                                disabled={processing || data.otp.length < 6 || timeLeft <= 0}
                                className="relative w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl text-sm font-bold text-white transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                style={{ background: "linear-gradient(to right, #7B2D1E, #9A3A27)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {processing ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Verifikasi Pengajuan <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>
                                )}
                            </button>

                        </form>

                        {/* Tombol Kirim Ulang OTP & Bantuan */}
                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs font-medium" style={{ color: "#7A6555" }}>Tidak menerima email atau kode kedaluwarsa?</p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="group inline-flex items-center gap-2 text-xs font-extrabold transition-all duration-300 hover:opacity-80 py-2 px-4 rounded-full bg-orange-50/50 hover:bg-orange-100/50 cursor-pointer"
                                    style={{ color: "#C9861A" }}
                                >
                                    <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
                                    Kirim Ulang Kode OTP
                                </button>
                            </div>

                            <p className="text-[11px] flex items-center justify-center gap-1.5 pt-1 opacity-70" style={{ color: "#5A4A3A" }}>
                                <Mail size={12} /> Cek folder Spam jika email tidak ditemukan di Kotak Masuk.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
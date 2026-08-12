import { usePage, router } from '@inertiajs/react';

export default function LanguageSelector() {
    // Tangkap bahasa yang sedang aktif dari middleware Laravel
    const { locale } = usePage().props as any;

    // Daftar bahasa sesuai dengan 9 file JSON
    const languages = [
        { code: 'id', label: 'ID' },
        { code: 'en', label: 'EN' },
        { code: 'ja', label: 'JA' },
        { code: 'es', label: 'ES' },
        { code: 'de', label: 'DE' },
        { code: 'fr', label: 'FR' },
        { code: 'pt', label: 'PT' },
        { code: 'ru', label: 'RU' },
        { code: 'it', label: 'IT' },
    ];

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLocale = e.target.value;
        // Panggil rute /language/{locale} di Laravel tanpa me-refresh full halaman
        router.get(`/language/${selectedLocale}`, {}, { preserveScroll: true });
    };

    return (
        <select
            value={locale || 'id'}
            onChange={handleLanguageChange}
            className="ml-2 px-3 py-2 text-sm font-semibold rounded-full bg-white text-[#4A2511] border border-gray-200 shadow-sm cursor-pointer outline-none hover:bg-gray-50 focus:ring-2 focus:ring-[#D4A373] transition-all"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.label}
                </option>
            ))}
        </select>
    );
}
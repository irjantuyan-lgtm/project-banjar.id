<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 1. Ambil bahasa dari session
        $locale = session('locale', 'id');
        app()->setLocale($locale);

        // 2. Baca file JSON kamus terjemahan
        $langPath = base_path("lang/{$locale}.json");
        $translations = file_exists($langPath) ? json_decode(file_get_contents($langPath), true) : [];

        // Ambil data user beserta nama banjarnya jika ada
        $user = $request->user();
        $userData = null;

        if ($user) {
            $userData = $user->toArray();
            $userData['nama_banjar'] = $user->id_banjar
                ? \Illuminate\Support\Facades\DB::table('banjar')->where('id_banjar', $user->id_banjar)->value('nama_banjar')
                : null;
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $userData,
            ],
            // 3. Kirim bahasa dan kamusnya ke React
            'locale' => $locale,
            'translations' => $translations, 
        ]);
    }
}
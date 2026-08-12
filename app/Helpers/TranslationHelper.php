<?php

use Stichoza\GoogleTranslate\GoogleTranslate;

if (!function_exists('translateContent')) {
    // 1. Tambahkan "string|null" dan "string" di dalam parameter
    function translateContent(string|null $text, string $targetLocale) {
        
        // 2. Gunakan fungsi empty() agar lebih aman menangani string kosong atau null
        if (empty($text) || $targetLocale === 'id') {
            return $text;
        }

        try {
            $translator = new GoogleTranslate();
            $translator->setSource('id'); 
            
            $cacheKey = 'trans_' . md5($text) . '_' . $targetLocale;
            
            return cache()->remember($cacheKey, now()->addDays(7), function () use ($translator, $text, $targetLocale) {
                $translator->setTarget($targetLocale);
                return $translator->translate($text);
            });

        } catch (\Exception $e) {
            return $text; 
        }
    }
}
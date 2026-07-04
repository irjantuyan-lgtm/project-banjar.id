// Untuk menampilkan Peta (di dalam folder publik)
Route::get('/peta', function () {
    return Inertia\Inertia::render('publik/Peta'); 
});

// Untuk menampilkan Profil Admin (di dalam folder admin)
Route::get('/admin/profil', function () {
    return Inertia\Inertia::render('admin/AdminProfil'); 
});
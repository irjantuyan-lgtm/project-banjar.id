<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banjar extends Model
{
    protected $table = 'banjar';
    protected $primaryKey = 'id_banjar';
    const UPDATED_AT = null;

    protected $fillable = [
        'nama_banjar', 
        'negara', 
        'provinsi', 
        'kabupaten', 
        'kecamatan', 
        'deskripsi', 
        'latitude', 
        'longitude', 
        'no_wa_pengelola', 
        'total_views', 
        'total_likes', 
        'status_akun'
    ];
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Umkm extends Model
{
    protected $table = 'umkm';
    protected $primaryKey = 'id_umkm';
    const UPDATED_AT = null;

    protected $fillable = [
        'id_banjar', 
        'nama_usaha', 
        'deskripsi_produk', 
        'harga', 
        'foto_produk', 
        'no_wa_penjual', 
        'status_moderasi'
    ];
}
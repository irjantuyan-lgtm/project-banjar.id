<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    protected $table = 'kegiatan';
    protected $primaryKey = 'id_kegiatan';
    const UPDATED_AT = null;

    protected $fillable = [
        'id_banjar', 
        'judul_kegiatan', 
        'deskripsi', 
        'foto_kegiatan', 
        'tanggal', 
        'status_moderasi'
    ];
}
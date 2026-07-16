<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    // Beritahu Laravel nama tabel dan primary key-nya
    protected $table = 'users';
    protected $primaryKey = 'id';

    // Matikan updated_at karena di database kita cuma pakai created_at
    const UPDATED_AT = null;

    // Kolom yang boleh diisi
    protected $fillable = [
        'name',
        'username', 
        'email',
        'password',
        'role',     
        'id_banjar' 
    ];

    // Sembunyikan password saat data dipanggil
    protected $hidden = [
        'password',
    ];
}
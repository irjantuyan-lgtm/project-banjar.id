<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banjar extends Model
{
    protected $fillable = [
        'name', 'kecamatan', 'kabupaten', 'deskripsi', 
        'phone', 'email', 'admin_name', 'img'
    ];
}
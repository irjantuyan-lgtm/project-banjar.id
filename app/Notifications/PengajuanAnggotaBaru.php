<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PengajuanAnggotaBaru extends Notification
{
    use Queueable;

    public $namaWarga;

    public function __construct($namaWarga)
    {
        $this->namaWarga = $namaWarga;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'tipe' => 'pengajuan_anggota',
            'judul' => 'Pengajuan Anggota Baru',
            'pesan' => 'Warga bernama ' . $this->namaWarga . ' meminta bergabung ke Banjar Anda. Silakan cek Surat Domisilinya.',
            'url' => '/admin/warga', 
            'icon' => 'FileText' 
        ];
    }
}
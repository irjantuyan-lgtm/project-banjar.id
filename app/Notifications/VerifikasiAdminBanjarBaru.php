<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifikasiAdminBanjarBaru extends Notification
{
    use Queueable;

    // Variabel untuk menangkap nama banjar dari Controller
    public $namaBanjar;

    /**
     * Create a new notification instance.
     */
    public function __construct($namaBanjar = 'Baru')
    {
        $this->namaBanjar = $namaBanjar;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Simpan notifikasi ke database
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // Data yang akan dibaca oleh Ikon Lonceng di React UI
        return [
            'tipe' => 'verifikasi_admin',
            'judul' => 'Verifikasi Admin Banjar',
            // Pesan ini sekarang dinamis sesuai nama banjar yang mendaftar
            'pesan' => 'Ada Admin Banjar ' . $this->namaBanjar . ' yang mendaftar dan butuh verifikasi Anda.',
            'url' => '/superadmin/verifikasi-banjar', 
            'icon' => 'UserCheck' 
        ];
    }
}
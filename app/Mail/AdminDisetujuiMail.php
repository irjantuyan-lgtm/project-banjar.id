<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminDisetujuiMail extends Mailable
{
    use Queueable, SerializesModels;

    public $adminName;
    public $banjarName;
    public $emailLogin;
    public $passwordLogin;

    public function __construct($adminName, $banjarName, $emailLogin, $passwordLogin)
    {
        $this->adminName = $adminName;
        $this->banjarName = $banjarName;
        $this->emailLogin = $emailLogin;
        $this->passwordLogin = $passwordLogin;
    }

    public function build()
    {
        return $this->subject('Selamat! Akun Banjar Anda Telah Disetujui')
                    ->view('emails.admin_disetujui'); // Ini akan memanggil file desain di bawah
    }
}
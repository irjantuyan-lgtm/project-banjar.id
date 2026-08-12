<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; background-color: #FDF8F2; color: #1E1208; padding: 20px; }
        .container { background-color: #FFFFFF; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid rgba(123,45,30,0.1); }
        .header { color: #C9861A; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .box { background-color: #FAF4EC; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 16px; }
        .btn { background-color: #7B2D1E; color: #FFFFFF; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">BANJAR.ID</div>
        <p>Halo <strong>{{ $adminName }}</strong>,</p>
        <p>Pendaftaran Anda untuk mengelola <strong>{{ $banjarName }}</strong> telah diverifikasi dan <strong>DISETUJUI</strong> oleh Super Admin kami.</p>
        
        <p>Berikut adalah akses login Anda:</p>
        <div class="box">
            Email: <strong>{{ $emailLogin }}</strong><br>
            Password Sementara: <strong>{{ $passwordLogin }}</strong>
        </div>

        <p>Silakan masuk ke platform dan segera lengkapi data profil Banjar Anda, serta ubah password ini demi keamanan.</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ url('/login') }}" class="btn">Masuk ke Dashboard</a>
        </div>
    </div>
</body>
</html>
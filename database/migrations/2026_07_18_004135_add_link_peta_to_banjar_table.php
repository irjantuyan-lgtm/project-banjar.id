<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::table('banjar', function (Blueprint $table) {
            // Perintah ini yang akan menambah 1 kolom baru bernama link_peta
            $table->text('link_peta')->nullable()->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('banjar', function (Blueprint $table) {
            $table->dropColumn('link_peta');
        });
    }
};

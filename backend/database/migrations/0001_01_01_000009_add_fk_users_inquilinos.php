<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Cria a ligação agora que as duas tabelas existem
            $table->foreign('inquilino_id')
                  ->references('id_inquilino')
                  ->on('user_inquilinos')
                  ->onDelete('cascade'); // Se apagar o inquilino, apaga os usuários dele
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['inquilino_id']);
        });
    }
};
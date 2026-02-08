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
        Schema::create('users', function (Blueprint $table) {
            // id_users BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT
            $table->id('id_users');

            // inquilino_id INT(10) NOT NULL
            // Mantemos integer para bater com a tabela user_inquilinos
            $table->integer('inquilino_id');

            $table->string('name');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // role ENUM(...)
            $table->enum('role', ['proprietário','administrador','gerente','usuario','cliente'])
                ->nullable();

            // ativo_sim TINYINT(1) -> No Laravel/Postgres usamos boolean
            $table->boolean('ativo_sim')->default(true);

            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->string('avatar')->nullable();
            $table->string('telefone', 20)->nullable();

            // created_by e updated_by BIGINT UNSIGNED
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->rememberToken();
            
            // created_at e updated_at
            $table->timestamps();

            // ÍNDICES (Conforme seu SQL)
            // A chave estrangeira será criada na outra migration para evitar erro de ordem
            $table->unique(['inquilino_id', 'email'], 'uniq_inquilino_email');
            $table->index('inquilino_id', 'idx_inquilino_id');
            $table->index('email', 'idx_email');
            $table->index('ativo_sim', 'idx_active');
        });

        // ... tabelas de reset de senha e sessões continuam iguais
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

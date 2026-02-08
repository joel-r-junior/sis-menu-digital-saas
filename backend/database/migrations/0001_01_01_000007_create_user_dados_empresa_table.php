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
        Schema::create('user_dados_empresa', function (Blueprint $table) {
            // id_empresa INT(10) NOT NULL AUTO_INCREMENT
            $table->integer('id_empresa')->autoIncrement();

            // Chave Estrangeira (Deve ser integer para bater com id_inquilino)
            $table->integer('inquilino_id');
            
            // Definindo a relação (Foreign Key)
            // Isso impede que se apague um inquilino se ele tiver empresa vinculada
            $table->foreign('inquilino_id')
                ->references('id_inquilino')
                ->on('user_inquilinos')
                ->onDelete('restrict'); // ou 'cascade' se quiser apagar tudo junto

            $table->string('nome_empresa', 255);
            $table->string('razao_social', 255);
            $table->char('cnpj', 18)->nullable();
            $table->string('inscricao_estadual', 20)->nullable();
            $table->string('inscricao_municipal', 20)->nullable();

            // ENUMs no Postgres
            $table->enum('regime_tributario', ['Simples Nacional','Lucro Presumido','Lucro Real','Isento'])->nullable();

            $table->string('endereco', 255)->nullable();
            $table->string('bairro', 100)->nullable();
            $table->integer('cidade_id')->nullable();
            $table->integer('estado_id')->nullable();
            $table->char('cep', 9)->nullable();
            $table->string('telefone_principal', 15)->nullable();
            $table->string('email_principal', 255)->nullable();
            $table->string('nome_responsavel', 255)->nullable();
            $table->char('cpf_responsavel', 14)->nullable();

            // Dados Bancários
            $table->string('banco_nome', 100)->nullable();
            $table->string('agencia', 10)->nullable();
            $table->string('conta_corrente', 20)->nullable();
            $table->string('pix', 50)->nullable();
            
            $table->string('banco_nome_sec', 100)->nullable();
            $table->string('agencia_sec', 10)->nullable();
            $table->string('conta_corrente_sec', 20)->nullable();
            $table->string('pix_sec', 50)->nullable();
            
            $table->string('site_empresa', 255)->nullable();
            $table->string('logo_path', 255)->nullable();
            $table->date('data_fundacao')->nullable();
            $table->text('observacoes')->nullable();

            $table->enum('ativo', ['sim', 'nao'])->default('sim');

            $table->integer('usuario_criacao');
            $table->timestamp('data_criacao')->useCurrent();
            $table->integer('usuario_modif')->nullable();
            $table->timestamp('data_modif')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_dados_empresa');
    }
};

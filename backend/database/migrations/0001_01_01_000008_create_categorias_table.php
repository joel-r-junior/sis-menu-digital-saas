<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Criar a tabela
        Schema::create('categorias', function (Blueprint $table) {

            //Ids
            $table->integer('id_categoria')->autoIncrement();
            $table->integer('inquilino_id')->nullable();

            // Chave Estrangeira (impede cadastrar uma categoria para um inquilino inexistente)
            $table->foreign('inquilino_id')
                ->references('id_inquilino')
                ->on('user_inquilinos')
                ->onDelete('cascade');

            $table->string('nome_categoria');

            $table->enum('padrao', ['padrao', 'personalizada'])
                ->default('personalizada');

            //Auditoria
            $table->unsignedBigInteger('usuario_id');
            $table->timestamp('dtCadastro')->useCurrent();

            $table->unsignedBigInteger('idUsuarioModificacao')->nullable();
            $table->timestamp('dtModificacao')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        // 
        Schema::dropIfExists('categorias');
    }
};

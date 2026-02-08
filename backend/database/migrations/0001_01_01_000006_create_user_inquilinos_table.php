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
        Schema::create('user_inquilinos', function (Blueprint $table) {
            // id_inquilino INT(10) NOT NULL AUTO_INCREMENT
            $table->integer('id_inquilino')->autoIncrement();

            // Campos VARCHAR
            $table->string('nome_inquilino', 250);
            $table->string('cpf_inquilino', 25);
            $table->string('nome_empresa', 250);
            $table->string('tel_empresa', 100)->nullable();
            $table->string('email_empresa', 250)->nullable();
            $table->string('endereco_empresa', 250)->nullable();
            
            // Inteiros
            $table->integer('idcidade');
            $table->integer('idestado');
            
            $table->string('cep_empresa', 20)->nullable();
            $table->integer('plano_acesso_id');
            
            $table->string('nome_conta', 250);
            
            // valor_plano DECIMAL(5,2)
            $table->decimal('valor_plano', 5, 2);
            
            // Datas
            $table->date('data_assinatura');
            $table->date('data_venc_assinatura');
            
            $table->string('status_assinatura', 50)->default('Ativo');
            $table->string('forma_pgto', 100);
            
            $table->date('data_modificacao')->nullable();
            
            // Não tem timestamps padrão na sua estrutura SQL original, 
            // mas se quiser adicionar created_at/updated_at do Laravel, descomente abaixo:
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_inquilinos');
    }
};

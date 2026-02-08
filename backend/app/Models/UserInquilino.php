<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInquilino extends Model
{
    // Define o nome exato da tabela
    protected $table = 'user_inquilinos';
    
    // Define a chave primária personalizada
    protected $primaryKey = 'id_inquilino';

    // Desativa created_at/updated_at se sua tabela não tiver, 
    // mas na migration eu deixei comentado. Se não tiver as colunas, descomente abaixo:
    public $timestamps = false; 

    protected $fillable = [
        'nome_inquilino', 'cpf_inquilino', 'nome_empresa', 'email_empresa',
        'idcidade', 'idestado', 'plano_acesso_id', 'nome_conta', 
        'valor_plano', 'data_assinatura', 'data_venc_assinatura', 
        'status_assinatura', 'forma_pgto'
    ];
}
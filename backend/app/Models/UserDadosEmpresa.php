<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDadosEmpresa extends Model
{
    protected $table = 'user_dados_empresa';
    protected $primaryKey = 'id_empresa';

    // Configura os nomes personalizados de timestamp que você usou
    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_modif';

    protected $fillable = [
        'inquilino_id',
        'nome_empresa',
        'razao_social',
        'cnpj',
        'regime_tributario',
        'inscricao_estadual',
        'inscricao_municipal',
        'endereco',
        'bairro',
        'cep',
        'email_principal',
        'telefone_principal',
        'nome_responsavel',
        'cpf_responsavel',
        'logo_path',
        'usuario_criacao',
        'ativo'
    ];

    // Relacionamento: Uma Empresa pertence a um Inquilino
    public function inquilino()
    {
        return $this->belongsTo(UserInquilino::class, 'inquilino_id', 'id_inquilino');
    }
}

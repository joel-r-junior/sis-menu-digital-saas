<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';

    protected $fillable = [
        'inquilino_id',
        'nome_categoria',
        'padrao',
        'usuario_id',
    ];

    public function inquilino()
    {
        return $this->belongsTo(UserInquilino::class, 'inquilino_id', 'id_inquilino');
    }
}

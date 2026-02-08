<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Definição da Chave Primária Personalizada
    protected $primaryKey = 'id_users';

    // 2. Campos que podem ser preenchidos em massa
    protected $fillable = [
        'inquilino_id',
        'name',
        'email',
        'password',
        'role',          // Novo
        'ativo_sim',     // Novo
        'telefone',      // Novo
        'avatar',        // Novo
        'last_login_at', // Novo
        'last_login_ip'  // Novo
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'ativo_sim' => 'boolean', // Garante que o PHP entenda 1/0 como true/false
        'last_login_at' => 'datetime',
    ];

    // Relacionamento (Opcional, mas útil)
    public function inquilino()
    {
        return $this->belongsTo(UserInquilino::class, 'inquilino_id', 'id_inquilino');
    }
}
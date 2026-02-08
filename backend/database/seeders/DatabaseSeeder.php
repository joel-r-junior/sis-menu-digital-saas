<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\UserInquilino;
use App\Models\UserDadosEmpresa;
use App\Models\User;
use App\Models\Categoria;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        // 1. Chama o seeder das tabelas estados e cidades
        $this->call(EstadosCidadesSeeder::class);

        // 2. Criar o Inquilino
        $inquilino = UserInquilino::create([
            'nome_inquilino' => 'Admin Sistema',
            'cpf_inquilino' => '000.000.000-00',
            'nome_empresa' => 'Empresa Matriz',
            'idcidade' => 1383,
            'idestado' => 13,
            'plano_acesso_id' => 1,
            'nome_conta' => 'Conta Premium',
            'valor_plano' => 99.90,
            'data_assinatura' => now(),
            'data_venc_assinatura' => now()->addMonth(),
            'status_assinatura' => 'Ativo',
            'forma_pgto' => 'PIX'
        ]);

        // 3. Criar os Dados da Empresa
        UserDadosEmpresa::create([
            'inquilino_id' => $inquilino->id_inquilino,
            'nome_empresa' => 'Empresa Homologaçao',
            'razao_social' => 'Joel Foods LTDA',
            'cnpj' => '00.000.000/0001-00',
            'inscricao_estadual' => '01.004.823/001-12',
            'inscricao_municipal' => '12.345',
            'regime_tributario' => 'Simples Nacional',
            'cidade_id' => 1383,
            'estado_id' => 13,
            'telefone_principal' => '65996978884',
            'email_principal' => 'joel@teste.com',
            'nome_responsavel' => 'Joel Ribeiro',
            'usuario_criacao' => 1,
            'ativo' => 'sim'
        ]);

        // 4. Criar o Usuário vinculado a esse Inquilino
        User::create([
            'name' => 'Joel Admin',
            'email' => 'admin@teste.com',
            'password' => Hash::make('password'),
            'inquilino_id' => $inquilino->id_inquilino,
            // Adicionando os campos novos para teste
            'role' => 'proprietário', 
            'ativo_sim' => true,
            'telefone' => '65999999999'
        ]);

        // 5. Criar Categorias Iniciais para testar o Dashboard
        $categorias = ['Lanches Artesanais', 'Bebidas Geladas', 'Sobremesas'];
        
        foreach ($categorias as $cat) {
            Categoria::create([
                'nome_categoria' => $cat,
                'padrao' => 'padrao', // Enum correto
                'usuario_id' => 1,
                'inquilino_id' => null,
            ]);
        }
        
    }
}
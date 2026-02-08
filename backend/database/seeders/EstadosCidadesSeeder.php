<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class EstadosCidadesSeeder extends Seeder
{
    public function run(): void
    {
        // Limpa as tabelas antes de começar
        $this->command->info('Limpando tabelas antigas...');
        DB::statement('TRUNCATE TABLE cidades RESTART IDENTITY CASCADE');
        DB::statement('TRUNCATE TABLE estados RESTART IDENTITY CASCADE');

        // ==========================================
        // 1. IMPORTAR ESTADOS (estado.sql)
        // ==========================================
        $pathEstados = database_path('sql/estado.sql');
        
        if (!File::exists($pathEstados)) {
            $this->command->error("Arquivo estado.sql não encontrado!");
            return;
        }

        $this->command->info('Importando Estados...');
        $handle = fopen($pathEstados, "r");
        $estadosParaInserir = [];

        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                // O formato COPY do Postgres usa TAB (\t) para separar colunas
                // Ex: 1    Acre    AC    12    1    [68]
                $colunas = explode("\t", $line);

                // Verifica se a linha parece ser de dados (tem pelo menos 3 colunas e a primeira é numero)
                if (count($colunas) >= 3 && is_numeric($colunas[0])) {
                    $estadosParaInserir[] = [
                        'id'   => trim($colunas[0]),
                        'nome' => trim($colunas[1]),
                        'uf'   => trim($colunas[2]),
                        // Ignoramos ibge, pais e ddd por enquanto, ou adicione se tiver criado as colunas
                    ];
                }
            }
            fclose($handle);
        }

        if (count($estadosParaInserir) > 0) {
            DB::table('estados')->insert($estadosParaInserir);
            $this->command->info("✅ " . count($estadosParaInserir) . " estados inseridos.");
        }

        // ==========================================
        // 2. IMPORTAR CIDADES (cidade.sql)
        // ==========================================
        $pathCidades = database_path('sql/cidade.sql');

        if (!File::exists($pathCidades)) {
            $this->command->error("Arquivo cidade.sql não encontrado!");
            return;
        }

        $this->command->info('Importando Cidades (isso pode levar alguns segundos)...');
        $handle = fopen($pathCidades, "r");
        $cidadesParaInserir = [];
        $lote = []; // Vamos inserir de 1000 em 1000 para não travar

        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                // Formato esperado do seu arquivo:
                // ID (tab) Nome (tab) Estado_ID (uf integer) ...
                $colunas = explode("\t", $line);

                if (count($colunas) >= 3 && is_numeric($colunas[0])) {
                    $lote[] = [
                        'id'        => trim($colunas[0]),
                        'nome'      => trim($colunas[1]),
                        'estado_id' => trim($colunas[2]) // No seu arquivo a coluna 3 é o ID do estado
                    ];

                    // Se o lote encheu, insere e limpa
                    if (count($lote) >= 1000) {
                        DB::table('cidades')->insert($lote);
                        $lote = [];
                        echo "."; // Feedback visual
                    }
                }
            }
            
            // Insere o resto que sobrou no lote
            if (count($lote) > 0) {
                DB::table('cidades')->insert($lote);
            }
            
            fclose($handle);
            $this->command->newLine();
            $this->command->info("✅ Cidades importadas com sucesso!");
        }
    }
}
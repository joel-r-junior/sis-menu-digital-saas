<?php

namespace App\Http\Controllers;

use App\Models\UserDadosEmpresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EmpresaController extends Controller
{
    /**
     * Busca os dados da empresa do usuário logado
     */
    public function show()
    {
        $user = Auth::user();

        // Busca a empresa vinculada ao inquilino deste usuário
        $empresa = UserDadosEmpresa::where('inquilino_id', $user->inquilino_id)->first();

        if (!$empresa) {
            return response()->json(['message' => 'Empresa não cadastrada'], 404);
        }

        return response()->json($empresa);
    }

    /**
     * Cria ou Atualiza os dados da empresa
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // 1. Validação básica
        $request->validate([
            'nome_empresa'    => 'required|string|max:255',
            'cnpj'            => 'nullable|string|max:18',
            'email_principal' => 'nullable|email',
            'logo'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
        ]);

        // 2. 
        // Pega TUDO que veio do formulário, exceto a 'logo'
        // e exceto campos de controle que não devem vir do form
        $dadosFormulario = $request->except(['logo', 'usuario_criacao', 'ativo']);

        // Define os valores forçados pelo sistema
        $dadosSistema = [
            'usuario_criacao' => $user->id_users,
            'ativo'           => 'sim',
            'inquilino_id'    => $user->inquilino_id,
            // Fallbacks (se não vier do form, usa padrão)
            'cidade_id'       => $request->cidade_id ?? 1,
            'estado_id'       => $request->estado_id ?? 1,
            'razao_social'    => $request->razao_social ?? $request->nome_empresa,
        ];

        // Funde os dois arrays
        $dadosParaSalvar = array_merge($dadosFormulario, $dadosSistema);

        // 3. Tenta buscar a empresa existente
        $empresa = UserDadosEmpresa::where('inquilino_id', $user->inquilino_id)->first();

        // 3. Lógica de Upload da Imagem
        if ($request->hasFile('logo') && $request->file('logo')->isValid()) {
            if ($empresa && $empresa->logo_path) {

                // ###Nota: Se usar S3 mudar a lógica de delete.
                $pathRelativo = str_replace(Storage::url(''), '', $empresa->logo_path);
                Storage::disk('public')->delete($pathRelativo);
            }

            $path = $request->file('logo')->store('logos', 'public');
            $dadosParaSalvar['logo_path'] = Storage::url($path);
        }

        // 4. Salvar ou Atualizar
        $empresa = UserDadosEmpresa::updateOrCreate(
            ['inquilino_id' => $user->inquilino_id],
            $dadosParaSalvar // <--- Array completo aqui
        );

        return response()->json([
            'message' => 'Dados atualizados com sucesso!',
            'data' => $empresa
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Categoria; // Importante: Importar o Model
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    // ... outros métodos (index, create) ...
    public function index()
    {
        // Retorna todas as categorias em formato JSON
        $categorias = \App\Models\Categoria::all();
        
        return response()->json($categorias, 200);
    }


    //Método criar categoria
    public function store(Request $request)
    {
        // 1. Validação (Opcional mas recomendado)
        $request->validate([
            'nome_categoria' => 'required|max:255',
            'usuario_id'     => 'required|integer', // Supondo que venha do form ou sessão
        ]);

        // 2. Criação usando o Model
        // Como configuramos o $fillable no Model, podemos passar o array direto
        $categoria = Categoria::create([
            'nome_categoria' => $request->nome_categoria,
            'padrao'         => $request->padrao ?? 'personalizada', // Se não vier, usa o default
            'usuario_id'     => $request->usuario_id,
            // dtCadastro é automático pelo banco
            // id_categoria é automático pelo banco
        ]);

        // 3. Retorno (pode ser um JSON ou redirecionamento)
        return response()->json([
            'message' => 'Categoria criada com sucesso!',
            'data'    => $categoria
        ], 201);
    }
    
    // ... outros métodos ...
}
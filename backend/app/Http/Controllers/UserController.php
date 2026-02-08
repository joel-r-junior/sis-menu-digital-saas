<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // LISTAR TODOS
    public function index()
    {
        $usuarios = User::all();
        return response()->json($usuarios);
    }

    // BUSCAR APENAS UM
    public function show($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        return response()->json($usuario);
    }

    // CRIAR NOVO USUÁRIO
    public function store(Request $request)
    {
        $validated = $request->validate([
            'inquilino_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string'
        ]);

        // Se o Cast 'hashed' no Model não funcionar por algum motivo, forçamos aqui:
        if (!isset($validated['password'])) {
             $validated['password'] = Hash::make($request->password);
        }
        
        // Define ativo como true por padrão
        $validated['ativo_sim'] = true;

        $usuario = User::create($validated);

        return response()->json([
            'mensagem' => 'Usuário criado com sucesso!',
            'usuario' => $usuario
        ], 201);
    }

    // ATUALIZAR USUÁRIO
    public function update(Request $request, $id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:usuarios,email,' . $id,
        ]);

        $usuario->update($validated);

        return response()->json([
            'mensagem' => 'Usuário atualizado com sucesso!',
            'usuario' => $usuario
        ]);
    }

    // DELETAR USUÁRIO
    public function destroy($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(['mensagem' => 'Usuário deletado com sucesso!']);
    }
}
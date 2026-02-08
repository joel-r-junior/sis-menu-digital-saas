<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;


// Rotas Públicas
Route::post('/login', [AuthController::class, 'login']);

Route::get('/usuarios/{id}', [UserController::class, 'show']);
Route::post('/usuarios', [UserController::class, 'store']); 
Route::put('/usuarios/{id}', [UserController::class, 'update']);
Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);

// Rotas Protegidas (Exigem Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/usuarios', [UserController::class, 'index']);

    Route::apiResource('categorias', CategoriaController::class);
    
    Route::get('/empresa', [App\Http\Controllers\EmpresaController::class, 'show']);
    Route::post('/empresa', [App\Http\Controllers\EmpresaController::class, 'store']);
    
});
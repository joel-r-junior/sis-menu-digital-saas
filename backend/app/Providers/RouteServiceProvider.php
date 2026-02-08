<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Carrega rotas de API
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // Carrega rotas web
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}

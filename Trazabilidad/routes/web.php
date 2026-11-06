<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TipoBolsaController;
use App\Http\Controllers\RemitoRecepcionController;
use App\Http\Controllers\TamanioController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\BolsaController;
use App\Http\Controllers\RemitoSalidaRetiroController;
use App\Http\Controllers\IncidenciaController;
use App\Models\Bolsa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'can:manage-administration'])->group(function () {
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::inertia('bolsas/create', 'bolsas/Crear')->name('bolsas.create');
    Route::resource('tipos-bolsa',TipoBolsaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('tamanios', TamanioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('servicios', ServicioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('remitos-recepcion', RemitoRecepcionController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('bolsas', BolsaController::class)->only(['index', 'store', 'update', 'destroy']);

    // Módulo Remitos de Salida (Despacho DGM y Conciliación)[cite: 1]
    Route::resource('remitos-salida', RemitoSalidaRetiroController::class);

    // Módulo Incidencias
    Route::resource('incidencias', IncidenciaController::class);
    Route::put('incidencias/{incidencia}/resolver', [IncidenciaController::class, 'resolver'])->name('incidencias.resolver');

    // Endpoint API para la validación del escáner en vivo
    Route::get('api/bolsas/buscar-para-despacho', function (Request $request) {
        $codigo = $request->query('codigo');

        if (!$codigo) {
            return response()->json(['message' => 'Código de barras no proporcionado'], 400);
        }

        $bolsa = Bolsa::where('codigo_barra', $codigo)->first();

        if (!$bolsa) {
            return response()->json(['message' => 'No se encontró ninguna bolsa con ese código.'], 404);
        }

        if ($bolsa->rem_sal_id !== null || $bolsa->estado === 'despachada') {
            return response()->json(['message' => 'La bolsa ya fue despachada anteriormente.'], 422);
        }

        if (empty($bolsa->peso)) {
            return response()->json(['message' => 'La bolsa aún no registra pesaje y no puede ser despachada.'], 422);
        }

        return response()->json($bolsa);
    });
});

require __DIR__.'/settings.php';

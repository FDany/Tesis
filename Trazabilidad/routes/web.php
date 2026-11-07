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
    Route::resource('tipos-bolsa', TipoBolsaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('tamanios', TamanioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('servicios', ServicioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('remitos-recepcion', RemitoRecepcionController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('bolsas', BolsaController::class)->only(['index', 'store', 'update', 'destroy']);

    // Módulo Remitos de Salida (Despacho Interno y Conciliación DGM)
    Route::resource('remitos-salida', RemitoSalidaRetiroController::class);
    Route::post('remitos-salida/{remito}/conciliar', [RemitoSalidaRetiroController::class, 'conciliar'])->name('remitos-salida.conciliar');
    Route::get('remitos-salida/{remito}/pdf', [RemitoSalidaRetiroController::class, 'descargarPdf'])->name('remitos-salida.pdf');

    // Módulo Incidencias
    Route::get('incidencias/crear', [IncidenciaController::class, 'create'])->name('incidencias.create');
    Route::post('incidencias/{incidencia}/resolver', [IncidenciaController::class, 'resolver'])->name('incidencias.resolver');
    Route::resource('incidencias', IncidenciaController::class);

    // Endpoint API para la validación del escáner en vivo
    Route::get('api/bolsas/buscar-para-despacho', function (Request $request) {
        $codigo = $request->query('codigo');

        if (!$codigo) {
            return response()->json(['message' => 'Código de barras no proporcionado.'], 400);
        }

        $bolsa = Bolsa::where('codigo_barra', $codigo)->first();

        if (!$bolsa) {
            return response()->json(['message' => 'No se encontró ninguna bolsa con ese código.'], 404);
        }

        // 1. Validar si ya fue despachada o retirada por el transporte DGM
        if ($bolsa->rem_sal_id !== null || in_array($bolsa->estado, ['DESPACHADA', 'RETIRADA POR DGM', 'TRATADA / DISPOSICIÓN FINAL'])) {
            return response()->json([
                'message' => "La bolsa {$bolsa->codigo_barra} ya se encuentra en estado '{$bolsa->estado}' y no puede ser despachada nuevamente."
            ], 422);
        }

        // 2. Exigir estrictamente que haya pasado por el proceso de pesaje en depósito
        if ($bolsa->estado !== 'PESADA' || empty($bolsa->peso)) {
            return response()->json([
                'message' => "La bolsa {$bolsa->codigo_barra} está en estado '{$bolsa->estado}'. Debe ser registrada y pesada en depósito antes de emitir un despacho."
            ], 422);
        }

        return response()->json($bolsa);
    });
});

require __DIR__ . '/settings.php';

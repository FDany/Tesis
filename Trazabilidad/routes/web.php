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
use App\Http\Controllers\ResiduoController;
use App\Http\Controllers\RecepcionDepositoController;
use App\Http\Controllers\PesajeDepositoController;
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
    Route::resource('remitos-recepcion', RemitoRecepcionController::class)->only(['index', 'create', 'store', 'show', 'update', 'destroy']);
    Route::resource('bolsas', BolsaController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

    Route::get('/remitos-recepcion/{remito}/pdf', [RemitoRecepcionController::class, 'generarPdf'])
        ->name('remitos-recepcion.pdf');

     // Módulo Remitos de Salida (Despacho Interno y Conciliación DGM)
    Route::resource('remitos-salida', RemitoSalidaRetiroController::class);
    Route::post('remitos-salida/{remito}/conciliar', [RemitoSalidaRetiroController::class, 'conciliar'])->name('remitos-salida.conciliar');
    Route::get('remitos-salida/{remito}/pdf', [RemitoSalidaRetiroController::class, 'descargarPdf'])->name('remitos-salida.pdf');

    // Módulo Incidencias
    Route::get('incidencias/crear', [IncidenciaController::class, 'create'])->name('incidencias.create');
    Route::patch('incidencias/{incidencia}/resolver', [IncidenciaController::class,'resolver',])->name('incidencias.resolver');
    Route::resource('incidencias', IncidenciaController::class);

    // Endpoint API para la validación del escáner en tiempo real
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

    // Módulo Residuos
    Route::get('residuos', [ResiduoController::class, 'create'])->name('residuos.create');
    Route::post('residuos', [ResiduoController::class, 'store'])->name('residuos.store');

    // Validación del escáner en tiempo real para el módulo de residuos
    Route::get(
        'api/bolsas/buscar-para-entrega',
        [ResiduoController::class, 'verificarBolsa'],
    )->name('residuos.verificar-bolsa');

    // Módulo Recepción en Depósito
    Route::post(
        'recepciones-deposito',
        [RecepcionDepositoController::class, 'store'],
    )->name('recepciones-deposito.store');

    // Vista de creación de recepción en depósito
    Route::get(
        'recepciones-deposito',
        [RecepcionDepositoController::class, 'create'],
    )->name('recepciones-deposito.create');

    // Validacion del escaner en tiempo real para recepción en deposito
    Route::get(
        'api/bolsas/buscar-para-recepcion-deposito',
        [RecepcionDepositoController::class, 'verificarBolsa'],
    )->name('recepciones-deposito.verificar-bolsa');


    // Módulo Pesaje en Depósito
    Route::get(
        'pesaje-deposito',
        [PesajeDepositoController::class, 'create'],
    )->name('pesaje-deposito.create');

    Route::post(
        'pesaje-deposito',
        [PesajeDepositoController::class, 'store'],
    )->name('pesaje-deposito.store');
    });

require __DIR__.'/settings.php';

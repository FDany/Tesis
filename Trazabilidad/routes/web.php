<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TipoBolsaController;
use App\Http\Controllers\RemitoRecepcionController;
use App\Http\Controllers\TamanioController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\BolsaController;
use App\Http\Controllers\RemitoSalidaRetiroController;
use App\Http\Controllers\IncidenciaController;
use App\Http\Controllers\RemitoEntregaServicioController;
use App\Http\Controllers\RecepcionDepositoController;
use App\Http\Controllers\PesajeDepositoController;
use App\Http\Controllers\DashboardController;
use App\Models\Bolsa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::resource('permisos', PermissionController::class)->except(['show', 'edit', 'create']);

    // Excel
    Route::get('/bolsas/export', [BolsaController::class, 'export'])->name('bolsas.export');

    Route::inertia('bolsas/create', 'bolsas/Crear')->name('bolsas.create');
    Route::resource('tipos-bolsa', TipoBolsaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('tamanios', TamanioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('servicios', ServicioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('remitos-recepcion', RemitoRecepcionController::class)->only(['index', 'create', 'store', 'show', 'update', 'destroy']);
    Route::resource('bolsas', BolsaController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

    
    // Remito de recepcion para generar pdf
    Route::get('/remitos-recepcion/{remito}/pdf', [RemitoRecepcionController::class, 'generarPdf'])
        ->name('remitos-recepcion.pdf');
    // Remitos de recepcion envio email
    Route::post('/remitos-recepcion/{remito}/enviar-pdf', [RemitoRecepcionController::class, 'enviarPdf'])
        ->name('remitos-recepcion.enviar-pdf');

     // Módulo Remitos de Salida (Despacho Interno y Conciliación DGM)
    Route::resource('remitos-salida', RemitoSalidaRetiroController::class);
    Route::post('remitos-salida/{remito}/conciliar', [RemitoSalidaRetiroController::class, 'conciliar'])->name('remitos-salida.conciliar');
    Route::get('remitos-salida/{remito}/pdf', [RemitoSalidaRetiroController::class, 'descargarPdf'])->name('remitos-salida.pdf');

    // Módulo Incidencias
    Route::get('incidencias/crear', [IncidenciaController::class, 'create'])->name('incidencias.create');
    Route::patch('incidencias/{incidencia}/resolver', [IncidenciaController::class,'resolver',])->name('incidencias.resolver');
    Route::resource('incidencias', IncidenciaController::class);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
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

    // Módulo Remitos de Entrega al Servicio

    Route::resource(
        'remitos-entrega-servicio',
        RemitoEntregaServicioController::class,
    )->only(['index', 'create', 'store']);

    // Validación del escáner en tiempo real para el módulo de remitos de entrega al servicio
    Route::get(
        'api/bolsas/buscar-para-entrega',
        [RemitoEntregaServicioController::class, 'verificarBolsa'],
    )->name('remitos-entrega-servicio.verificar-bolsa');
    // Para descargar el remito de entrega al servicio en PDF
    Route::get(
        'remitos-entrega-servicio/{remito}/pdf',
        [RemitoEntregaServicioController::class, 'descargarPdf'],
    )->name('remitos-entrega-servicio.pdf');

    // Módulo Recepción en Depósito
    // Route::post(
    //     'recepciones-deposito',
    //     [RecepcionDepositoController::class, 'store'],
    // )->name('recepciones-deposito.store');

    // Vista de creación de recepción en depósito
    // Route::get(
    //     'recepciones-deposito',
    //     [RecepcionDepositoController::class, 'create'],
    // )->name('recepciones-deposito.create');

    // Validacion del escaner en tiempo real para recepción en deposito
    // Route::get(
    //     'api/bolsas/buscar-para-recepcion-deposito',
    //     [RecepcionDepositoController::class, 'verificarBolsa'],
    // )->name('recepciones-deposito.verificar-bolsa');
    Route::middleware('can:registrar recepcionDeposito')->group(function () {
        Route::post(
            'recepciones-deposito',
            [RecepcionDepositoController::class, 'store'],
        )->name('recepciones-deposito.store');
        Route::get(
            'recepciones-deposito',
            [RecepcionDepositoController::class, 'create'],
        )->name('recepciones-deposito.create');
        Route::get(
            'api/bolsas/buscar-para-recepcion-deposito',
            [RecepcionDepositoController::class, 'verificarBolsa'],
        )->name('recepciones-deposito.verificar-bolsa');
    });
    // Módulo Pesaje en Depósito
    // Route::get(
    //     'pesaje-deposito',
    //     [PesajeDepositoController::class, 'create'],
    // )->name('pesaje-deposito.create');

    // Route::post(
    //     'pesaje-deposito',
    //     [PesajeDepositoController::class, 'store'],
    // )->name('pesaje-deposito.store');
    Route::middleware('can:registrar pesajeBolsa')->group(function () {
        Route::get(
            'pesaje-deposito',
            [PesajeDepositoController::class, 'create'],
        )->name('pesaje-deposito.create');
        Route::post(
            'pesaje-deposito',
            [PesajeDepositoController::class, 'store'],
        )->name('pesaje-deposito.store');
    });
});

Route::middleware(['auth', 'can:manage-administration'])->group(function () {

});

require __DIR__.'/settings.php';

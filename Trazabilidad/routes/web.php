<?php

use App\Http\Controllers\BolsaController;
use App\Http\Controllers\BolsaScannerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncidenciaController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PesajeDepositoController;
use App\Http\Controllers\RecepcionDepositoController;
use App\Http\Controllers\RemitoEntregaServicioController;
use App\Http\Controllers\RemitoRecepcionController;
use App\Http\Controllers\RemitoSalidaRetiroController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\TamanioController;
use App\Http\Controllers\TipoBolsaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Administración (Usuarios, Roles y Permisos)
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::resource('permisos', PermissionController::class)->except(['show', 'edit', 'create']);

    // Catálogos Maestros
    Route::resource('tipos-bolsa', TipoBolsaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('tamanios', TamanioController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('servicios', ServicioController::class)->only(['index', 'store', 'update', 'destroy']);

    // Endpoints API centralizados del Escáner de Bolsas
    Route::prefix('api/bolsas')->group(function () {
        Route::get('verificar-alta', [BolsaScannerController::class, 'verificarParaAlta'])
            ->name('bolsas.verificar-alta');
        Route::get('buscar-para-entrega', [BolsaScannerController::class, 'buscarParaEntrega'])
            ->name('remitos-entrega-servicio.verificar-bolsa');
        Route::get('buscar-para-recepcion-deposito', [BolsaScannerController::class, 'buscarParaRecepcionDeposito'])
            ->name('recepciones-deposito.verificar-bolsa');
        Route::get('buscar-para-despacho', [BolsaScannerController::class, 'buscarParaDespacho'])
            ->name('remitos-salida.buscar-bolsa');
    });

    // Módulo Bolsas
    Route::get('/bolsas/export', [BolsaController::class, 'export'])->name('bolsas.export');
    Route::inertia('bolsas/create', 'bolsas/Crear')->name('bolsas.create');
    Route::resource('bolsas', BolsaController::class)->only(['index', 'show']);

    // Módulo Remitos de Recepción (Insumos)
    Route::resource('remitos-recepcion', RemitoRecepcionController::class)->only(['index', 'create', 'store', 'show']);
    Route::get('/remitos-recepcion/{remito}/pdf', [RemitoRecepcionController::class, 'generarPdf'])
        ->name('remitos-recepcion.pdf');
    Route::post('/remitos-recepcion/{remito}/enviar-pdf', [RemitoRecepcionController::class, 'enviarPdf'])
        ->name('remitos-recepcion.enviar-pdf');

    // Módulo Remitos de Entrega al Servicio
    Route::resource('remitos-entrega-servicio', RemitoEntregaServicioController::class)
        ->only(['index', 'create', 'store']);
    Route::get('remitos-entrega-servicio/{remito}/pdf', [RemitoEntregaServicioController::class, 'descargarPdf'])
        ->name('remitos-entrega-servicio.pdf');

    // Módulo Recepción en Depósito
    Route::get('recepciones-deposito', [RecepcionDepositoController::class, 'create'])
        ->name('recepciones-deposito.create');
    Route::post('recepciones-deposito', [RecepcionDepositoController::class, 'store'])
        ->name('recepciones-deposito.store');

    // Módulo Pesaje en Depósito
    Route::get('pesaje-deposito', [PesajeDepositoController::class, 'create'])
        ->name('pesaje-deposito.create');
    Route::post('pesaje-deposito', [PesajeDepositoController::class, 'store'])
        ->name('pesaje-deposito.store');

    // Módulo Remitos de Salida (Despacho Interno y Conciliación DGM)
    Route::resource('remitos-salida', RemitoSalidaRetiroController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('remitos-salida/{remito}/conciliar', [RemitoSalidaRetiroController::class, 'conciliar'])
        ->name('remitos-salida.conciliar');
    Route::get('remitos-salida/{remito}/pdf', [RemitoSalidaRetiroController::class, 'descargarPdf'])
        ->name('remitos-salida.pdf');

    // Módulo Incidencias
    Route::get('incidencias/create', [IncidenciaController::class, 'create'])->name('incidencias.create');
    Route::patch('incidencias/{incidencia}/resolver', [IncidenciaController::class, 'resolver'])->name('incidencias.resolver');
    Route::resource('incidencias', IncidenciaController::class)->only(['index', 'create', 'store', 'show']);
});

require __DIR__ . '/settings.php';

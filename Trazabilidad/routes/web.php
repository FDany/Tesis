<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TipoBolsaController;
use App\Http\Controllers\RemitoRecepcionController;
use App\Http\Controllers\TamanioController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\BolsaController;
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
});

require __DIR__.'/settings.php';

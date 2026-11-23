<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class ServicioController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    #[Middleware('permission:listar servicios')]
    public function index(Request $request): Response
    {
        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (! in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        return Inertia::render('servicios/index', [
            'servicios' => Servicio::select(['id', 'nombre', 'activo'])
                ->orderBy('id', 'asc')
                ->latest()
                ->paginate($porPagina)
                ->withQueryString(),
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
        ]);
    }

    #[Middleware('permission:crear servicios')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'activo' => 'boolean',
        ]);

        Servicio::create($validated);

        return redirect()->back()->with('success', 'Servicio creado correctamente');
    }

    #[Middleware('permission:editar servicios')]
    public function update(Request $request, Servicio $servicio): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'activo' => 'boolean',
        ]);

        $validated['activo'] = $request->boolean('activo');

        $servicio->update($validated);

        return redirect()->back()->with('success', 'Servicio actualizado correctamente');
    }

    #[Middleware('permission:eliminar servicios')]
    public function destroy(Servicio $servicio): RedirectResponse
    {
        $servicio->update(['activo' => false]);
        $servicio->delete();

        return redirect()->back()->with('success', 'Servicio desactivado/eliminado correctamente');
    }
}

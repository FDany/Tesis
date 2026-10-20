<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\TipoBolsa;
use Illuminate\Http\RedirectResponse;

class TipoBolsaController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (!in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        $tiposBolsa = TipoBolsa::select([
                'id',
                'tipo_residuo',
                'color',
                'proveedor',
            ])
            ->orderBy('id','asc')
            ->latest()
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('tipos-bolsa/index', [
            'tiposBolsa' => $tiposBolsa,
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tipo_residuo' => 'required|string|max:100',
            'color'        => 'required|string|max:50',
            'proveedor'    => 'required|string|max:100',
        ]);

        TipoBolsa::create($validated);

        return redirect()->back()->with('success', 'Tipo de bolsa creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipoBolsa $tipos_bolsa): RedirectResponse
    {
        $validated = $request->validate([
            'tipo_residuo' => 'required|string|max:100',
            'color'        => 'required|string|max:50',
            'proveedor'    => 'required|string|max:100',
        ]);

        $tipos_bolsa->update($validated);

        return redirect()->back()->with('success', 'Tipo de bolsa actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoBolsa $tipos_bolsa): RedirectResponse
    {
        // Prevenimos eliminar registros que ya tengan bolsas asociadas
        if ($tipos_bolsa->bolsas()->exists()) {
            return redirect()->back()->withErrors([
                'error' => 'No se puede eliminar un tipo de bolsa en uso por bolsas registradas',
            ]);
        }

        $tipos_bolsa->delete();

        return redirect()->back()->with('success', 'Tipo de bolsa eliminado correctamente');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Servicio;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('servicios/index', [
            'servicios' => Servicio::select(['id', 'nombre', 'activo'])
                ->orderBy('id', 'asc')
                ->latest()
                ->get(),
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
            'nombre' => 'required|string|max:100',
            'activo' => 'boolean',
        ]);

        Servicio::create($validated);

        return redirect()->back()->with('success', 'Servicio creado correctamente');
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Servicio $servicio): RedirectResponse
    {
        $servicio->update(['activo' => false]);

        $servicio->delete(); // Llena la columna deleted_at

        return redirect()->back()->with('success', 'Servicio desactivado/eliminado correctamente');
    }
}

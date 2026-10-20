<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tamanio;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TamanioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('tamanios/index', [
            'tamanios' => Tamanio::select(['id', 'nombre'])
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
        ]);

        Tamanio::create($validated);

        return redirect()->back()->with('success', 'Tamaño de bolsa creado correctamente');
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
    public function update(Request $request, Tamanio $tamanio): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $tamanio->update($validated);

        return redirect()->back()->with('success', 'Tamaño de bolsa actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tamanio $tamanio): RedirectResponse
    {
        // Prevenimos eliminar registros que ya tengan bolsas asociadas
        if ($tamanio->bolsas()->exists()) {
            return redirect()->back()->withErrors([
                'error' => 'No se puede eliminar un tamaño de bolsa en uso por bolsas registradas',
            ]);
        }

        $tamanio->delete();

        return redirect()->back()->with('success', 'Tamaño de bolsa eliminado correctamente');
    }
}

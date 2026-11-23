<?php

namespace App\Http\Controllers;

use App\Models\Tamanio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class TamanioController extends Controller
{
    #[Middleware('permission:listar tamBolsas')]
    public function index(): Response
    {
        return Inertia::render('tamanios/index', [
            'tamanios' => Tamanio::select(['id', 'nombre'])
                ->orderBy('id', 'asc')
                ->latest()
                ->get(),
        ]);
    }

    #[Middleware('permission:crear tamBolsas')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        Tamanio::create($validated);

        return redirect()->back()->with('success', 'Tamaño de bolsa creado correctamente');
    }

    #[Middleware('permission:editar tamBolsas')]
    public function update(Request $request, Tamanio $tamanio): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $tamanio->update($validated);

        return redirect()->back()->with('success', 'Tamaño de bolsa actualizado correctamente');
    }

    #[Middleware('permission:eliminar tamBolsas')]
    public function destroy(Tamanio $tamanio): RedirectResponse
    {
        if ($tamanio->bolsas()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar un tamaño de bolsa en uso por bolsas registradas');
        }

        $tamanio->delete();

        return redirect()->back()->with('success', 'Tamaño de bolsa eliminado correctamente');
    }
}

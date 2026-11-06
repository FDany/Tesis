<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incidencia;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class IncidenciaController extends Controller
{
    /**
     * Muestra el listado de incidencias con filtros y paginación.
     */
    public function index(Request $request): Response
    {
        $query = Incidencia::with([
            'usuarioRegistra',
            'usuarioCierra',
            'remitoSalidaRetiro',
            'bolsa',
            'tipoBolsa',
            'servicio',
        ]);

        // Filtro por Estado (ej: ABIERTA, EN_ANALISIS, RESUELTA, CERRADA)
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        // Filtro por Tipo de Incidencia
        if ($request->filled('tipo_incidencia')) {
            $query->where('tipo_incidencia', $request->tipo_incidencia);
        }

        $incidencias = $query->latest('fecha_hora')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('incidencias/index', [
            'incidencias' => $incidencias,
            'filters'     => $request->only(['estado', 'tipo_incidencia']),
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Muestra el detalle de una incidencia específica.
     */
    public function show(Incidencia $incidencia): Response
    {
        $incidencia->load([
            'usuarioRegistra',
            'usuarioCierra',
            'remitoSalidaRetiro',
            'bolsa',
            'tipoBolsa',
            'servicio',
            'documentos',
        ]);

        return Inertia::render('incidencias/show', [
            'incidencia' => $incidencia,
        ]);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Actualiza la incidencia con las acciones adoptadas y la marca como resuelta/cerrada.
     */
    public function resolver(Request $request, Incidencia $incidencia): RedirectResponse
    {
        $validated = $request->validate([
            'acccion_adoptada' => 'required|string|min:5',
            'estado'           => 'required|string|in:EN_ANALISIS,RESUELTA,CERRADA',
        ]);

        $incidencia->update([
            'acccion_adoptada' => $validated['acccion_adoptada'],
            'estado'           => $validated['estado'],
            'usuario_cierra'   => $request->user()->id,
            'fecha_resolucion' => now(),
        ]);

        return redirect()->back()->with('message', "Incidencia #{$incidencia->id} actualizada correctamente.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

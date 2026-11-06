<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bolsa;
use App\Models\Incidencia;
use App\Models\RemitoSalidaRetiro;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RemitoSalidaRetiroController extends Controller
{
    /**
     * Muestra el historial de remitos de salida.
     */
    public function index()
    {
        $remitos = RemitoSalidaRetiro::with(['usuarioDespacha', 'incidencia'])
            ->withCount('bolsas')
            ->latest()
            ->paginate(15);

        return Inertia::render('remitos-salida/index', [
            'remitos' => $remitos,
        ]);
    }

    /**
     * Formulario de despacho y conciliación.
     */
    public function create()
    {
        return Inertia::render('remitos-salida/create');
    }

    /**
     * Guarda el remito de salida, actualiza las bolsas y evalúa la incidencia.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_remito' => 'required|string|max:50',
            'fecha_retiro' => 'required|date',
            'cantidad_bolsas_declaradas_Empresa' => 'required|integer|min:1',
            'responsable_empresa' => 'required|string|max:255',
            'datos_transporte' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
            'bolsas_ids' => 'required|array|min:1',
            'bolsas_ids.*' => 'exists:bolsas,id',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // 1. Crear la cabecera del remito de salida
            $remito = RemitoSalidaRetiro::create([
                'numero_remito' => $validated['numero_remito'],
                'fecha_retiro' => $validated['fecha_retiro'],
                'cantidad_bolsas_declaradas_Empresa' => $validated['cantidad_bolsas_declaradas_Empresa'],
                'responsable_empresa' => $validated['responsable_empresa'],
                'usuario_despacha_id' => $request->user()->id,
                'datos_transporte' => $validated['datos_transporte'] ?? null,
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            // 2. Asociar las bolsas escaneadas y cambiar su estado
            Bolsa::whereIn('id', $validated['bolsas_ids'])->update([
                'rem_sal_id' => $remito->id,
                'estado' => 'despachada',
            ]);

            // 3. Conciliación: Comparar cantidad del sistema vs. DGM
            $cantidadSistema = count($validated['bolsas_ids']);
            $cantidadDgm = (int) $validated['cantidad_bolsas_declaradas_Empresa'];

            // 4. Registrar la incidencia automática si hay discrepancia
            if ($cantidadSistema !== $cantidadDgm) {
                $diferencia = $cantidadSistema - $cantidadDgm;

                Incidencia::create([
                    'fecha_hora' => now(),
                    'usuario_registra' => $request->user()->id,
                    'rem_sal_id' => $remito->id,
                    'tipo_incidencia' => 'DISCREPANCIA_CONCILIACION_DGM',
                    'descripcion' => "Discrepancia en remito N° {$remito->numero_remito}: El sistema registró {$cantidadSistema} bolsas vs. {$cantidadDgm} declaradas por DGM. Diferencia: {$diferencia}.",
                    'estado' => 'ABIERTA',
                ]);
            }

            return redirect()->route('remitos-salida.index')
                ->with('message', $cantidadSistema !== $cantidadDgm
                    ? 'Remito guardado. Se generó una incidencia por discrepancia en la cantidad de bolsas.'
                    : 'Remito de salida registrado y conciliado exitosamente.');
        });
    }

    /**
     * Muestra el detalle de un remito de salida.
     */
    public function show(string $id)
    {
        $remito = RemitoSalidaRetiro::with(['usuarioDespacha', 'bolsas', 'incidencia'])
            ->withCount('bolsas')
            ->withSum('bolsas as peso_total_sistema', 'peso')
            ->findOrFail($id);

        return Inertia::render('remitos-salida/show', [
            'remito' => $remito,
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

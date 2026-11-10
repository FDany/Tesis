<?php

namespace App\Http\Controllers;

use App\Models\Bolsa;
use App\Models\RemitoEntregaServicio;
use App\Models\Servicio;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ResiduoController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('residuos/create', [
            'servicios' => Servicio::query()
                ->where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'servicio_id' => ['required', 'integer', 'exists:servicios,id'],
            'retira_nombre' => ['required', 'string', 'max:255'],
            'entregado_cargo' => ['required', 'string', 'max:255'],
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],
            'codigos.*' => ['required', 'string', 'distinct:strict', 'regex:/^\d{13}$/'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $servicio = Servicio::query()
                ->whereKey($validated['servicio_id'])
                ->where('activo', true)
                ->first();

            if (! $servicio) {
                throw ValidationException::withMessages([
                    'servicio_id' => 'El servicio no existe o está inactivo.',
                ]);
            }

            $bolsas = Bolsa::query()
                ->whereIn('codigo_barra', $validated['codigos'])
                ->lockForUpdate()
                ->get();

            $codigosNoEncontrados = array_diff(
                $validated['codigos'],
                $bolsas->pluck('codigo_barra')->all(),
            );

            if ($codigosNoEncontrados !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'No se encontraron estas bolsas: '
                        . implode(', ', $codigosNoEncontrados),
                ]);
            }

            $codigosNoDisponibles = $bolsas
                ->filter(fn (Bolsa $bolsa) =>
                    $bolsa->estado !== 'DISPONIBLE'
                    || $bolsa->remitos_serv_id !== null
                )
                ->pluck('codigo_barra')
                ->all();

            if ($codigosNoDisponibles !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'Estas bolsas no están disponibles: '
                        . implode(', ', $codigosNoDisponibles),
                ]);
            }

            $remito = RemitoEntregaServicio::create([
                'entrega_usuario_id' => $request->user()->id,
                'retira_nombre' => $validated['retira_nombre'],
                'entregado_cargo' => $validated['entregado_cargo'],
                'fecha_entrega' => now(),
                'servicio_id' => $servicio->id,
                'cantidad_bolsas_dadas' => $bolsas->count(),
            ]);

            foreach ($bolsas as $bolsa) {
                $bolsa->update([
                    'estado' => 'OCUPADO',
                    'remitos_serv_id' => $remito->id,
                ]);
            }

            return redirect()
                ->route('residuos.create')
                ->with('success', 'Bolsas entregadas al servicio correctamente.');
        });
    }
}
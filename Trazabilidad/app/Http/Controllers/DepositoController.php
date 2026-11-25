<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Models\Bolsa;
use App\Models\RecepcionDeposito;
use App\Services\AuditoriaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class DepositoController extends Controller
{
    #[Middleware('permission:gestionar deposito')]
    public function create(Request $request): Response
    {
        $puedeGestionar = $request->user()->can('gestionar deposito');

        return Inertia::render('deposito/create', [
            'puedeRecepcionar' => $puedeGestionar,
            'puedePesar' => $puedeGestionar,
        ]);
    }

    // ---------- Recepción en depósito ----------
    #[Middleware('permission:gestionar deposito')]
    public function storeRecepcion(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],
            'codigos.*' => [
                'required',
                'string',
                'distinct:strict',
                'regex:/^\d{13}$/',
            ],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $bolsas = Bolsa::query()
                ->whereIn('codigo_barra', $validated['codigos'])
                ->lockForUpdate()
                ->get();

            $codigosEncontrados = $bolsas->pluck('codigo_barra')->all();
            $codigosNoEncontrados = array_diff($validated['codigos'], $codigosEncontrados);

            if ($codigosNoEncontrados !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'No se encontraron estas bolsas: '
                        . implode(', ', $codigosNoEncontrados),
                ]);
            }

            $bolsasEstado = $bolsas
                ->filter(fn (Bolsa $bolsa) =>
                    $bolsa->estado !== EstadoBolsa::ENTREGADA_A_SERVICIO
                    || $bolsa->remitos_serv_id === null
                    || $bolsa->recep_dep_id !== null
                )
                ->pluck('codigo_barra')
                ->all();

            if ($bolsasEstado !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'Estas bolsas no están ocupadas por un servicio o ya fueron recibidas en depósito: '
                        . implode(', ', $bolsasEstado),
                ]);
            }

            $usuarioId = $request->user()->id;
            $fechaRecepcion = now();

            $recepcion = RecepcionDeposito::create([
                'fecha_hora' => $fechaRecepcion,
                'recibe_usuario_id' => $usuarioId,
            ]);

            foreach ($bolsas as $bolsa) {
                $estadoAnterior = $bolsa->estado->value;
                $recepDepAnterior = $bolsa->recep_dep_id;

                $bolsa->update([
                    'estado' => EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
                    'recep_dep_id' => $recepcion->id,
                ]);

                AuditoriaService::registrar(
                    bolsaId: $bolsa->id,
                    operacion: 'Recepción en depósito',
                    valorAnterior: [
                        'estado' => $estadoAnterior,
                        'recep_dep_id' => $recepDepAnterior,
                    ],
                    valorNuevo: [
                        'estado' => EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
                        'recep_dep_id' => $recepcion->id,
                    ],
                    responsableId: $usuarioId,
                    fechaHora: $fechaRecepcion,
                );
            }

            return back()->with('success', 'Bolsas recibidas en depósito correctamente.');
        });
    }

    // ---------- Pesaje en depósito ----------
    #[Middleware('permission:gestionar deposito')]
    public function storePesaje(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
            'peso' => ['required', 'numeric', 'gt:0'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $bolsa = Bolsa::query()
                ->where('codigo_barra', $validated['codigo'])
                ->lockForUpdate()
                ->first();

            if (! $bolsa) {
                throw ValidationException::withMessages([
                    'codigo' => 'No existe una bolsa con ese código.',
                ]);
            }

            if (
                $bolsa->estado !== EstadoBolsa::INGRESADA_AL_DEPOSITO
                || $bolsa->recep_dep_id === null
                || $bolsa->rem_sal_id !== null
            ) {
                throw ValidationException::withMessages([
                    'codigo' => 'La bolsa no está pendiente de pesaje en depósito.',
                ]);
            }

            $usuarioId = $request->user()->id;
            $fechaPesaje = now();
            $estadoAnterior = $bolsa->estado->value;
            $pesoAnterior = $bolsa->peso;

            $bolsa->update([
                'peso' => $validated['peso'],
                'estado' => EstadoBolsa::PESADA->value,
            ]);

            AuditoriaService::registrar(
                bolsaId: $bolsa->id,
                operacion: 'Pesaje en depósito',
                valorAnterior: [
                    'estado' => $estadoAnterior,
                    'peso' => $pesoAnterior,
                ],
                valorNuevo: [
                    'estado' => EstadoBolsa::PESADA->value,
                    'peso' => $validated['peso'],
                ],
                responsableId: $usuarioId,
                fechaHora: $fechaPesaje,
            );

            return back()->with(
                'success',
                "Bolsa {$bolsa->codigo_barra} pesada correctamente.",
            );
        });
    }
}

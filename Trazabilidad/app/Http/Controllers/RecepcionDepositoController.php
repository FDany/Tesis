<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bolsa;
use App\Models\RecepcionDeposito;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class RecepcionDepositoController extends Controller
{


    public function create(): Response
    {
        return Inertia::render('recepciones-deposito/create');
    }


    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],
            'codigos.*' => [
                'required',
                'string',
                'distinct:strict',
                'regex:/^\d{13}$/',     // Valida que cada código sea un string de 13 dígitos
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
                    $bolsa->estado !== 'OCUPADO'
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

            $recepcion = RecepcionDeposito::create([
                'fecha_hora' => now(),
                'recibe_usuario_id' => $request->user()->id,
            ]);

            foreach ($bolsas as $bolsa) {
                $bolsa->update([
                    'estado' => 'EN_DEPOSITO',
                    'recep_dep_id' => $recepcion->id,
                ]);
            }

            return back()->with('success', 'Bolsas recibidas en depósito correctamente.');
        });
    }

    public function verificarBolsa(Request $request): JsonResponse
    {
        // Validación de la entrada (codigo de barras)
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
        ]);

        // Busca la bolsa por el código de barras
        $bolsa = Bolsa::query()
            ->where('codigo_barra', $validated['codigo'])
            ->first();

        // Si no se encuentra la bolsa, retornamos un error 404
        if (! $bolsa) {
            return response()->json([
                'message' => 'No existe una bolsa con ese código.',
            ], 404);
        }

        // Validación de estado y si tiene remitos asociados
        if (
            $bolsa->estado !== 'OCUPADO'
            || $bolsa->remitos_serv_id === null
            || $bolsa->recep_dep_id !== null
        ) {
            return response()->json([
                'message' => "La bolsa {$bolsa->codigo_barra} no está pendiente de recepción desde un servicio. Estado actual: {$bolsa->estado}.",
            ], 422);
        }

        // Retorna la información de la bolsa si pasa todas las validaciones
        return response()->json([
            'id' => $bolsa->id,
            'codigo_barra' => $bolsa->codigo_barra,
            'estado' => $bolsa->estado,
        ]);
    }
}

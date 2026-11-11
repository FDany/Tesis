<?php

namespace App\Http\Controllers;

use App\Models\Bolsa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PesajeDepositoController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('pesaje-deposito/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
            'peso' => ['required', 'numeric', 'gt:0'],
        ]);

        return DB::transaction(function () use ($validated) {
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
                $bolsa->estado !== 'EN_DEPOSITO'
                || $bolsa->recep_dep_id === null
                || $bolsa->rem_sal_id !== null
            ) {
                throw ValidationException::withMessages([
                    'codigo' => 'La bolsa no está pendiente de pesaje en depósito.',
                ]);
            }

            $bolsa->update([
                'peso' => $validated['peso'],
                'estado' => 'PESADA',
            ]);

            return back()->with(
                'success',
                "Bolsa {$bolsa->codigo_barra} pesada correctamente.",
            );
        });
    }
}
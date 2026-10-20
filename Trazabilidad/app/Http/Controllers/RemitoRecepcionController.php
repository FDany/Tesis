<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RemitoRecepcion;
use App\Models\Bolsa;
use App\Models\TipoBolsa;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Tamanio;

class RemitoRecepcionController extends Controller
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

        $remitos = RemitoRecepcion::with([
            'usuarioRecep',
            'tipoBolsa',
            'tamanio'
        ])
            ->orderBy('fecha_recepcion')
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('remitos-recepcion/index', [
            'remitos' => $remitos,
            'tiposBolsa' => TipoBolsa::all(),
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
            'tamanios' => Tamanio::all(),
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
            'fecha_recepcion'    => 'required|date',
            'observaciones'      => 'nullable|string',
            'codigo_inicio' => ['required', 'string', 'regex:/^\d{1,4}-\d{1,9}$/'],
            'codigo_fin'    => ['required', 'string', 'regex:/^\d{1,4}-\d{1,9}$/'],
            'tipo_bolsa_id'      => 'required|exists:tipos_bolsa,id',
            'cantidad_declarada' => 'required|integer|min:1|max:1000',      //control de cantidad ingresada
            'tamanio_id'         => 'required|exists:tamanios,id', // Validar que el tamaño exista en la tabla tamanios
        ]);

        // Extraer prefijos y correlativos del rango
        [$prefijoInicio, $correlativoInicio] = explode('-', $validated['codigo_inicio']);
        [$prefijoFin, $correlativoFin]       = explode('-', $validated['codigo_fin']);

        $inicioInt = (int) $correlativoInicio;
        $finInt    = (int) $correlativoFin;

        // Compara los prefijos ignorando ceros iniciales: 3 y 0003 se consideran iguales.
        $prefijoInicioNormalizado = ltrim($prefijoInicio, '0') ?: '0';
        $prefijoFinNormalizado = ltrim($prefijoFin, '0') ?: '0';

        if ($prefijoInicioNormalizado !== $prefijoFinNormalizado) {
            return back()->withErrors([
                'codigo_fin' => 'El código inicial y el final deben tener el mismo prefijo.',
            ]);
        }

        if ($inicioInt > $finInt) {
            return back()->withErrors([
                'codigo_inicio' => 'El código inicial no puede ser mayor al final.',
            ]);
        }

        $cantidadEnRango = $finInt - $inicioInt + 1;

        if ($cantidadEnRango !== (int) $validated['cantidad_declarada']) {
            return back()->withErrors([
                'cantidad_declarada' => 'La cantidad declarada debe coincidir con la cantidad de códigos del rango.',
            ]);
        }

        DB::transaction(function () use ($validated, $request, $prefijoInicio, $inicioInt, $finInt) {
            $validated['recep_usuario_id'] = $request->user()->id;

            $remito = RemitoRecepcion::create($validated);

            $bolsasData = [];
            $now = now();

            for ($i = $inicioInt; $i <= $finInt; $i++) {
                $prefijoFormatted     = str_pad($prefijoInicio, 4, '0', STR_PAD_LEFT);
                $correlativoFormatted = str_pad($i, 9, '0', STR_PAD_LEFT);
                $codigo13Digitos      = $prefijoFormatted . $correlativoFormatted;

                $bolsasData[] = [
                    'codigo_barra'  => $codigo13Digitos,
                    'tipo_bolsa_id' => $validated['tipo_bolsa_id'],
                    'tamanio_id'    => $validated['tamanio_id'],
                    'estado'        => 'no_recibido',
                    'rem_rep_id'    => $remito->id,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ];
            }

            Bolsa::insert($bolsasData);
        });

        return redirect()->back()->with('success', 'Remito registrado y bolsas generadas correctamente.');
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

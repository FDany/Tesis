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
use Barryvdh\DomPDF\Facade\Pdf; 
use Illuminate\Validation\ValidationException;

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
        return Inertia::render('remitos-recepcion/crear', [
            'tiposBolsa' => TipoBolsa::all(),
            'tamanios' => Tamanio::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],
            'codigos.*' => [
                'required',
                'string',
                'distinct:strict',
                'regex:/^\d{13}$/',
            ],
            'fecha_recepcion'    => 'required|date',
            'observaciones'      => 'nullable|string',
            'codigo_inicio'      => ['required', 'string', 'regex:/^\d{1,4}-\d{1,9}$/'],
            'codigo_fin'         => ['required', 'string', 'regex:/^\d{1,4}-\d{1,9}$/'],
            'tipo_bolsa_id'      => 'required|exists:tipos_bolsa,id',
            'cantidad_declarada' => 'required|integer|min:1|max:1000', // control de cantidad ingresada
            'tamanio_id'         => 'required|exists:tamanios,id', // Valida que el tamaño exista en la tabla tamanios
        ]);

        // Validar que la cantidad declarada coincida con la cantidad de códigos proporcionados
        $codigos = $validated['codigos'];
        unset($validated['codigos']);

        // Extraer prefijos y correlativos del rango
        [$prefijoInicio, $correlativoInicio] = explode('-', $validated['codigo_inicio']);
        [$prefijoFin, $correlativoFin] = explode('-', $validated['codigo_fin']);

        $inicioInt = (int) $correlativoInicio;
        $finInt = (int) $correlativoFin;

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

        if (count($codigos) !== (int) $validated['cantidad_declarada']) {
            throw ValidationException::withMessages([
                'codigos' => 'La cantidad de códigos debe coincidir con la cantidad declarada.',
            ]);
        }

        $prefijoFormateado = str_pad($prefijoInicio, 4, '0', STR_PAD_LEFT);
        $codigosEsperados = [];

        // Generar los códigos esperados en el rango (de parte del controlador)
        for ($i = $inicioInt; $i <= $finInt; $i++) {
            $codigosEsperados[] = $prefijoFormateado
                . str_pad((string) $i, 9, '0', STR_PAD_LEFT);
        }

        $codigosRecibidosOrdenados = $codigos;
        sort($codigosRecibidosOrdenados, SORT_STRING);
        sort($codigosEsperados, SORT_STRING);

        // Valida los codigos generados por el controlador con los codigos recibidos de la vista
        if ($codigosRecibidosOrdenados !== $codigosEsperados) {
            throw ValidationException::withMessages([
                'codigos' => 'Los códigos ingresados no coinciden con el rango declarado.',
            ]);
        }

        DB::transaction(function () use ($validated, $codigos, $request) {
            $codigosExistentes = Bolsa::query()
                ->whereIn('codigo_barra', $codigos)
                ->lockForUpdate()
                ->pluck('codigo_barra')
                ->all();

            if ($codigosExistentes !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'Estos códigos de barra ya están registrados: '
                        . implode(', ', $codigosExistentes),
                ]);
            }

            $validated['recep_usuario_id'] = $request->user()->id;

            $remito = RemitoRecepcion::create($validated);

            $bolsasData = [];
            $now = now();

            foreach ($codigos as $codigo13Digitos) {
                $bolsasData[] = [
                    'codigo_barra'  => $codigo13Digitos,
                    'tipo_bolsa_id' => $validated['tipo_bolsa_id'],
                    'tamanio_id'    => $validated['tamanio_id'],
                    'estado'        => 'DISPONIBLE',
                    'rem_rep_id'    => $remito->id,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ];
            }

            Bolsa::insert($bolsasData);
        });

        // return redirect()->back()->with('success', 'Remito registrado y bolsas generadas correctamente.');

        return redirect()
            ->route('remitos-recepcion.index')
            ->with('success', 'Remito registrado y bolsas generadas correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id): Response|RedirectResponse
    {
        $esVisitaParcialDelIndice =
            $request->header('X-Inertia-Partial-Component') === 'remitos-recepcion/index'
            && in_array(
                'remitoDetalle',
                explode(',', (string) $request->header('X-Inertia-Partial-Data')),
                true
            );

        if (!$esVisitaParcialDelIndice) {
            return redirect()->route('remitos-recepcion.index');
        }

        $remito = RemitoRecepcion::with([
            'tipoBolsa',
            'tamanio',
            'usuarioRecep',
        ])->findOrFail($id);

        $codigos = $remito->bolsas()
            ->orderBy('id')
            ->pluck('codigo_barra');


        return Inertia::render('remitos-recepcion/index', [
            'remitoDetalle' => [
                'id' => $remito->id,
                'fecha_recepcion' => $remito->fecha_recepcion,
                'tipo_bolsa' => $remito->tipoBolsa ? [
                    'tipo_residuo' => $remito->tipoBolsa->tipo_residuo,
                    'color' => $remito->tipoBolsa->color,
                    'proveedor' => $remito->tipoBolsa->proveedor,
                ] : null,
                'cantidad_declarada' => $remito->cantidad_declarada,
                'cantidad_bolsas' => $codigos->count(),
                'codigo_inicio' => $remito->codigo_inicio,
                'codigo_fin' => $remito->codigo_fin,
                'observaciones' => $remito->observaciones,
                'usuario_recep' => $remito->usuarioRecep ? [
                    'first_name' => $remito->usuarioRecep->first_name,
                    'last_name' => $remito->usuarioRecep->last_name,
                ] : null,
                'tamanio' => $remito->tamanio ? [
                    'nombre' => $remito->tamanio->nombre,
                ] : null,
                'bolsas' => $codigos,
            ],
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

    public function generarPdf(RemitoRecepcion $remito)
    {
        $remito->load([
            'usuarioRecep',
            'tipoBolsa',
            'tamanio',
            'bolsas' => fn ($query) => $query->orderBy('id'),
        ]);

        return Pdf::loadView('remitorecepcion.generarremitorecepcion', [
            'remito' => $remito,
        ])->download("remito-recepcion-{$remito->id}.pdf");
    }
}

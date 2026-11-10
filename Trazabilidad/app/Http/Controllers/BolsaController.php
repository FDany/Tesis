<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Bolsa;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BolsaController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {

        $buscar = trim($request->input('buscar', ''));
        $estado = $request->input('estado', '');

        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (!in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        $bolsas = Bolsa::with('tipoBolsa:id,tipo_residuo,color')->select([
                'id',
                'codigo_barra',
                'estado',
                'tipo_bolsa_id',
                'created_at',
            ])

            // Condición dinámica para buscar por código de barra
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('codigo_barra', 'like', "%{$buscar}%");
            })
            // Filtro por estado
            ->when($request->filled('estado'), function ($query) use ($estado) {
                $query->where('estado', $estado);
            })
            ->orderBy('id','asc')
            ->latest()
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('bolsas/index', [
            'bolsas' => $bolsas,
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
            // 4. Devolver los filtros para que React recuerde el criterio actual
            'filtros' => [
                'buscar' => $buscar,
                'estado' => $estado,
            ],
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
     * Display the specified resource.
     */
    public function show(Request $request, Bolsa $bolsa): Response|RedirectResponse
    {
        $esVisitaParcial =
            $request->header('X-Inertia-Partial-Component') === 'bolsas/index'      // Verifica si la visita es parcial desde la página de listado de bolsas
            && in_array(                                                            // Verifica si la propiedad solicitada es 'bolsaDetalle'
                'bolsaDetalle',
                explode(',', (string) $request->header('X-Inertia-Partial-Data')),  // Convierte la cadena de propiedades solicitadas en un array y verifica si 'bolsaDetalle' está presente
                true
                // in_array('bolsaDetalle', ..., true) comprueba que la lista incluya exactamente esa propiedad. El tercer argumento, true, activa la comparación estricta.
            );

        if (!$esVisitaParcial) {
            return redirect()->route('bolsas.index');
        }

        $bolsa->load([
            'tipoBolsa',
            'remitoRecepcion',
            'remitoEntregaServicio.servicio',
            'recepcionDeposito',
            'remitoSalidaRetiro',
        ]);

        return Inertia::render('bolsas/index', [
            'bolsaDetalle' => [
                'id' => $bolsa->id,
                'codigo_barra' => $bolsa->codigo_barra,
                'estado' => $bolsa->estado,
                'tipo_bolsa' => $bolsa->tipoBolsa ? [
                    'tipo_residuo' => $bolsa->tipoBolsa->tipo_residuo,
                    'color' => $bolsa->tipoBolsa->color,
                ] : null,
                'eventos' => collect([      // Creo una colección de eventos asociados a la bolsa
                    [
                        'nombre' => 'Recepción',
                        'fecha' => $bolsa->remitoRecepcion?->fecha_recepcion,
                    ],
                    [
                        'nombre' => 'Entrega al servicio',
                        'servicio' => $bolsa->remitoEntregaServicio?->servicio?->nombre,
                        'fecha' => $bolsa->remitoEntregaServicio?->fecha_entrega,
                    ],
                    [
                        'nombre' => 'Recepción en depósito',
                        'fecha' => $bolsa->recepcionDeposito?->fecha_hora,
                    ],
                    [
                        'nombre' => 'Salida / retiro',
                        'fecha' => $bolsa->remitoSalidaRetiro?->fecha_retiro,
                    ],
                ])
                    ->filter(fn ($evento) => $evento['fecha'] !== null)
                    ->values(),
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
}

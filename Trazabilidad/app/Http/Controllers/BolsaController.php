<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Bolsa;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Exports\BolsasExport;
use Maatwebsite\Excel\Facades\Excel;


class BolsaController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {

        // 1. Capturar y validar ordenamiento (Sección 3.1 de la guía)
        $orden = $request->input('orden', 'created_at'); // Por defecto las más recientes
        $direccion = $request->input('direccion', 'desc');

        $camposPermitidos = ['codigo_barra', 'created_at', 'estado'];
        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'created_at';
        }
        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'desc';
        }
        // **************************************************************

        $buscar = trim($request->input('buscar', ''));
        $estado = $request->input('estado', '');

        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (!in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        $bolsas = Bolsa::with('tipoBolsa:id,tipo_residuo,color')
            ->select([
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
            ->orderBy($orden, $direccion)
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
                'orden' => $orden,          // Devuelve en orden
                'direccion' => $direccion,  // Devuelve con direccion
            ],
            'estados' => Bolsa::query()
                ->whereNotNull('estado')
                ->where('estado', '<>', '')
                ->distinct()
                ->orderBy('estado')
                ->pluck('estado')
                ->all(),
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
            'remitoRecepcion.usuarioRecep',  
            'remitoEntregaServicio.servicio',  
            'remitoEntregaServicio.usuarioEntrega',  
            'recepcionDeposito.usuarioRecibe',  
            'remitoSalidaRetiro.manifiestosFinales',  
            'pesaUsuario',
        ]);

        $manifiesto = $bolsa->remitoSalidaRetiro?->manifiestosFinales->first();  


        // 'eventos' => collect([      // Creo una colección de eventos asociados a la bolsa
                //     [
                //         'nombre' => 'Recepción',
                //         'fecha' => $bolsa->remitoRecepcion?->fecha_recepcion,
                //     ],
                //     [
                //         'nombre' => 'Entrega al servicio',
                //         'servicio' => $bolsa->remitoEntregaServicio?->servicio?->nombre,
                //         'fecha' => $bolsa->remitoEntregaServicio?->fecha_entrega,
                //     ],
                //     [
                //         'nombre' => 'Recepción en depósito',
                //         'fecha' => $bolsa->recepcionDeposito?->fecha_hora,
                //     ],
                //     [  
                //         'nombre' => 'Pesaje en depósito',  
                //         'fecha' => $bolsa->fecha_pesaje,  
                //         'peso' => $bolsa->peso,  
                //         'usuario' => $bolsa->pesaUsuario?->name,
                //     ],  
                //     [
                //         'nombre' => 'Salida / retiro',
                //         'fecha' => $bolsa->remitoSalidaRetiro?->fecha_retiro,
                //     ],
                // ])

                $eventos = collect([  
                    [  
                        'etapa' => 'Recepción',  
                        'fecha' => $bolsa->remitoRecepcion?->fecha_recepcion,  
                        'sector' => 'Depósito de insumos',  
                        'responsable' => $bolsa->remitoRecepcion?->usuarioRecep?->fullName,  
                        'documento' => $bolsa->remitoRecepcion  
                            ? 'Remito recepción #'.$bolsa->remitoRecepcion->id  
                            : null,  
                    ],  
                    [  
                        'etapa' => 'Entrega',  
                        'fecha' => $bolsa->remitoEntregaServicio?->fecha_entrega,  
                        'sector' => $bolsa->remitoEntregaServicio?->servicio?->nombre,  
                        'responsable' => $bolsa->remitoEntregaServicio?->usuarioEntrega?->fullName,  
                        'documento' => $bolsa->remitoEntregaServicio  
                            ? 'RI '.$bolsa->remitoEntregaServicio->id  
                            : null,  
                    ],  
                    [  
                        'etapa' => 'Retorno',  
                        'fecha' => $bolsa->recepcionDeposito?->fecha_hora,  
                        'sector' => 'Depósito de residuos',  
                        'responsable' => $bolsa->recepcionDeposito?->usuarioRecibe?->fullName,  
                        'documento' => null,  
                    ],  
                    [  
                        'etapa' => 'Pesaje',  
                        'fecha' => $bolsa->fecha_pesaje,  
                        'sector' => 'Depósito de residuos',  
                        'responsable' => $bolsa->pesaUsuario?->fullName,  
                        'documento' => null,  
                    ],  
                    [  
                        'etapa' => 'Retiro',  
                        'fecha' => $bolsa->remitoSalidaRetiro?->fecha_retiro  
                            ?? $bolsa->remitoSalidaRetiro?->fecha_emision,  
                        'sector' => 'Hospital',  
                        'responsable' => 'DGM',  
                        'documento' => $bolsa->remitoSalidaRetiro
                            // ?->numero_remito  
                            ? 'Remito N° '.($bolsa->remitoSalidaRetiro->numero_remito
                                ?? $bolsa->remitoSalidaRetiro->numero_remito_interno) 
                            : null,  
                    ],
                    [  
                        'etapa' => 'Tratamiento',  
                        'fecha' => $manifiesto?->fecha_tratamiento ?? $manifiesto?->fecha,  
                        'sector' => 'Tratamiento',  
                        'responsable' => null,  
                        'documento' => $manifiesto  
                            ? 'Manifiesto N° '.$manifiesto->numero_manifiesto  
                            : null,  
                    ],  
                ])
                    ->filter(fn ($evento) => $evento['fecha'] !== null)
                    ->values();
        return Inertia::render('bolsas/index', [
            'bolsaDetalle' => [
                'id' => $bolsa->id,
                'codigo_barra' => $bolsa->codigo_barra,
                'estado' => $bolsa->estado,
                'tipo_bolsa' => $bolsa->tipoBolsa ? [
                    'tipo_residuo' => $bolsa->tipoBolsa->tipo_residuo,
                    'color' => $bolsa->tipoBolsa->color,
                ] : null,
                'eventos' => $eventos,
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

    public function export(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));
        $estado = $request->input('estado', '');
        $orden = $request->input('orden', 'created_at');
        $direccion = $request->input('direccion', 'desc');

        $camposPermitidos = ['codigo_barra', 'created_at', 'estado'];
        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'created_at';
        }
        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'desc';
        }

        $filtros = [
            'buscar' => $buscar,
            'estado' => $estado,
            'orden' => $orden,
            'direccion' => $direccion,
        ];

        return Excel::download(new BolsasExport($filtros), 'reporte_bolsas.xlsx');
    }

}

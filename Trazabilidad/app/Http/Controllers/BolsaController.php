<?php

namespace App\Http\Controllers;

use App\Exports\BolsasExport;
use App\Models\Bolsa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class BolsaController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    #[Middleware('permission:listar bolsas')]
    public function index(Request $request): Response
    {
        $orden = $request->input('orden', 'created_at');
        $direccion = $request->input('direccion', 'desc');

        $camposPermitidos = ['codigo_barra', 'created_at', 'estado'];
        if (! in_array($orden, $camposPermitidos, true)) {
            $orden = 'created_at';
        }
        if (! in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'desc';
        }

        $buscar = trim($request->input('buscar', ''));
        $estado = $request->input('estado', '');

        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (! in_array($porPagina, $opcionesPorPagina, true)) {
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
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('codigo_barra', 'like', "%{$buscar}%");
            })
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
            'filtros' => [
                'buscar' => $buscar,
                'estado' => $estado,
                'orden' => $orden,
                'direccion' => $direccion,
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

    #[Middleware('permission:verDetalle bolsas')]
    public function show(Request $request, Bolsa $bolsa): Response|RedirectResponse
    {
        $esVisitaParcial =
            $request->header('X-Inertia-Partial-Component') === 'bolsas/index'
            && in_array(
                'bolsaDetalle',
                explode(',', (string) $request->header('X-Inertia-Partial-Data')),
                true
            );

        if (! $esVisitaParcial) {
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

        $remito = $bolsa->remitoSalidaRetiro; 
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
                            ? 'Remito recepción N° '.$bolsa->remitoRecepcion->id  
                            : null,
                        'informacion' => 'Ingreso',
                    ],  
                    [  
                        'etapa' => 'Entrega',  
                        'fecha' => $bolsa->remitoEntregaServicio?->fecha_entrega,  
                        'sector' => $bolsa->remitoEntregaServicio?->servicio?->nombre,  
                        'responsable' => $bolsa->remitoEntregaServicio?->usuarioEntrega?->fullName,  
                        'documento' => $bolsa->remitoEntregaServicio  
                            ? 'RI '.$bolsa->remitoEntregaServicio->id  
                            : null,
                        'informacion' => 'Entregada',
                    ],  
                    [  
                        'etapa' => 'Retorno',  
                        'fecha' => $bolsa->recepcionDeposito?->fecha_hora,  
                        'sector' => 'Depósito de residuos',  
                        'responsable' => $bolsa->recepcionDeposito?->usuarioRecibe?->fullName,  
                        'documento' => null,
                        'informacion' => 'Recepcion',
                    ],  
                    [  
                        'etapa' => 'Pesaje',  
                        'fecha' => $bolsa->fecha_pesaje,  
                        'sector' => 'Depósito de residuos',  
                        'responsable' => $bolsa->pesaUsuario?->fullName,  
                        'documento' => null,
                        'informacion' => $bolsa->peso !== null ? $bolsa->peso.' kg' : null, 
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
                        'informacion' => $remito  
                            ? ($remito->fecha_retiro ? 'Retirada por DGM' : 'Lista para retiro')  
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
                        'informacion' => 'Tratamiento/disposición',
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

    #[Middleware('permission:descargarExcel bolsas')]
    public function export(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));
        $estado = $request->input('estado', '');
        $orden = $request->input('orden', 'created_at');
        $direccion = $request->input('direccion', 'desc');

        $camposPermitidos = ['codigo_barra', 'created_at', 'estado'];
        if (! in_array($orden, $camposPermitidos, true)) {
            $orden = 'created_at';
        }
        if (! in_array($direccion, ['asc', 'desc'], true)) {
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

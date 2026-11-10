<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bolsa;
use App\Models\RemitoSalidaRetiro;
use App\Models\Servicio;
use App\Models\TipoBolsa;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. Rango de Fechas por Defecto (Mes en curso)
        $fechaInicio = $request->input('fecha_inicio', now()->startOfMonth()->toDateString());
        $fechaFin = $request->input('fecha_fin', now()->endOfMonth()->toDateString());
        $servicioId = $request->input('servicio_id');

        // Query Base con rango de fechas sobre la creación de la bolsa
        $queryBolsas = Bolsa::query()
            ->whereBetween('created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);

        if ($servicioId) {
            $queryBolsas->whereIn('remitos_serv_id', function ($q) use ($servicioId) {
                $q->select('id')
                    ->from('remitos_entrega_servicios')
                    ->where('servicio_id', $servicioId);
            });
        }

        // 2. Indicadores Generales
        $bolsasRecibidas = (clone $queryBolsas)->whereIn('estado', [
            'RECIBIDA',
            'DISPONIBLE',
            'ENTREGADA_A_SERVICIO',
            'UTILIZADA',
            'INGRESADA_AL_DEPOSITO',
            'PESADA',
            'DESPACHADA',
            'RETIRADA_POR_DGM',
            'TRATADA_DISPOSICION_FINAL'
        ])->count();

        $bolsasUtilizadas = (clone $queryBolsas)->whereIn('estado', [
            'UTILIZADA',
            'INGRESADA_AL_DEPOSITO',
            'PESADA',
            'DESPACHADA',
            'RETIRADA_POR_DGM',
            'TRATADA_DISPOSICION_FINAL'
        ])->count();

        $bolsasRetiradas = (clone $queryBolsas)->where('estado', 'RETIRADA_POR_DGM')->count();
        $kilogramosGenerados = (float) (clone $queryBolsas)->whereNotNull('peso')->sum('peso');
        $pesoPromedio = $bolsasRecibidas > 0 ? $kilogramosGenerados / $bolsasRecibidas : 0;

        // Conteo Dinámico por Color (JOIN con tipos_bolsa y filtro por servicio si aplica)
        $queryBolsasPorColor = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.color',
                'tipos_bolsa.tipo_residuo as nombre_tipo',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->whereBetween('bolsas.created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59'])
            ->whereNull('tipos_bolsa.deleted_at');

        if ($servicioId) {
            $queryBolsasPorColor->join('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
                ->where('remitos_entrega_servicios.servicio_id', $servicioId);
        }

        $bolsasPorColor = $queryBolsasPorColor->groupBy('tipos_bolsa.color', 'tipos_bolsa.tipo_residuo')->get();

        // 3. Indicadores por Corriente / Tipo de Residuo (Dinámico con desgloses por tamaño)
        $corrientesData = TipoBolsa::select('id', 'tipo_residuo', 'color')
            ->get()
            ->map(function ($tipo) use ($fechaInicio, $fechaFin, $servicioId) {
                $queryBase = Bolsa::where('tipo_bolsa_id', $tipo->id)
                    ->whereBetween('created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);

                if ($servicioId) {
                    $queryBase->whereIn('remitos_serv_id', function ($q) use ($servicioId) {
                        $q->select('id')
                            ->from('remitos_entrega_servicios')
                            ->where('servicio_id', $servicioId);
                    });
                }

                $cantidadTotal = (clone $queryBase)->count();
                $pesoTotal = (float) (clone $queryBase)->whereNotNull('peso')->sum('peso');

                // Desglose dinámico por tamaño de bolsa
                $queryPorTamanio = DB::table('bolsas')
                    ->leftJoin('tamanios', 'bolsas.tamanio_id', '=', 'tamanios.id')
                    ->select(
                        'bolsas.tamanio_id',
                        DB::raw("COALESCE(tamanios.nombre, 'Sin Especificar') as nombre_tamanio"),
                        DB::raw('COUNT(bolsas.id) as cantidad'),
                        DB::raw('COALESCE(SUM(bolsas.peso), 0) as peso_total')
                    )
                    ->where('bolsas.tipo_bolsa_id', $tipo->id)
                    ->whereBetween('bolsas.created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);

                if ($servicioId) {
                    $queryPorTamanio->join('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
                        ->where('remitos_entrega_servicios.servicio_id', $servicioId);
                }

                $porTamanio = $queryPorTamanio
                    ->groupBy('bolsas.tamanio_id', 'tamanios.nombre')
                    ->get()
                    ->map(fn($item) => [
                        'tamanio_id' => $item->tamanio_id,
                        'nombre_tamanio' => $item->nombre_tamanio,
                        'cantidad' => (int) $item->cantidad,
                        'peso_total' => round((float) $item->peso_total, 2),
                    ]);

                return [
                    'tipo_bolsa_id' => $tipo->id,
                    'tipo_residuo' => $tipo->tipo_residuo,
                    'color' => $tipo->color,
                    'cantidad_total' => $cantidadTotal,
                    'peso_total' => round($pesoTotal, 2),
                    'por_tamanio' => $porTamanio,
                ];
            });

        // 4. Stock de Bolsas Vacías (Bolsas en estado VACIA o DISPONIBLE)
        $stockVacias = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->leftJoin('tamanios', 'bolsas.tamanio_id', '=', 'tamanios.id')
            ->select(
                'bolsas.tipo_bolsa_id',
                'bolsas.tamanio_id',
                'tipos_bolsa.tipo_residuo as nombre',
                'tipos_bolsa.color',
                DB::raw("COALESCE(tamanios.nombre, 'Único') as nombre_tamanio"),
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->whereIn('bolsas.estado', ['VACIA', 'DISPONIBLE'])
            ->groupBy('bolsas.tipo_bolsa_id', 'bolsas.tamanio_id', 'tipos_bolsa.tipo_residuo', 'tipos_bolsa.color', 'tamanios.nombre')
            ->get();

        // 5. Estado de Pendientes Operativos (Agrupados por corriente/tipo_residuo)
        $pendientesPesaje = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.tipo_residuo',
                'tipos_bolsa.color',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->whereNull('bolsas.peso')
            ->whereIn('bolsas.estado', ['INGRESADA_AL_DEPOSITO'])
            ->groupBy('tipos_bolsa.tipo_residuo', 'tipos_bolsa.color')
            ->get();

        $pendientesRetiro = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.tipo_residuo',
                'tipos_bolsa.color',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->whereIn('bolsas.estado', ['INGRESADA_AL_DEPOSITO', 'PESADA'])
            ->whereNull('bolsas.rem_sal_id')
            ->groupBy('tipos_bolsa.tipo_residuo', 'tipos_bolsa.color')
            ->get();

        $remitosPendientesDgm = RemitoSalidaRetiro::where('estado', 'PENDIENTE_RETIRO')->count();

        // 6. Desglose por Servicio Hospitalario (Tabla real: remitos_entrega_servicios)
        $metricasServicio = DB::table('bolsas')
            ->leftJoin('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
            ->leftJoin('servicios', 'remitos_entrega_servicios.servicio_id', '=', 'servicios.id')
            ->select(
                DB::raw('COALESCE(servicios.id, 0) as servicio_id'),
                DB::raw("COALESCE(servicios.nombre, 'Sin Servicio Asignado') as nombre_servicio"),
                DB::raw('COUNT(bolsas.id) as cantidad_bolsas'),
                DB::raw('COALESCE(SUM(bolsas.peso), 0) as kilogramos')
            )
            ->whereBetween('bolsas.created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59'])
            ->whereNull('servicios.deleted_at')
            ->groupBy('servicios.id', 'servicios.nombre')
            ->get();

        // Lista de servicios activos para el selector de filtros
        $servicios = Servicio::where('activo', true)->select('id', 'nombre')->get();

        return Inertia::render('dashboard/index', [
            'filtros' => [
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'servicio_id' => $servicioId ? (int) $servicioId : null,
            ],
            'servicios' => $servicios,
            'indicadores' => [
                'generales' => [
                    'bolsas_recibidas' => $bolsasRecibidas,
                    'bolsas_utilizadas' => $bolsasUtilizadas,
                    'bolsas_retiradas' => $bolsasRetiradas,
                    'kilogramos_generados' => round($kilogramosGenerados, 2),
                    'peso_promedio_bolsa' => round($pesoPromedio, 2),
                    'bolsas_por_color' => $bolsasPorColor,
                ],
                'corrientes' => $corrientesData,
                'stock_vacias' => $stockVacias,
                'pendientes' => [
                    'pesaje' => $pendientesPesaje,
                    'retiro' => $pendientesRetiro,
                    'documentacion' => [
                        'remitos_dgm' => $remitosPendientesDgm,
                        'manifiestos' => 0,
                    ],
                ],
                'metricas_servicio' => $metricasServicio,
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

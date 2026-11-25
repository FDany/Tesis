<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Models\Bolsa;
use App\Models\Servicio;
use App\Models\TipoBolsa;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReporteController extends Controller
{
    #[Middleware('permission:ver reportes')]
    public function index(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio', now()->startOfMonth()->toDateString());
        $fechaFin = $request->input('fecha_fin', now()->endOfMonth()->toDateString());
        $servicioId = $request->input('servicio_id');

        $desde = $fechaInicio . ' 00:00:00';
        $hasta = $fechaFin . ' 23:59:59';

        // Query base del período excluyendo bolsas no recibidas
        $queryBase = Bolsa::query()
            ->where('estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
            ->whereBetween('created_at', [$desde, $hasta]);

        if ($servicioId) {
            $queryBase->whereIn('remitos_serv_id', function ($q) use ($servicioId) {
                $q->select('id')
                    ->from('remitos_entrega_servicios')
                    ->where('servicio_id', $servicioId);
            });
        }

        // 1. Indicadores Generales (Punto 21)
        $bolsasRecibidas = (clone $queryBase)->whereIn('estado', [
            EstadoBolsa::RECIBIDA->value,
            EstadoBolsa::DISPONIBLE->value,
            EstadoBolsa::ENTREGADA_A_SERVICIO->value,
            EstadoBolsa::UTILIZADA->value,
            EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
            EstadoBolsa::PESADA->value,
            EstadoBolsa::DESPACHADA->value,
            EstadoBolsa::RETIRADA_POR_DGM->value,
            EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
        ])->count();

        $bolsasUtilizadas = (clone $queryBase)->whereIn('estado', [
            EstadoBolsa::UTILIZADA->value,
            EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
            EstadoBolsa::PESADA->value,
            EstadoBolsa::DESPACHADA->value,
            EstadoBolsa::RETIRADA_POR_DGM->value,
            EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
        ])->count();

        $bolsasRetiradas = (clone $queryBase)->whereIn('estado', [
            EstadoBolsa::RETIRADA_POR_DGM->value,
            EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
        ])->count();

        $bolsasPesadas = (clone $queryBase)->whereNotNull('peso')->count();
        $kilogramosGenerados = (float) (clone $queryBase)->whereNotNull('peso')->sum('peso');
        $pesoPromedioBolsa = $bolsasPesadas > 0 ? $kilogramosGenerados / $bolsasPesadas : 0;

        // Distribución dinámica por color / tipo de bolsa
        $queryPorColor = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.color',
                'tipos_bolsa.tipo_residuo as nombre_tipo',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->where('bolsas.estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
            ->whereBetween('bolsas.created_at', [$desde, $hasta])
            ->whereNull('tipos_bolsa.deleted_at');

        if ($servicioId) {
            $queryPorColor->join('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
                ->where('remitos_entrega_servicios.servicio_id', $servicioId);
        }

        $bolsasPorColor = $queryPorColor
            ->groupBy('tipos_bolsa.color', 'tipos_bolsa.tipo_residuo')
            ->get()
            ->map(fn($item) => [
                'color' => $item->color,
                'nombre_tipo' => $item->nombre_tipo,
                'cantidad' => (int) $item->cantidad,
            ]);

        // 2. Indicadores por Corriente / Tipo de Residuo con desglose por Tamaño (Dinámico)
        $corrientesData = TipoBolsa::select('id', 'tipo_residuo', 'color')
            ->get()
            ->map(function ($tipo) use ($desde, $hasta, $servicioId) {
                $queryCorriente = Bolsa::where('tipo_bolsa_id', $tipo->id)
                    ->where('estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
                    ->whereBetween('created_at', [$desde, $hasta]);

                if ($servicioId) {
                    $queryCorriente->whereIn('remitos_serv_id', function ($q) use ($servicioId) {
                        $q->select('id')
                            ->from('remitos_entrega_servicios')
                            ->where('servicio_id', $servicioId);
                    });
                }

                $cantidadTotal = (clone $queryCorriente)->count();
                $pesoTotal = (float) (clone $queryCorriente)->whereNotNull('peso')->sum('peso');

                $queryPorTamanio = DB::table('bolsas')
                    ->leftJoin('tamanios', 'bolsas.tamanio_id', '=', 'tamanios.id')
                    ->select(
                        'bolsas.tamanio_id',
                        DB::raw("COALESCE(tamanios.nombre, 'Sin Especificar') as nombre_tamanio"),
                        DB::raw('COUNT(bolsas.id) as cantidad'),
                        DB::raw('COALESCE(SUM(bolsas.peso), 0) as peso_total')
                    )
                    ->where('bolsas.tipo_bolsa_id', $tipo->id)
                    ->where('bolsas.estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
                    ->whereBetween('bolsas.created_at', [$desde, $hasta]);

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

        // 3. Kilogramos por Período (agrupación diaria o mensual según amplitud del rango)
        $inicioCarbon = Carbon::parse($fechaInicio)->startOfDay();
        $finCarbon = Carbon::parse($fechaFin)->endOfDay();
        $agruparPorMes = $inicioCarbon->diffInDays($finCarbon) > 62;

        $queryPeriodo = Bolsa::query()
            ->where('estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
            ->whereBetween('created_at', [$desde, $hasta]);

        if ($servicioId) {
            $queryPeriodo->whereIn('remitos_serv_id', function ($q) use ($servicioId) {
                $q->select('id')
                    ->from('remitos_entrega_servicios')
                    ->where('servicio_id', $servicioId);
            });
        }

        $bolsasPeriodo = $queryPeriodo->select('created_at', 'peso')->get();

        $agrupados = $bolsasPeriodo->groupBy(function ($bolsa) use ($agruparPorMes) {
            $fecha = Carbon::parse($bolsa->created_at);
            return $agruparPorMes ? $fecha->format('Y-m') : $fecha->format('Y-m-d');
        });

        $kilogramosPorPeriodo = [];
        $periodoIter = CarbonPeriod::create(
            $agruparPorMes ? $inicioCarbon->copy()->startOfMonth() : $inicioCarbon->copy()->startOfDay(),
            $agruparPorMes ? '1 month' : '1 day',
            $agruparPorMes ? $finCarbon->copy()->endOfMonth() : $finCarbon->copy()->endOfDay()
        );

        foreach ($periodoIter as $punto) {
            $clave = $agruparPorMes ? $punto->format('Y-m') : $punto->format('Y-m-d');
            $etiqueta = $agruparPorMes
                ? ucfirst($punto->locale('es')->translatedFormat('M Y'))
                : $punto->format('d/m');

            $items = $agrupados->get($clave, collect());
            $kilogramosPorPeriodo[] = [
                'periodo' => $clave,
                'etiqueta' => $etiqueta,
                'kilogramos' => round((float) $items->sum(fn($b) => (float) ($b->peso ?? 0)), 2),
                'cantidad_bolsas' => $items->count(),
            ];
        }

        // 4. Desglose por Servicio Hospitalario
        $estadosConPeso = [
            EstadoBolsa::PESADA->value,
            EstadoBolsa::DESPACHADA->value,
            EstadoBolsa::RETIRADA_POR_DGM->value,
            EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
        ];

        $metricasServicio = DB::table('bolsas')
            ->join('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
            ->join('servicios', 'remitos_entrega_servicios.servicio_id', '=', 'servicios.id')
            ->select(
                'servicios.id as servicio_id',
                'servicios.nombre as nombre_servicio',
                DB::raw('COUNT(bolsas.id) as cantidad_bolsas'),
                DB::raw(
                    'COALESCE(SUM(CASE WHEN bolsas.estado IN ('
                        . implode(',', array_fill(0, count($estadosConPeso), '?'))
                        . ') AND bolsas.peso IS NOT NULL THEN bolsas.peso ELSE 0 END), 0) as kilogramos'
                )
            )
            ->addBinding($estadosConPeso, 'select')
            ->whereIn('bolsas.estado', $estadosConPeso)->whereNotNull('bolsas.peso')
            ->whereBetween('bolsas.created_at', [$desde, $hasta])
            ->whereNull('servicios.deleted_at')
            ->groupBy('servicios.id', 'servicios.nombre')
            ->orderByDesc('kilogramos')
            ->get()
            ->map(fn($item) => [
                'servicio_id' => (int) $item->servicio_id,
                'nombre_servicio' => $item->nombre_servicio,
                'cantidad_bolsas' => (int) $item->cantidad_bolsas,
                'kilogramos' => round((float) $item->kilogramos, 2),
            ]);

        $servicios = Servicio::where('activo', true)->select('id', 'nombre')->orderBy('nombre')->get();

        return Inertia::render('reportes/index', [
            'filtros' => [
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'servicio_id' => $servicioId ? (int) $servicioId : null,
            ],
            'servicios' => $servicios,
            'reportes' => [
                'generales' => [
                    'bolsas_recibidas' => $bolsasRecibidas,
                    'bolsas_utilizadas' => $bolsasUtilizadas,
                    'bolsas_retiradas' => $bolsasRetiradas,
                    'kilogramos_generados' => round($kilogramosGenerados, 2),
                    'peso_promedio_bolsa' => round($pesoPromedioBolsa, 2),
                    'bolsas_por_color' => $bolsasPorColor,
                ],
                'corrientes' => $corrientesData,
                'kilogramos_por_periodo' => $kilogramosPorPeriodo,
                'metricas_servicio' => $metricasServicio,
            ],
        ]);
    }
}

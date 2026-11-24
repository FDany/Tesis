<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Models\Bolsa;
use App\Models\RemitoSalidaRetiro;
use App\Models\Servicio;
use App\Models\TipoBolsa;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    #[Middleware('permission:ver dashboard')]
    public function index(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio', now()->startOfMonth()->toDateString());
        $fechaFin = $request->input('fecha_fin', now()->endOfMonth()->toDateString());
        $servicioId = $request->input('servicio_id');

        $queryBolsas = Bolsa::query()
            ->whereBetween('created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);

        if ($servicioId) {
            $queryBolsas->whereIn('remitos_serv_id', function ($q) use ($servicioId) {
                $q->select('id')
                    ->from('remitos_entrega_servicios')
                    ->where('servicio_id', $servicioId);
            });
        }

        // 1. Indicadores Generales (usando EstadoBolsa)
        $bolsasRecibidas = (clone $queryBolsas)->whereIn('estado', [
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

        $bolsasUtilizadas = (clone $queryBolsas)->whereIn('estado', [
            EstadoBolsa::UTILIZADA->value,
            EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
            EstadoBolsa::PESADA->value,
            EstadoBolsa::DESPACHADA->value,
            EstadoBolsa::RETIRADA_POR_DGM->value,
            EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
        ])->count();

        $bolsasRetiradas = (clone $queryBolsas)->whereIn('estado', [
            EstadoBolsa::RETIRADA_POR_DGM->value,
            EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
        ])->count();

        $bolsasPesadas = (clone $queryBolsas)->whereNotNull('peso')->count();
        $kilogramosGenerados = (float) (clone $queryBolsas)->whereNotNull('peso')->sum('peso');
        $pesoPromedio = $bolsasPesadas > 0 ? $kilogramosGenerados / $bolsasPesadas : 0;

        // Conteo Dinámico por Color / Tipo
        $queryBolsasPorColor = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.color',
                'tipos_bolsa.tipo_residuo as nombre_tipo',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->whereBetween('bolsas.created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59'])
            ->where('bolsas.estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
            ->whereNull('tipos_bolsa.deleted_at');

        if ($servicioId) {
            $queryBolsasPorColor->join('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
                ->where('remitos_entrega_servicios.servicio_id', $servicioId);
        }

        $bolsasPorColor = $queryBolsasPorColor
            ->groupBy('tipos_bolsa.color', 'tipos_bolsa.tipo_residuo')
            ->get();

        // 2. Indicadores por Corriente / Tipo de Residuo (Dinámico)
        $corrientesData = TipoBolsa::select('id', 'tipo_residuo', 'color')
            ->get()
            ->map(function ($tipo) use ($fechaInicio, $fechaFin, $servicioId) {
                $queryBase = Bolsa::where('tipo_bolsa_id', $tipo->id)
                    ->where('estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
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
                    ->whereBetween('bolsas.created_at', [$fechaInicio . ' 00:00:00', $fechaFin . ' 23:59:59']);

                if ($servicioId) {
                    $queryPorTamanio->join('remitos_entrega_servicios', 'bolsas.remitos_serv_id', '=', 'remitos_entrega_servicios.id')
                        ->where('remitos_entrega_servicios.servicio_id', $servicioId);
                }

                $porTamanio = $queryPorTamanio
                    ->groupBy('bolsas.tamanio_id', 'tamanios.nombre')
                    ->get()
                    ->map(fn ($item) => [
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

        // 3. Tablero en Tiempo Real: Stock de Bolsas Vacías
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
            ->whereIn('bolsas.estado', [
                EstadoBolsa::RECIBIDA->value,
                EstadoBolsa::DISPONIBLE->value,
            ])
            ->whereNull('tipos_bolsa.deleted_at')
            ->groupBy('bolsas.tipo_bolsa_id', 'bolsas.tamanio_id', 'tipos_bolsa.tipo_residuo', 'tipos_bolsa.color', 'tamanios.nombre')
            ->get();

        // 4. Tablero en Tiempo Real: Residuos Actualmente en Depósito
        $residuosDeposito = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.id as tipo_bolsa_id',
                'tipos_bolsa.tipo_residuo',
                'tipos_bolsa.color',
                DB::raw('COUNT(bolsas.id) as cantidad'),
                DB::raw('COALESCE(SUM(bolsas.peso), 0) as peso_total')
            )
            ->whereIn('bolsas.estado', [
                EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
                EstadoBolsa::PESADA->value,
                EstadoBolsa::DESPACHADA->value,
            ])
            ->whereNull('tipos_bolsa.deleted_at')
            ->groupBy('tipos_bolsa.id', 'tipos_bolsa.tipo_residuo', 'tipos_bolsa.color')
            ->get();

        // 5. Tablero en Tiempo Real: Pendientes Operativos y Documentación
        $pendientesPesaje = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.tipo_residuo',
                'tipos_bolsa.color',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->where('bolsas.estado', EstadoBolsa::INGRESADA_AL_DEPOSITO->value)
            ->whereNull('tipos_bolsa.deleted_at')
            ->groupBy('tipos_bolsa.tipo_residuo', 'tipos_bolsa.color')
            ->get();

        $pendientesRetiro = DB::table('bolsas')
            ->join('tipos_bolsa', 'bolsas.tipo_bolsa_id', '=', 'tipos_bolsa.id')
            ->select(
                'tipos_bolsa.tipo_residuo',
                'tipos_bolsa.color',
                DB::raw('COUNT(bolsas.id) as cantidad')
            )
            ->whereIn('bolsas.estado', [
                EstadoBolsa::PESADA->value,
                EstadoBolsa::DESPACHADA->value,
            ])
            ->whereNull('tipos_bolsa.deleted_at')
            ->groupBy('tipos_bolsa.tipo_residuo', 'tipos_bolsa.color')
            ->get();

        $remitosPendientesDgm = RemitoSalidaRetiro::where('estado', 'PENDIENTE_RETIRO')->count();
        $manifiestosPendientes = RemitoSalidaRetiro::whereIn('estado', ['CONCILIADO', 'CON_INCIDENCIA'])
            ->doesntHave('manifiestoFinal')
            ->count();

        // 6. Desglose por Servicio Hospitalario
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
            ->where('bolsas.estado', '!=', EstadoBolsa::NO_RECIBIDA->value)
            ->whereNull('servicios.deleted_at')
            ->groupBy('servicios.id', 'servicios.nombre')
            ->get();

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
                'residuos_deposito' => $residuosDeposito,
                'pendientes' => [
                    'pesaje' => $pendientesPesaje,
                    'retiro' => $pendientesRetiro,
                    'documentacion' => [
                        'remitos_dgm' => $remitosPendientesDgm,
                        'manifiestos' => $manifiestosPendientes,
                    ],
                ],
                'metricas_servicio' => $metricasServicio,
            ],
        ]);
    }
}

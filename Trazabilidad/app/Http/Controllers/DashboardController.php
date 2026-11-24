<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Models\Bolsa;
use App\Models\RemitoSalidaRetiro;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    #[Middleware('permission:ver dashboard')]
    public function index(Request $request)
    {
        // Resumen rápido del mes en curso (las consultas históricas y por servicio van a ReporteController)
        $inicioMes = now()->startOfMonth()->toDateString() . ' 00:00:00';
        $finMes = now()->endOfMonth()->toDateString() . ' 23:59:59';

        $bolsasRecibidasMes = Bolsa::whereBetween('created_at', [$inicioMes, $finMes])
            ->whereIn('estado', [
                EstadoBolsa::RECIBIDA->value,
                EstadoBolsa::DISPONIBLE->value,
                EstadoBolsa::ENTREGADA_A_SERVICIO->value,
                EstadoBolsa::UTILIZADA->value,
                EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
                EstadoBolsa::PESADA->value,
                EstadoBolsa::DESPACHADA->value,
                EstadoBolsa::RETIRADA_POR_DGM->value,
                EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
            ])
            ->count();

        $bolsasUtilizadasMes = Bolsa::whereBetween('created_at', [$inicioMes, $finMes])
            ->whereIn('estado', [
                EstadoBolsa::UTILIZADA->value,
                EstadoBolsa::INGRESADA_AL_DEPOSITO->value,
                EstadoBolsa::PESADA->value,
                EstadoBolsa::DESPACHADA->value,
                EstadoBolsa::RETIRADA_POR_DGM->value,
                EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
            ])
            ->count();

        $bolsasRetiradasMes = Bolsa::whereBetween('created_at', [$inicioMes, $finMes])
            ->whereIn('estado', [
                EstadoBolsa::RETIRADA_POR_DGM->value,
                EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
            ])
            ->count();

        $kilogramosMes = (float) Bolsa::whereBetween('created_at', [$inicioMes, $finMes])
            ->whereNotNull('peso')
            ->sum('peso');

        // 1. Stock de bolsas vacías (dinámico por tipo_bolsa y tamanio)
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
            ->groupBy(
                'bolsas.tipo_bolsa_id',
                'bolsas.tamanio_id',
                'tipos_bolsa.tipo_residuo',
                'tipos_bolsa.color',
                'tamanios.nombre'
            )
            ->get();

        // 2. Residuos actualmente en depósito (dinámico por tipo_bolsa)
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

        // 3. Pendientes de pesaje (dinámico por tipo_bolsa)
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

        // 4. Pendientes de retiro (dinámico por tipo_bolsa)
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

        // 5. Documentación pendiente
        $remitosPendientesDgm = RemitoSalidaRetiro::where('estado', 'PENDIENTE_RETIRO')->count();
        $manifiestosPendientes = RemitoSalidaRetiro::whereIn('estado', ['CONCILIADO', 'CON_INCIDENCIA'])
            ->doesntHave('manifiestoFinal')
            ->count();

        return Inertia::render('dashboard/index', [
            'resumen_mes' => [
                'bolsas_recibidas' => $bolsasRecibidasMes,
                'bolsas_utilizadas' => $bolsasUtilizadasMes,
                'bolsas_retiradas' => $bolsasRetiradasMes,
                'kilogramos_generados' => round($kilogramosMes, 2),
            ],
            'tablero' => [
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
            ],
        ]);
    }
}

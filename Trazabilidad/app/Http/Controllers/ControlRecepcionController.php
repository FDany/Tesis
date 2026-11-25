<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Enums\TipoIncidencia;
use App\Models\Bolsa;
use App\Models\Incidencia;
use App\Models\RemitoRecepcion;
use App\Services\AuditoriaService;
use App\Services\BolsaScannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ControlRecepcionController extends Controller
{
    /**
     * Vista de control físico de remitos de recepción con bolsas en estado RECIBIDA.
     */
    #[Middleware('permission:controlar remitosRecepcion')]
    public function create(Request $request): Response
    {
        $remitos = RemitoRecepcion::query()
            ->with(['tipoBolsa', 'tamanio', 'usuarioRecep'])
            ->where('estado', RemitoRecepcion::ESTADO_PENDIENTE_CONTROL)
            ->whereHas('bolsas', fn ($query) => $query->where('estado', EstadoBolsa::RECIBIDA->value))
            ->withCount([
                'bolsas as bolsas_recibidas_count' => fn ($query) => $query->where('estado', EstadoBolsa::RECIBIDA->value),
            ])
            ->orderBy('fecha_recepcion')
            ->orderBy('id')
            ->get()
            ->map(fn (RemitoRecepcion $remito) => [
                'id' => $remito->id,
                'fecha_recepcion' => $remito->fecha_recepcion?->format('d/m/Y H:i'),
                'codigo_inicio' => $remito->codigo_inicio,
                'codigo_fin' => $remito->codigo_fin,
                'cantidad_declarada' => $remito->cantidad_declarada,
                'bolsas_recibidas_count' => $remito->bolsas_recibidas_count,
                'observaciones' => $remito->observaciones,
                'tipo_bolsa' => $remito->tipoBolsa ? [
                    'tipo_residuo' => $remito->tipoBolsa->tipo_residuo,
                    'color' => $remito->tipoBolsa->color,
                ] : null,
                'tamanio' => $remito->tamanio?->nombre,
                'usuario_recep' => $remito->usuarioRecep?->full_name,
            ]);

        $remitoIdSolicitado = (int) $request->query('remito_id', 0);
        $remitoSeleccionadoId = $remitos->contains('id', $remitoIdSolicitado)
            ? $remitoIdSolicitado
            : null;

        return Inertia::render('control-recepcion/create', [
            'remitos' => $remitos,
            'remitoSeleccionadoId' => $remitoSeleccionadoId,
            'resultadoControl' => $request->session()->get('resultadoControl'),
        ]);
    }

    /**
     * Verifica un código escaneado contra el remito seleccionado usando BolsaScannerService.
     */
    #[Middleware('permission:controlar remitosRecepcion')]
    public function verificarBolsa(Request $request, BolsaScannerService $scanner): JsonResponse
    {
        $validated = $request->validate([
            'remito_id' => ['required', 'integer', 'exists:remitos_recepcion,id'],
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
            'codigos_ya_escaneados' => ['nullable', 'array'],
            'codigos_ya_escaneados.*' => ['string', 'regex:/^\d{13}$/'],
        ]);

        $remito = RemitoRecepcion::findOrFail($validated['remito_id']);

        if ($remito->estado !== RemitoRecepcion::ESTADO_PENDIENTE_CONTROL) {
            return response()->json([
                'message' => "El remito #{$remito->id} ya fue controlado.",
            ], 422);
        }

        $resultado = $scanner->evaluarEscaneoRecepcion(
            remito: $remito,
            codigo: $validated['codigo'],
            codigosYaEscaneados: $validated['codigos_ya_escaneados'] ?? [],
        );

        return response()->json($resultado['payload'], $resultado['status']);
    }

    /**
     * Confirma el control: las bolsas escaneadas pasan de RECIBIDA a DISPONIBLE,
     * las faltantes pasan a NO_RECIBIDA, se registran auditorías e incidencias
     * y el remito queda CONCILIADO.
     */
    #[Middleware('permission:controlar remitosRecepcion')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'remito_id' => ['required', 'integer', 'exists:remitos_recepcion,id'],
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],
            'codigos.*' => ['required', 'string', 'distinct:strict', 'regex:/^\d{13}$/'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $usuarioId = $request->user()->id;
            $ahora = now();

            $remito = RemitoRecepcion::query()
                ->lockForUpdate()
                ->findOrFail($validated['remito_id']);

            if ($remito->estado !== RemitoRecepcion::ESTADO_PENDIENTE_CONTROL) {
                throw ValidationException::withMessages([
                    'remito_id' => "El remito #{$remito->id} ya fue controlado.",
                ]);
            }

            $bolsasRemito = $remito->bolsas()->lockForUpdate()->get();
            $codigosRemito = $bolsasRemito->pluck('codigo_barra')->all();

            $bolsasPendientes = $bolsasRemito
                ->filter(fn (Bolsa $bolsa) => $bolsa->estado === EstadoBolsa::RECIBIDA);

            $codigosEscaneados = $validated['codigos'];

            $bolsasControladas = $bolsasPendientes
                ->filter(fn (Bolsa $bolsa) => in_array($bolsa->codigo_barra, $codigosEscaneados, true));

            $bolsasFaltantes = $bolsasPendientes
                ->reject(fn (Bolsa $bolsa) => in_array($bolsa->codigo_barra, $codigosEscaneados, true));

            $codigosSobrantes = array_values(array_diff($codigosEscaneados, $codigosRemito));

            if ($bolsasControladas->isNotEmpty()) {
                Bolsa::query()
                    ->whereKey($bolsasControladas->modelKeys())
                    ->update([
                        'estado' => EstadoBolsa::DISPONIBLE->value,
                        'updated_at' => $ahora,
                    ]);

                foreach ($bolsasControladas as $bolsa) {
                    AuditoriaService::registrar(
                        bolsaId: $bolsa->id,
                        operacion: 'Control recepción - Disponible',
                        valorAnterior: [
                            'estado' => EstadoBolsa::RECIBIDA->value,
                            'remito_recepcion_id' => $remito->id,
                        ],
                        valorNuevo: [
                            'estado' => EstadoBolsa::DISPONIBLE->value,
                            'remito_recepcion_id' => $remito->id,
                        ],
                        responsableId: $usuarioId,
                        fechaHora: $ahora,
                    );
                }
            }

            if ($bolsasFaltantes->isNotEmpty()) {
                // Las bolsas declaradas que no llegaron físicamente no quedan disponibles.
                Bolsa::query()
                    ->whereKey($bolsasFaltantes->modelKeys())
                    ->update([
                        'estado' => EstadoBolsa::NO_RECIBIDA->value,
                        'updated_at' => $ahora,
                    ]);

                foreach ($bolsasFaltantes as $bolsa) {
                    AuditoriaService::registrar(
                        bolsaId: $bolsa->id,
                        operacion: 'Control recepción - No recibida',
                        valorAnterior: [
                            'estado' => EstadoBolsa::RECIBIDA->value,
                            'remito_recepcion_id' => $remito->id,
                        ],
                        valorNuevo: [
                            'estado' => EstadoBolsa::NO_RECIBIDA->value,
                            'remito_recepcion_id' => $remito->id,
                        ],
                        responsableId: $usuarioId,
                        fechaHora: $ahora,
                    );
                }

                $cantidadFaltantes = $bolsasFaltantes->count();

                Incidencia::create([
                    'fecha_hora' => $ahora,
                    'usuario_registra' => $usuarioId,
                    'rem_rep_id' => $remito->id,
                    'tipo_bolsa_id' => $remito->tipo_bolsa_id,
                    'tipo_incidencia' => TipoIncidencia::BOLSA_FALTANTE_RECEPCION->value,
                    'descripcion' => "Control del remito de recepción #{$remito->id}: "
                        . "{$remito->cantidad_declarada} bolsas declaradas, {$bolsasControladas->count()} controladas. "
                        . "Faltantes ({$cantidadFaltantes}): "
                        . $bolsasFaltantes->pluck('codigo_barra')->implode(', ') . '.',
                    'estado' => 'ABIERTA',
                ]);
            }

            if ($codigosSobrantes !== []) {
                $bolsasSobrantes = Bolsa::query()
                    ->whereIn('codigo_barra', $codigosSobrantes)
                    ->get()
                    ->keyBy('codigo_barra');

                foreach ($codigosSobrantes as $codigo) {
                    $bolsa = $bolsasSobrantes->get($codigo);

                    Incidencia::create([
                        'fecha_hora' => $ahora,
                        'usuario_registra' => $usuarioId,
                        'rem_rep_id' => $remito->id,
                        'bolsa_id' => $bolsa?->id,
                        'codigo_no_registrado' => $bolsa ? null : $codigo,
                        'tipo_bolsa_id' => $bolsa?->tipo_bolsa_id ?? $remito->tipo_bolsa_id,
                        'tipo_incidencia' => TipoIncidencia::BOLSA_SOBRANTE_RECEPCION->value,
                        'descripcion' => "Control del remito de recepción #{$remito->id}: "
                            . "se escaneó la bolsa {$codigo} que no está declarada en el remito"
                            . ($bolsa
                                ? " (pertenece al remito #{$bolsa->rem_rep_id}, estado {$bolsa->estado->label()})."
                                : ' (código no registrado en el sistema).'),
                        'estado' => 'ABIERTA',
                    ]);
                }
            }

            $remito->update([
                'estado' => RemitoRecepcion::ESTADO_CONCILIADO,
                'control_usuario_id' => $usuarioId,
                'fecha_control' => $ahora,
            ]);

            $hayDiferencias = $bolsasFaltantes->isNotEmpty() || $codigosSobrantes !== [];

            return redirect()
                ->route('control-recepcion.create')
                ->with('success', $hayDiferencias
                    ? 'Control registrado. Se generaron incidencias por diferencias con el remito.'
                    : 'Control registrado sin diferencias. Remito conciliado.')
                ->with('resultadoControl', [
                    'remito_id' => $remito->id,
                    'cantidad_declarada' => $remito->cantidad_declarada,
                    'controladas' => $bolsasControladas->pluck('codigo_barra')->values()->all(),
                    'faltantes' => $bolsasFaltantes->pluck('codigo_barra')->values()->all(),
                    'sobrantes' => $codigosSobrantes,
                    'responsable' => $request->user()->full_name,
                    'fecha_control' => $ahora->format('d/m/Y H:i'),
                ]);
        });
    }
}

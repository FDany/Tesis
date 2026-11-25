<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Enums\TipoIncidencia;
use App\Models\Bolsa;
use App\Models\Incidencia;
use App\Models\RemitoRecepcion;
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
    #[Middleware('auth')]
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

        return Inertia::render('control-recepcion/create', [
            'remitos' => $remitos,
            'resultadoControl' => $request->session()->get('resultadoControl'),
        ]);
    }

    /**
     * Verifica un código escaneado contra las bolsas del remito seleccionado.
     * Devuelve si la bolsa está declarada (RECIBIDA en el remito) o si es sobrante.
     */
    #[Middleware('auth')]
    public function verificarBolsa(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'remito_id' => ['required', 'integer', 'exists:remitos_recepcion,id'],
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
        ]);

        $remito = RemitoRecepcion::findOrFail($validated['remito_id']);

        if ($remito->estado !== RemitoRecepcion::ESTADO_PENDIENTE_CONTROL) {
            return response()->json([
                'message' => "El remito #{$remito->id} ya fue controlado.",
            ], 422);
        }

        $bolsa = Bolsa::query()
            ->where('codigo_barra', $validated['codigo'])
            ->first();

        if ($bolsa && (int) $bolsa->rem_rep_id === $remito->id) {
            if ($bolsa->estado !== EstadoBolsa::RECIBIDA) {
                return response()->json([
                    'message' => "La bolsa {$bolsa->codigo_barra} no está pendiente de control. Estado actual: {$bolsa->estado->label()}.",
                ], 422);
            }

            return response()->json([
                'codigo_barra' => $bolsa->codigo_barra,
                'resultado' => 'DECLARADA',
                'message' => 'Bolsa declarada en el remito.',
            ]);
        }

        return response()->json([
            'codigo_barra' => $validated['codigo'],
            'resultado' => 'SOBRANTE',
            'message' => $bolsa
                ? "La bolsa pertenece a otro remito (#{$bolsa->rem_rep_id}). Se registrará como sobrante."
                : 'El código no está registrado en el sistema. Se registrará como sobrante.',
        ]);
    }

    /**
     * Confirma el control: las bolsas escaneadas pasan de RECIBIDA a DISPONIBLE,
     * se generan incidencias por faltantes/sobrantes y el remito queda CONCILIADO.
     */
    #[Middleware('auth')]
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
            }

            if ($bolsasFaltantes->isNotEmpty()) {
                // Las bolsas declaradas que no llegaron físicamente no quedan disponibles.
                Bolsa::query()
                    ->whereKey($bolsasFaltantes->modelKeys())
                    ->update([
                        'estado' => EstadoBolsa::NO_RECIBIDA->value,
                        'updated_at' => $ahora,
                    ]);

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
                    'estado' => 'PENDIENTE',
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
                        'estado' => 'PENDIENTE',
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

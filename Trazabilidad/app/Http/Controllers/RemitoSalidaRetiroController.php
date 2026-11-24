<?php

namespace App\Http\Controllers;

use App\Models\Bolsa;
use App\Models\Incidencia;
use App\Models\RemitoSalidaRetiro;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\EstadoBolsa;

class RemitoSalidaRetiroController extends Controller
{
    #[Middleware('permission:listar remitosSalida')]
    public function index(Request $request): Response
    {
        $buscar = trim((string) $request->input('buscar', ''));
        $estado = (string) $request->input('estado', '');

        $remitos = RemitoSalidaRetiro::with(['usuarioDespacha', 'incidencia', 'manifiestoFinal'])
            ->withCount('bolsas')
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subquery) use ($buscar) {
                    $subquery
                        ->where('numero_remito_interno', 'like', "%{$buscar}%")
                        ->orWhere('numero_remito', 'like', "%{$buscar}%");
                });
            })
            ->when(
                $estado !== '' && $estado !== 'TODOS',
                fn ($query) => $query->where('estado', $estado)
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('remitos-salida/index', [
            'remitos' => $remitos,
            'filtros' => [
                'buscar' => $buscar,
                'estado' => $estado,
            ],
        ]);
    }

    #[Middleware('permission:crear remitosSalida')]
    public function create(): Response
    {
        return Inertia::render('remitos-salida/create');
    }

    #[Middleware('permission:crear remitosSalida')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bolsas_ids' => 'required|array|min:1',
            'bolsas_ids.*' => ['required', 'integer', 'distinct', 'exists:bolsas,id'],
            'observaciones' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $bolsas = Bolsa::whereIn('id', $validated['bolsas_ids'])
                ->lockForUpdate()
                ->get();

            if ($bolsas->count() !== count($validated['bolsas_ids'])) {
                throw ValidationException::withMessages([
                    'bolsas_ids' => 'No se encontraron todas las bolsas seleccionadas.',
                ]);
            }

            $bolsasNoDisponibles = $bolsas->filter(
                fn (Bolsa $bolsa) =>
                    $bolsa->estado !== EstadoBolsa::PESADA
                    || $bolsa->peso === null
                    || $bolsa->peso <= 0
                    || $bolsa->rem_sal_id !== null
            );

            if ($bolsasNoDisponibles->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'bolsas_ids' => 'Solo se pueden despachar bolsas pesadas, con peso y sin remito de salida.',
                ]);
            }

            $anioActual = date('Y');
            $ultimoId = RemitoSalidaRetiro::max('id') ?? 0;
            $numeroCorrelativo = str_pad($ultimoId + 1, 5, '0', STR_PAD_LEFT);
            $numeroRemitoInterno = "RSI-{$anioActual}-{$numeroCorrelativo}";

            $cantidadBolsas = count($validated['bolsas_ids']);

            $remito = RemitoSalidaRetiro::create([
                'numero_remito_interno' => $numeroRemitoInterno,
                'fecha_emision' => now(),
                'cantidad_bolsas_sistema' => $cantidadBolsas,
                'usuario_despacha_id' => $request->user()->id,
                'estado' => 'PENDIENTE_RETIRO',
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            Bolsa::whereIn('id', $validated['bolsas_ids'])->update([
                'rem_sal_id' => $remito->id,
                'estado' => EstadoBolsa::DESPACHADA->value,
            ]);

            return redirect()->route('remitos-salida.show', $remito->id)
                ->with('success', "Remito interno {$numeroRemitoInterno} generado exitosamente. Listo para imprimir.");
        });
    }

    #[Middleware('permission:conciliar remitosSalida')]
    public function conciliar(Request $request, RemitoSalidaRetiro $remito): RedirectResponse
    {
        Gate::authorize('conciliar', $remito);

        $validated = $request->validate([
            'numero_remito' => 'required|string|max:50',
            'fecha_retiro' => 'required|date',
            'cantidad_bolsas_declaradas_Empresa' => 'required|integer|min:1',
            'responsable_empresa' => 'required|string|max:255',
            'datos_transporte' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($remito, $validated, $request) {
            $cantidadSistema = $remito->cantidad_bolsas_sistema;
            $cantidadDgm = (int) $validated['cantidad_bolsas_declaradas_Empresa'];
            $coincide = ($cantidadSistema === $cantidadDgm);

            $nuevoEstado = $coincide ? 'CONCILIADO' : 'CON_INCIDENCIA';

            $remito->update([
                'numero_remito' => $validated['numero_remito'],
                'fecha_retiro' => $validated['fecha_retiro'],
                'cantidad_bolsas_declaradas_Empresa' => $cantidadDgm,
                'responsable_empresa' => $validated['responsable_empresa'],
                'datos_transporte' => $validated['datos_transporte'] ?? null,
                'estado' => $nuevoEstado,
                'observaciones' => $validated['observaciones'] ?? $remito->observaciones,
            ]);

            $remito->bolsas()->update([
                'estado' => EstadoBolsa::RETIRADA_POR_DGM->value,
            ]);

            if (! $coincide) {
                $diferencia = $cantidadSistema - $cantidadDgm;

                Incidencia::create([
                    'fecha_hora' => now(),
                    'usuario_registra' => $request->user()->id,
                    'rem_sal_id' => $remito->id,
                    'tipo_incidencia' => 'DIFERENCIA_CONCILIACION_DGM',
                    'descripcion' => "Discrepancia en remito interno {$remito->numero_remito_interno} (DGM N° {$remito->numero_remito}): El sistema registró {$cantidadSistema} bolsas vs. {$cantidadDgm} declaradas por DGM. Diferencia: {$diferencia} bolsa(s).",
                    'estado' => 'ABIERTA',
                ]);
            }

            return redirect()->route('remitos-salida.show', $remito->id)
                ->with('success', $coincide
                    ? 'Retiro conciliado exitosamente sin discrepancias. Ya puede registrar el manifiesto final.'
                    : 'Retiro conciliado. Se ha generado una incidencia automática por discrepancia de bolsas.');
        });
    }

    /**
     * Anula un remito de salida interno pendiente de retiro y libera sus bolsas.
     */
    #[Middleware('permission:anular remitosSalida')]
    public function anular(Request $request, RemitoSalidaRetiro $remito)
    {
        Gate::authorize('anular', $remito);

        $validated = $request->validate([
            'motivo_anulacion' => ['required', 'string', 'min:5', 'max:500'],
        ], [
            'motivo_anulacion.required' => 'Debe indicar el motivo por el cual se anula el remito.',
            'motivo_anulacion.min' => 'El motivo de anulación debe tener al menos 5 caracteres.',
        ]);

        DB::transaction(function () use ($request, $remito, $validated) {
            // 1. Liberar las bolsas vinculadas para que vuelvan a estar disponibles para despacho
            $remito->bolsas()->update([
                'rem_sal_id' => null,
                'estado' => EstadoBolsa::PESADA->value,
            ]);

            // 2. Registrar auditoría de anulación en observaciones y cambiar estado
            $usuarioNombre = $request->user()->full_name ?? $request->user()->name;
            $fechaHora = now()->format('d/m/Y H:i');
            $notaAnulacion = "[ANULADO el {$fechaHora} por {$usuarioNombre}]: {$validated['motivo_anulacion']}";

            $observacionesActualizadas = $remito->observaciones
                ? "{$remito->observaciones}\n{$notaAnulacion}"
                : $notaAnulacion;

            $remito->update([
                'estado' => 'ANULADO',
                'observaciones' => $observacionesActualizadas,
            ]);
        });

        return redirect()
            ->route('remitos-salida.show', $remito->id)
            ->with('success', "El remito interno {$remito->numero_remito_interno} fue anulado y sus bolsas volvieron a estar disponibles.");
    }

    #[Middleware('permission:verDetalle remitosSalida')]
    public function show(string $id): Response
    {
        $remito = RemitoSalidaRetiro::with([
            'usuarioDespacha',
            'bolsas.tipoBolsa',
            'incidencia',
            'manifiestoFinal.documentoOficial',
        ])
            ->withCount('bolsas')
            ->withSum('bolsas as peso_total_sistema', 'peso')
            ->findOrFail($id);

        return Inertia::render('remitos-salida/show', [
            'remito' => $remito,
        ]);
    }

    #[Middleware('permission:descargarPDF remitosSalida')]
    public function descargarPdf(RemitoSalidaRetiro $remito)
    {
        $remito->load([
            'usuarioDespacha',
            'bolsas.tipoBolsa',
            'bolsas.remitoEntregaServicio.servicio',
            'incidencia',
        ]);

        $pdf = Pdf::loadView('pdfs.remitosalida.generarremitosalida', [
            'remito' => $remito,
        ]);

        return $pdf->stream("remito-salida-{$remito->numero_remito_interno}.pdf");
    }
}

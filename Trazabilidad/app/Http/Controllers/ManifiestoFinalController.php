<?php

namespace App\Http\Controllers;

use App\Models\DocumentoAdjunto;
use App\Models\ManifiestoFinal;
use App\Models\RemitoSalidaRetiro;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use App\Enums\EstadoBolsa;

class ManifiestoFinalController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    #[Middleware('permission:listar manifiestosFinales')]
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ManifiestoFinal::class);

        $buscar = trim((string) $request->input('buscar', ''));
        $fechaDesde = (string) $request->input('fecha_desde', '');
        $fechaHasta = (string) $request->input('fecha_hasta', '');

        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[1]);

        if (! in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[1];
        }

        $manifiestos = ManifiestoFinal::query()
            ->with([
                'remitoSalidaRetiro:id,numero_remito_interno,numero_remito,fecha_emision,fecha_retiro,cantidad_bolsas_declaradas_Empresa,estado',
                'documentoOficial:id,nombre_archivo,url_archivo,fecha_hora',
            ])
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('numero_manifiesto', 'like', "%{$buscar}%")
                        ->orWhereHas('remitoSalidaRetiro', function ($sub) use ($buscar) {
                            $sub->where('numero_remito_interno', 'like', "%{$buscar}%")
                                ->orWhere('numero_remito', 'like', "%{$buscar}%");
                        });
                });
            })
            ->when($fechaDesde !== '', fn ($q) => $q->whereDate('fecha', '>=', $fechaDesde))
            ->when($fechaHasta !== '', fn ($q) => $q->whereDate('fecha', '<=', $fechaHasta))
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('manifiestos-finales/index', [
            'manifiestos' => $manifiestos,
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
            'filtros' => [
                'buscar' => $buscar,
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ],
        ]);
    }

    #[Middleware('permission:verDetalle manifiestosFinales')]
    public function show(ManifiestoFinal $manifiesto): Response
    {
        Gate::authorize('view', $manifiesto);

        $manifiesto->load([
            'remitoSalidaRetiro.bolsas.tipoBolsa',
            'remitoSalidaRetiro.bolsas.remitoEntregaServicio.servicio',
            'documentoOficial',
        ]);

        // Se calcula peso_total_sistema igual que RemitoSalidaRetiroController::show
        $manifiesto->remitoSalidaRetiro?->loadSum('bolsas as peso_total_sistema', 'peso');

        return Inertia::render('manifiestos-finales/show', [
            'manifiesto' => $manifiesto,
        ]);
    }

    #[Middleware('permission:crear manifiestosFinales')]
    public function store(Request $request, RemitoSalidaRetiro $remito): RedirectResponse
    {
        Gate::authorize('create', ManifiestoFinal::class);

        if (! in_array($remito->estado, ['CONCILIADO', 'CON_INCIDENCIA'], true)) {
            throw ValidationException::withMessages([
                'numero_manifiesto' => 'Solo se puede registrar el manifiesto final en remitos ya conciliados.',
            ]);
        }

        if ($remito->manifiestoFinal()->exists()) {
            throw ValidationException::withMessages([
                'numero_manifiesto' => 'Este remito de salida ya posee un manifiesto final registrado.',
            ]);
        }

        $validated = $request->validate([
            'numero_manifiesto' => 'required|string|max:100|unique:manifiestos_finales,numero_manifiesto',
            'fecha' => 'required|date',
            'fecha_tratamiento' => 'required|date|after_or_equal:fecha',
            'cantidad_bolsas' => 'required|integer|min:1',
            'peso_informado' => 'required|numeric|min:0.01',
            'observaciones' => 'nullable|string|max:500',
            'documento' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ], [
            'numero_manifiesto.unique' => 'Ya existe un manifiesto final registrado con ese número.',
            'documento.required' => 'Debe adjuntar el archivo digital del manifiesto final (PDF o imagen).',
            'documento.mimes' => 'El archivo debe ser PDF, JPG o PNG.',
            'documento.max' => 'El archivo no puede superar los 5 MB.',
            'fecha_tratamiento.after_or_equal' => 'La fecha de tratamiento no puede ser anterior a la fecha del manifiesto.',
        ]);

        return DB::transaction(function () use ($request, $remito, $validated) {
            $archivo = $request->file('documento');
            $rutaGuardada = $archivo->store('manifiestos', 'public');

            $documentoAdjunto = DocumentoAdjunto::create([
                'tipo_documento' => 'manifiesto_final',
                'nombre_archivo' => $archivo->getClientOriginalName(),
                'url_archivo' => $rutaGuardada,
                'fecha_hora' => now(),
            ]);

            ManifiestoFinal::create([
                'numero_manifiesto' => $validated['numero_manifiesto'],
                'fecha' => $validated['fecha'],
                'fecha_tratamiento' => $validated['fecha_tratamiento'],
                'rem_sal_id' => $remito->id,
                'cantidad_bolsas' => $validated['cantidad_bolsas'],
                'peso_informado' => $validated['peso_informado'],
                'documento_digital' => $documentoAdjunto->id,
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            $remito->update([
                'estado' => 'FINALIZADO',
            ]);

            $remito->bolsas()->update([
                'estado' => EstadoBolsa::TRATADA_DISPOSICION_FINAL->value,
            ]);

            return redirect()
                ->route('remitos-salida.show', $remito->id)
                ->with('success', "Manifiesto final N° {$validated['numero_manifiesto']} registrado exitosamente.");
        });
    }

    #[Middleware('permission:descargarDocumento manifiestosFinales')]
    public function verDocumento(ManifiestoFinal $manifiesto): BinaryFileResponse
    {
        Gate::authorize('descargarDocumento', $manifiesto);

        $documento = $manifiesto->documentoOficial;

        if (! $documento || ! Storage::disk('public')->exists($documento->url_archivo)) {
            abort(404, 'El archivo digital del manifiesto final no se encuentra disponible.');
        }

        return response()->file(
            Storage::disk('public')->path($documento->url_archivo),
            ['Content-Disposition' => 'inline; filename="' . $documento->nombre_archivo . '"']
        );
    }
}

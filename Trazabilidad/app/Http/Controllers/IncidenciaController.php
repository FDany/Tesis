<?php

namespace App\Http\Controllers;

use App\Enums\EstadoBolsa;
use App\Enums\TipoIncidencia;
use App\Models\Bolsa;
use App\Models\Incidencia;
use App\Models\Servicio;
use App\Models\TipoBolsa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class IncidenciaController extends Controller
{
    #[Middleware('permission:listar incidencias')]
    public function index(Request $request): Response
    {
        $query = Incidencia::with([
            'usuarioRegistra',
            'usuarioCierra',
            'remitoSalidaRetiro',
            'remitoRecepcion',
            'bolsa',
            'tipoBolsa',
            'servicio',
            'documentos',
        ]);

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('tipo_incidencia')) {
            $query->where('tipo_incidencia', $request->tipo_incidencia);
        }

        $registradoPor = trim((string) $request->input('registrado_por', ''));
        if ($registradoPor !== '') {
            $terminos = preg_split('/\s+/', $registradoPor, -1, PREG_SPLIT_NO_EMPTY) ?: [];

            $query->whereHas('usuarioRegistra', function ($usuarioQuery) use ($terminos) {
                foreach ($terminos as $termino) {
                    $usuarioQuery->where(function ($nombreQuery) use ($termino) {
                        $nombreQuery
                            ->where('first_name', 'like', "%{$termino}%")
                            ->orWhere('last_name', 'like', "%{$termino}%");
                    });
                }
            });
        }

        $incidencias = $query->latest('fecha_hora')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('incidencias/index', [
            'incidencias' => $incidencias,
            'filters' => $request->only([
                'estado',
                'tipo_incidencia',
                'registrado_por',
            ]),
            'tiposManuales' => TipoIncidencia::tiposManuales(),
            'estados' => Incidencia::query()
                ->whereNotNull('estado')
                ->where('estado', '<>', '')
                ->distinct()
                ->orderBy('estado')
                ->pluck('estado')
                ->all(),
        ]);
    }

    #[Middleware('permission:crear incidencias')]
    public function create(): Response
    {
        return Inertia::render('incidencias/create', [
            'tiposManuales' => TipoIncidencia::tiposManuales(),
            'servicios' => Servicio::select('id', 'nombre')->orderBy('nombre')->get(),
            'tiposBolsa' => TipoBolsa::select('id', 'tipo_residuo')->get(),
        ]);
    }

    #[Middleware('permission:crear incidencias')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tipo_incidencia' => ['required', 'string', new Enum(TipoIncidencia::class)],
            'descripcion' => 'required|string|min:5|max:600',
            'bolsa_id' => 'required_if:tipo_incidencia,BOLSA_DANADA|nullable|integer|exists:bolsas,id',
            'codigo_bolsa' => 'nullable|string|max:30',
            'codigo_no_registrado' => 'nullable|string|max:30',
            'servicio_id' => 'nullable|exists:servicios,id',
            'tipo_bolsa_id' => 'nullable|exists:tipos_bolsa,id',
            'rem_sal_id' => 'nullable|exists:remitos_salida_retiro,id',
            'documentos' => 'nullable|array',
            'documentos.*' => 'file|mimes:jpeg,png,jpg,webp,pdf|max:5120',
        ]);

        $bolsa = null;
        if (! empty($validated['bolsa_id'])) {
            $bolsa = Bolsa::findOrFail($validated['bolsa_id']);

            if (
                $validated['tipo_incidencia'] === TipoIncidencia::BOLSA_DANADA->value
                && ! empty($validated['codigo_bolsa'])
                && strcasecmp(trim($validated['codigo_bolsa']), $bolsa->codigo_barra) !== 0
            ) {
                throw ValidationException::withMessages([
                    'codigo_bolsa' => 'El código de bolsa no coincide con la bolsa seleccionada.',
                ]);
            }
        }

        $incidencia = DB::transaction(function () use ($request, $validated, $bolsa) {
            $incidencia = Incidencia::create([
                'fecha_hora' => now(),
                'usuario_registra' => $request->user()->id,
                'tipo_incidencia' => $validated['tipo_incidencia'],
                'descripcion' => $validated['descripcion'],
                'bolsa_id' => $bolsa?->id,
                'codigo_no_registrado' => $validated['codigo_no_registrado'] ?? null,
                'servicio_id' => $validated['servicio_id'] ?? null,
                'tipo_bolsa_id' => $validated['tipo_bolsa_id'] ?? null,
                'rem_sal_id' => $validated['rem_sal_id'] ?? null,
                'estado' => 'ABIERTA',
            ]);

            if ($bolsa) {
                $bolsa->update([
                    'estado' => EstadoBolsa::CON_INCIDENCIA,
                ]);
            }

            if ($request->hasFile('documentos')) {
                foreach ($request->file('documentos') as $file) {
                    if ($file->isValid()) {
                        $extension = strtolower($file->getClientOriginalExtension());
                        $tipoDoc = ($extension === 'pdf') ? 'pdf' : 'foto_incidencia';
                        $path = $file->store('incidencias', 'public');

                        $incidencia->documentos()->create([
                            'tipo_documento' => $tipoDoc,
                            'nombre_archivo' => $file->getClientOriginalName(),
                            'url_archivo' => $path,
                            'fecha_hora' => now(),
                        ]);
                    }
                }
            }

            return $incidencia;
        });

        return redirect()->route('incidencias.index')
            ->with('message', "Incidencia #{$incidencia->id} registrada correctamente.");
    }

    #[Middleware('permission:verDetalle incidencias')]
    public function show(Incidencia $incidencia): Response
    {
        $incidencia->load([
            'usuarioRegistra',
            'usuarioCierra',
            'remitoSalidaRetiro',
            'bolsa',
            'tipoBolsa',
            'servicio',
            'documentos',
        ]);

        return Inertia::render('incidencias/show', [
            'incidencia' => $incidencia,
        ]);
    }

    #[Middleware('permission:resolver incidencias')]
    public function resolver(Request $request, Incidencia $incidencia): RedirectResponse
    {
        Gate::authorize('resolver', $incidencia);

        $validated = $request->validate([
            'accion_adoptada' => 'required|string|min:5|max:600',
            'estado' => 'required|string|in:EN_ANALISIS,RESUELTA,CERRADA',
        ]);

        $incidencia->update([
            'accion_adoptada' => $validated['accion_adoptada'],
            'estado' => $validated['estado'],
            'usuario_cierra' => $request->user()->id,
            'fecha_resolucion' => now(),
        ]);

        return redirect()->back()->with('message', "Incidencia #{$incidencia->id} actualizada correctamente.");
    }
}


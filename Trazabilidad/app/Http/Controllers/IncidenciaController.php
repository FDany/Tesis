<?php

namespace App\Http\Controllers;

use App\Enums\TipoIncidencia;
use App\Models\Bolsa;
use App\Models\DocumentoAdjunto;
use App\Models\Incidencia;
use App\Models\Servicio;
use App\Models\TipoBolsa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Inertia\Response;

class IncidenciaController extends Controller
{
    /**
     * Muestra el listado de incidencias con filtros y paginación.
     */
    public function index(Request $request): Response
    {
        $query = Incidencia::with([
            'usuarioRegistra',
            'usuarioCierra',
            'remitoSalidaRetiro',
            'bolsa',
            'tipoBolsa',
            'servicio',
            'documentos',
        ]);

        // Filtro por Estado
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        // Filtro por Tipo de Incidencia
        if ($request->filled('tipo_incidencia')) {
            $query->where('tipo_incidencia', $request->tipo_incidencia);
        }

        $incidencias = $query->latest('fecha_hora')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('incidencias/index', [
            'incidencias'  => $incidencias,
            'filters'      => $request->only(['estado', 'tipo_incidencia']),
            'tiposManuales' => TipoIncidencia::tiposManuales(),
        ]);
    }

    /**
     * Muestra el formulario para registrar una incidencia manual.
     */
    public function create(): Response
    {
        return Inertia::render('incidencias/create', [
            'tiposManuales' => TipoIncidencia::tiposManuales(),
            'servicios'     => Servicio::select('id', 'nombre')->orderBy('nombre')->get(),
            'tiposBolsa'    => TipoBolsa::select('id', 'tipo_residuo')->get(),
        ]);
    }

    /**
     * Guarda una nueva incidencia manual y procesa archivos/fotografías si existen.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tipo_incidencia'      => ['required', 'string', new Enum(TipoIncidencia::class)],
            'descripcion'          => 'required|string|min:5|max:1000',
            'bolsa_id'             => 'nullable|exists:bolsas,id',
            'codigo_no_registrado' => 'nullable|string|max:30',
            'servicio_id'          => 'nullable|exists:servicios,id',
            'tipo_bolsa_id'        => 'nullable|exists:tipos_bolsa,id',
            'rem_sal_id'           => 'nullable|exists:remitos_salida_retiro,id',
            'documentos'           => 'nullable|array',
            'documentos.*'         => 'file|mimes:jpeg,png,jpg,webp,pdf|max:5120', // Máx 5MB
        ]);

        // 1. Crear el registro de la Incidencia
        $incidencia = Incidencia::create([
            'fecha_hora'           => now(),
            'usuario_registra'     => $request->user()->id,
            'tipo_incidencia'      => $validated['tipo_incidencia'],
            'descripcion'          => $validated['descripcion'],
            'bolsa_id'             => $validated['bolsa_id'] ?? null,
            'codigo_no_registrado' => $validated['codigo_no_registrado'] ?? null,
            'servicio_id'          => $validated['servicio_id'] ?? null,
            'tipo_bolsa_id'        => $validated['tipo_bolsa_id'] ?? null,
            'rem_sal_id'           => $validated['rem_sal_id'] ?? null,
            'estado'               => 'ABIERTA',
        ]);

        // 2. Procesar la fotografía/evidencia polimórfica si fue adjuntada
        if ($request->hasFile('documentos')) {
            foreach ($request->file('documentos') as $file) {
                if ($file->isValid()) {
                    $extension = strtolower($file->getClientOriginalExtension());
                    $tipoDoc = ($extension === 'pdf') ? 'pdf' : 'foto_incidencia';
                    $path = $file->store('incidencias', 'public');

                    $incidencia->documentos()->create([
                        'tipo_documento' => $tipoDoc,
                        'nombre_archivo' => $file->getClientOriginalName(),
                        'url_archivo'    => $path,
                        'fecha_hora'     => now(),
                    ]);
                }
            }
        }

        return redirect()->route('incidencias.index')
            ->with('message', "Incidencia #{$incidencia->id} registrada correctamente.");
    }

    /**
     * Muestra el detalle de una incidencia específica.
     */
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

    /**
     * Actualiza la incidencia con las acciones adoptadas y la marca como resuelta/cerrada.
     */
    public function resolver(Request $request, Incidencia $incidencia): RedirectResponse
    {
        $validated = $request->validate([
            'accion_adoptada' => 'required|string|min:5',
            'estado'          => 'required|string|in:EN_ANALISIS,RESUELTA,CERRADA',
        ]);

        $incidencia->update([
            'accion_adoptada' => $validated['accion_adoptada'],
            'estado'          => $validated['estado'],
            'usuario_cierra'  => $request->user()->id,
            'fecha_resolucion' => now(),
        ]);

        return redirect()->back()->with('message', "Incidencia #{$incidencia->id} actualizada correctamente.");
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Bolsa;
use App\Models\Incidencia;
use App\Models\RemitoSalidaRetiro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Validation\ValidationException;

class RemitoSalidaRetiroController extends Controller
{
    /**
     * Muestra el historial de remitos de salida.
     */
    public function index()
    {
        $remitos = RemitoSalidaRetiro::with(['usuarioDespacha', 'incidencia'])
            ->withCount('bolsas')
            ->latest()
            ->paginate(15);

        return Inertia::render('remitos-salida/index', [
            'remitos' => $remitos,
        ]);
    }

    /**
     * Formulario para la creación del despacho interno.
     */
    public function create()
    {
        return Inertia::render('remitos-salida/create');
    }

    /**
     * FASE 1: Emisión del Remito Interno del Hospital (Generación de PDF).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bolsas_ids' => 'required|array|min:1',     // Validación de que se envíe un array de IDs de bolsas
            'bolsas_ids.*' => ['required', 'integer', 'distinct', 'exists:bolsas,id'],  // Validación cada ID esté presente, sea entero, no se repita y corresponda a una bolsa existente
            'observaciones' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {

            //
            $bolsas = Bolsa::whereIn('id', $validated['bolsas_ids'])
                ->lockForUpdate()   // Bloquea esas bolsas para que otra transacción no las modifique mientras se procesa este despacho.
                ->get();            // Ejecuta la consulta y devuelve las bolsas encontradas como colección

            // Validación adicional, nos aseguramos de que todas las bolsas solicitadas fueron encontradas
            if ($bolsas->count() !== count($validated['bolsas_ids'])) {
                throw ValidationException::withMessages([
                    'bolsas_ids' => 'No se encontraron todas las bolsas seleccionadas.',
                ]);
            }

            $bolsasNoDisponibles = $bolsas->filter(
                fn (Bolsa $bolsa) =>
                    $bolsa->estado !== 'PESADA'
                    || $bolsa->peso === null
                    || $bolsa->peso <= 0
                    || $bolsa->rem_sal_id !== null
            );

            if ($bolsasNoDisponibles->isNotEmpty()) {
                throw ValidationException::withMessages([
                    'bolsas_ids' => 'Solo se pueden despachar bolsas pesadas, con peso y sin remito de salida.',
                ]);
            }


            // Generar correlativo interno automático (Ej: RSI-2026-00001)
            $anioActual = date('Y');
            $ultimoId = RemitoSalidaRetiro::max('id') ?? 0;
            $numeroCorrelativo = str_pad($ultimoId + 1, 5, '0', STR_PAD_LEFT);
            $numeroRemitoInterno = "RSI-{$anioActual}-{$numeroCorrelativo}";

            $cantidadBolsas = count($validated['bolsas_ids']);

            // 1. Crear el remito interno institucional
            $remito = RemitoSalidaRetiro::create([
                'numero_remito_interno' => $numeroRemitoInterno,
                'fecha_emision' => now(),
                'cantidad_bolsas_sistema' => $cantidadBolsas,
                'usuario_despacha_id' => $request->user()->id,
                'estado' => 'PENDIENTE_RETIRO',
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            // 2. Asociar bolsas y cambiar su estado
            Bolsa::whereIn('id', $validated['bolsas_ids'])->update([
                'rem_sal_id' => $remito->id,
                'estado' => 'DESPACHADA',
            ]);

            return redirect()->route('remitos-salida.show', $remito->id)
                ->with('message', "Remito interno {$numeroRemitoInterno} generado exitosamente. Listo para imprimir.");
        });
    }

    /**
     * FASE 2: Conciliación con el Remito Oficial entregado por DGM.
     */
    public function conciliar(Request $request, string $id)
    {
        $remito = RemitoSalidaRetiro::findOrFail($id);

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

            // 1. Actualizar el remito con los datos recibidos de DGM
            $remito->update([
                'numero_remito' => $validated['numero_remito'],
                'fecha_retiro' => $validated['fecha_retiro'],
                'cantidad_bolsas_declaradas_Empresa' => $cantidadDgm,
                'responsable_empresa' => $validated['responsable_empresa'],
                'datos_transporte' => $validated['datos_transporte'] ?? null,
                'estado' => $nuevoEstado,
                'observaciones' => $validated['observaciones'] ?? $remito->observaciones,
            ]);

            // 2. En caso de discrepancia, generar la incidencia automática
            if (!$coincide) {
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

            return redirect()->route('remitos-salida.index')
                ->with('message', $coincide
                    ? 'Retiro conciliado exitosamente sin discrepancias.'
                    : 'Retiro conciliado. Se ha generado una incidencia automática por discrepancia de bolsas.');
        });
    }

    /**
     * Muestra el detalle de un remito de salida.
     */
    public function show(string $id)
    {
        $remito = RemitoSalidaRetiro::with([
            'usuarioDespacha',
            'bolsas.tipoBolsa', // Anidamos la relación para cargar el tipo de residuo de cada bolsa
            'incidencia'
        ])
            ->withCount('bolsas')
            ->withSum('bolsas as peso_total_sistema', 'peso')
            ->findOrFail($id);

        return Inertia::render('remitos-salida/show', [
            'remito' => $remito,
        ]);
    }

    /**
     * Genera y descarga el PDF del Remito Interno de Salida.
     */
    public function descargarPdf(RemitoSalidaRetiro $remito)
    {
        // Carga anidada de relaciones Eloquent
        $remito->load([
            'usuarioDespacha',
            'bolsas.tipoBolsa',
            'bolsas.remitoEntregaServicio.servicio',
            'incidencia'
        ]);

        // Generar la vista Blade pasándole el modelo cargado
        $pdf = Pdf::loadView('remitosalida.generarremitosalida', [
            'remito' => $remito,
        ]);

        // Transmitir en el navegador (stream) o descargar (download)
        return $pdf->stream("remito-salida-{$remito->numero_remito_interno}.pdf");
    }
}

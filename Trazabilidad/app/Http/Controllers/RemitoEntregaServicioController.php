<?php

namespace App\Http\Controllers;

use App\Models\Bolsa;
use App\Models\RemitoEntregaServicio;
use App\Models\Servicio;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RemitoEntregaServicioController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    #[Middleware('permission:listar remitosEntregaServicio')]
    public function index(Request $request): Response
    {
        $buscar = trim((string) $request->input('buscar', ''));
        $retiraNombre = trim((string) $request->input('retira_nombre', ''));
        $servicioId = (string) $request->input('servicio_id', '');

        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (! in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        $remitos = RemitoEntregaServicio::with(['servicio', 'usuarioEntrega'])
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('id', $buscar);
            })
            ->when($retiraNombre !== '', function ($query) use ($retiraNombre) {
                $query->where('retira_nombre', 'like', "%{$retiraNombre}%");
            })
            ->when(
                $servicioId !== '' && $servicioId !== 'TODOS',
                fn ($query) => $query->where('servicio_id', $servicioId)
            )
            ->orderByDesc('fecha_entrega')
            ->paginate($porPagina)
            ->withQueryString();

        return Inertia::render('remitos-entrega-servicio/index', [
            'remitos' => $remitos,
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
            'servicios' => Servicio::query()
                ->orderBy('nombre')
                ->get(['id', 'nombre']),
            'filtros' => [
                'buscar' => $buscar,
                'retira_nombre' => $retiraNombre,
                'servicio_id' => $servicioId,
            ],
        ]);
    }

    #[Middleware('permission:crear remitosEntregaServicio')]
    public function create(Request $request): Response
    {
        return Inertia::render('remitos-entrega-servicio/create', [
            'servicios' => Servicio::query()
                ->where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre']),
            'remitoEntregaServicio' => $request->session()->get('remitoEntregaServicio'),
        ]);
    }

    #[Middleware('permission:crear remitosEntregaServicio')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'servicio_id' => ['required', 'integer', 'exists:servicios,id'],
            'retira_nombre' => ['required', 'string', 'max:255'],
            'entregado_cargo' => ['required', 'string', 'max:255'],
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],
            'codigos.*' => ['required', 'string', 'distinct:strict', 'regex:/^\d{13}$/'],
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $servicio = Servicio::query()
                ->whereKey($validated['servicio_id'])
                ->where('activo', true)
                ->first();

            if (! $servicio) {
                throw ValidationException::withMessages([
                    'servicio_id' => 'El servicio no existe o está inactivo.',
                ]);
            }

            $bolsas = Bolsa::query()
                ->whereIn('codigo_barra', $validated['codigos'])
                ->lockForUpdate()
                ->get();

            $codigosNoEncontrados = array_diff(
                $validated['codigos'],
                $bolsas->pluck('codigo_barra')->all(),
            );

            if ($codigosNoEncontrados !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'No se encontraron estas bolsas: '
                        . implode(', ', $codigosNoEncontrados),
                ]);
            }

            $codigosNoDisponibles = $bolsas
                ->filter(fn (Bolsa $bolsa) =>
                    $bolsa->estado !== 'DISPONIBLE'
                    || $bolsa->remitos_serv_id !== null
                )
                ->pluck('codigo_barra')
                ->all();

            if ($codigosNoDisponibles !== []) {
                throw ValidationException::withMessages([
                    'codigos' => 'Estas bolsas no están disponibles: '
                        . implode(', ', $codigosNoDisponibles),
                ]);
            }

            $remito = RemitoEntregaServicio::create([
                'entrega_usuario_id' => $request->user()->id,
                'retira_nombre' => $validated['retira_nombre'],
                'entregado_cargo' => $validated['entregado_cargo'],
                'fecha_entrega' => now(),
                'servicio_id' => $servicio->id,
                'cantidad_bolsas_dadas' => $bolsas->count(),
            ]);

            foreach ($bolsas as $bolsa) {
                $bolsa->update([
                    'estado' => 'OCUPADO',
                    'remitos_serv_id' => $remito->id,
                ]);
            }

            return redirect()
                ->route('remitos-entrega-servicio.create')
                ->with('success', 'Bolsas entregadas al servicio correctamente.')
                ->with('remitoEntregaServicio', [
                    'id' => $remito->id,
                    'fecha_entrega' => $remito->fecha_entrega->format('d/m/Y H:i'),
                    'servicio' => $servicio->nombre,
                    'retira_nombre' => $remito->retira_nombre,
                    'entregado_cargo' => $remito->entregado_cargo,
                    'cantidad_bolsas_dadas' => $bolsas->count(),
                    'codigos' => $bolsas->pluck('codigo_barra')->values()->all(),
                ]);
        });
    }

    #[Middleware('permission:descargarPDF remitosEntregaServicio')]
    public function descargarPdf(RemitoEntregaServicio $remito)
    {
        $remito->load([
            'usuarioEntrega',
            'servicio',
            'bolsas' => fn ($query) => $query->orderBy('id'),
        ]);

        return Pdf::loadView('remitoentregaservicio.generarremitoentregaservicio', [
            'remito' => $remito,
        ])->download("remito-entrega-servicio-{$remito->id}.pdf");
    }
}

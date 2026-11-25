<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class AuditoriaController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    private const COLUMNAS_ORDENABLES = [
        'fecha_hora',
        'operacion',
        'bolsa_id',
        'responsable_usuario_id',
    ];

    #[Middleware('permission:listar auditorias')]
    public function index(Request $request): Response
    {
        $filtros = $request->validate([
            'codigo_barra' => ['nullable', 'string', 'max:50'],
            'operacion' => ['nullable', 'string', 'max:100'],
            'responsable_id' => ['nullable', 'integer', 'exists:users,id'],
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'por_pagina' => ['nullable', 'integer'],
            'sort' => ['nullable', 'string'],
            'direction' => ['nullable', 'in:asc,desc'],
        ]);

        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) ($filtros['por_pagina'] ?? $opcionesPorPagina[0]);

        if (! in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        $orden = $filtros['sort'] ?? 'fecha_hora';
        if (! in_array($orden, self::COLUMNAS_ORDENABLES, true)) {
            $orden = 'fecha_hora';
        }

        $direccion = $filtros['direction'] ?? 'desc';

        $query = Auditoria::query()
            ->with([
                'bolsa:id,codigo_barra,tipo_bolsa_id',
                'bolsa.tipoBolsa:id,tipo_residuo,color',
                'responsable:id,first_name,last_name,dni',
            ])
            ->orderBy($orden, $direccion)
            ->orderByDesc('id');

        if (! empty($filtros['codigo_barra'])) {
            $codigo = trim($filtros['codigo_barra']);
            $query->whereHas('bolsa', function ($q) use ($codigo) {
                $q->where('codigo_barra', 'like', "%{$codigo}%");
            });
        }

        if (! empty($filtros['operacion'])) {
            $query->where('operacion', $filtros['operacion']);
        }

        if (! empty($filtros['responsable_id'])) {
            $query->where('responsable_usuario_id', $filtros['responsable_id']);
        }

        if (! empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha_hora', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha_hora', '<=', $filtros['fecha_hasta']);
        }

        $auditorias = $query->paginate($porPagina)->withQueryString();

        $operacionesDisponibles = Auditoria::query()
            ->select('operacion')
            ->distinct()
            ->orderBy('operacion')
            ->pluck('operacion');

        $responsables = User::query()
            ->select('id', 'first_name', 'last_name')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        return Inertia::render('auditorias/index', [
            'auditorias' => $auditorias,
            'filtros' => [
                'codigo_barra' => $filtros['codigo_barra'] ?? '',
                'operacion' => $filtros['operacion'] ?? '',
                'responsable_id' => isset($filtros['responsable_id']) ? (string) $filtros['responsable_id'] : '',
                'fecha_desde' => $filtros['fecha_desde'] ?? '',
                'fecha_hasta' => $filtros['fecha_hasta'] ?? '',
            ],
            'operacionesDisponibles' => $operacionesDisponibles,
            'responsables' => $responsables,
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
            'sort' => $orden,
            'direction' => $direccion,
        ]);
    }
}

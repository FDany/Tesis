<?php

namespace App\Services;

use App\Enums\EstadoBolsa;
use App\Models\Bolsa;
use App\Models\RemitoRecepcion;

class BolsaScannerService
{
    public function buscarParaEntrega(string $codigo): array
    {
        $bolsa = Bolsa::query()
            ->where('codigo_barra', $codigo)
            ->first();

        if (! $bolsa) {
            return [
                'status' => 404,
                'payload' => ['message' => 'No existe una bolsa con ese código.'],
            ];
        }

        if ($bolsa->estado !== EstadoBolsa::DISPONIBLE || $bolsa->remitos_serv_id !== null) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} no está disponible. Estado actual: {$bolsa->estado->label()}.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'id' => $bolsa->id,
                'codigo_barra' => $bolsa->codigo_barra,
                'estado' => $bolsa->estado->value,
            ],
        ];
    }

    public function buscarParaRecepcionDeposito(string $codigo): array
    {
        $bolsa = Bolsa::query()
            ->where('codigo_barra', $codigo)
            ->first();

        if (! $bolsa) {
            return [
                'status' => 404,
                'payload' => ['message' => 'No existe una bolsa con ese código.'],
            ];
        }

        if (
            ! in_array($bolsa->estado, [EstadoBolsa::ENTREGADA_A_SERVICIO, EstadoBolsa::UTILIZADA], true)
            || $bolsa->remitos_serv_id === null
            || $bolsa->recep_dep_id !== null
        ) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} no está pendiente de recepción desde un servicio. Estado actual: {$bolsa->estado->label()}.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'id' => $bolsa->id,
                'codigo_barra' => $bolsa->codigo_barra,
                'estado' => $bolsa->estado->value,
            ],
        ];
    }

    public function buscarParaDespacho(string $codigo): array
    {
        $bolsa = Bolsa::query()
            ->where('codigo_barra', $codigo)
            ->first();

        if (! $bolsa) {
            return [
                'status' => 404,
                'payload' => ['message' => 'No se encontró ninguna bolsa con ese código.'],
            ];
        }

        if (
            $bolsa->rem_sal_id !== null
            || in_array($bolsa->estado, [
                EstadoBolsa::DESPACHADA,
                EstadoBolsa::RETIRADA_POR_DGM,
                EstadoBolsa::TRATADA_DISPOSICION_FINAL,
            ], true)
        ) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} ya se encuentra en estado '{$bolsa->estado->label()}' y no puede ser despachada nuevamente.",
                ],
            ];
        }

        if ($bolsa->estado !== EstadoBolsa::PESADA || empty($bolsa->peso)) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} está en estado '{$bolsa->estado->label()}'. Debe ser registrada y pesada en depósito antes de emitir un despacho.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => $bolsa,
        ];
    }

    public function verificarDisponibleParaAlta(string $codigo): array
    {
        $existe = Bolsa::query()
            ->where('codigo_barra', $codigo)
            ->exists();

        if ($existe) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "El código {$codigo} ya se encuentra registrado en el sistema.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'codigo_barra' => $codigo,
                'disponible' => true,
            ],
        ];
    }

    public function evaluarEscaneoRecepcion(
        RemitoRecepcion $remito,
        string $codigo,
        array $codigosYaEscaneados = [],
    ): array {
        if (in_array($codigo, $codigosYaEscaneados, true)) {
            return [
                'status' => 422,
                'payload' => [
                    'codigo_barra' => $codigo,
                    'resultado' => 'DUPLICADO',
                    'message' => "El código {$codigo} ya fue escaneado en este control.",
                ],
            ];
        }

        $bolsa = Bolsa::query()
            ->where('codigo_barra', $codigo)
            ->first();

        if ($bolsa && (int) $bolsa->rem_rep_id === $remito->id) {
            if ($bolsa->estado !== EstadoBolsa::RECIBIDA) {
                return [
                    'status' => 422,
                    'payload' => [
                        'codigo_barra' => $bolsa->codigo_barra,
                        'resultado' => 'ESTADO_INVALIDO',
                        'message' => "La bolsa {$bolsa->codigo_barra} no está pendiente de control. Estado actual: {$bolsa->estado->label()}.",
                    ],
                ];
            }

            return [
                'status' => 200,
                'payload' => [
                    'id' => $bolsa->id,
                    'codigo_barra' => $bolsa->codigo_barra,
                    'resultado' => 'DECLARADA',
                    'message' => 'Código correcto: pertenece al remito recibido.',
                ],
            ];
        }

        $fueraDeRango = false;
        if (
            is_string($remito->codigo_inicio)
            && is_string($remito->codigo_fin)
            && preg_match('/^\d{13}$/', $remito->codigo_inicio)
            && preg_match('/^\d{13}$/', $remito->codigo_fin)
            && preg_match('/^\d{13}$/', $codigo)
        ) {
            $fueraDeRango = strcmp($codigo, $remito->codigo_inicio) < 0
                || strcmp($codigo, $remito->codigo_fin) > 0;
        }

        if ($bolsa || $fueraDeRango) {
            return [
                'status' => 200,
                'payload' => [
                    'codigo_barra' => $codigo,
                    'resultado' => 'FUERA_DE_RANGO',
                    'message' => $bolsa
                        ? "Código fuera de rango: la bolsa pertenece al remito #{$bolsa->rem_rep_id}."
                        : "Código fuera de rango: no pertenece al rango ({$remito->codigo_inicio} - {$remito->codigo_fin}) del remito.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'codigo_barra' => $codigo,
                'resultado' => 'INEXISTENTE',
                'message' => 'Código inexistente: no corresponde a una recepción registrada.',
            ],
        ];
    }

    /**
     * @param  array<int, string>  $codigosEscaneados
     * @return array<int, string>
     */
    public function obtenerFaltantesRecepcion(RemitoRecepcion $remito, array $codigosEscaneados = []): array
    {
        return $remito->bolsas()
            ->where('estado', EstadoBolsa::RECIBIDA->value)
            ->pluck('codigo_barra')
            ->reject(fn (string $codigo) => in_array($codigo, $codigosEscaneados, true))
            ->values()
            ->all();
    }
}

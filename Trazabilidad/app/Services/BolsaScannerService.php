<?php

namespace App\Services;

use App\Models\Bolsa;

class BolsaScannerService
{
    /**
     * Valida si una bolsa está disponible para ser entregada a un servicio.
     *
     * @return array{status: int, payload: array<string, mixed>}
     */
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

        if ($bolsa->estado !== 'DISPONIBLE' || $bolsa->remitos_serv_id !== null) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} no está disponible. Estado actual: {$bolsa->estado}.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'id' => $bolsa->id,
                'codigo_barra' => $bolsa->codigo_barra,
                'estado' => $bolsa->estado,
            ],
        ];
    }

    /**
     * Valida si una bolsa ocupada por un servicio puede ingresar al depósito de residuos.
     *
     * @return array{status: int, payload: array<string, mixed>}
     */
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
            $bolsa->estado !== 'OCUPADO'
            || $bolsa->remitos_serv_id === null
            || $bolsa->recep_dep_id !== null
        ) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} no está pendiente de recepción desde un servicio. Estado actual: {$bolsa->estado}.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => [
                'id' => $bolsa->id,
                'codigo_barra' => $bolsa->codigo_barra,
                'estado' => $bolsa->estado,
            ],
        ];
    }

    /**
     * Valida si una bolsa ya pesada en depósito puede incluirse en un remito de salida DGM.
     *
     * @return array{status: int, payload: mixed}
     */
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
            || in_array($bolsa->estado, ['DESPACHADA', 'RETIRADA POR DGM', 'TRATADA / DISPOSICIÓN FINAL'], true)
        ) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} ya se encuentra en estado '{$bolsa->estado}' y no puede ser despachada nuevamente.",
                ],
            ];
        }

        if ($bolsa->estado !== 'PESADA' || empty($bolsa->peso)) {
            return [
                'status' => 422,
                'payload' => [
                    'message' => "La bolsa {$bolsa->codigo_barra} está en estado '{$bolsa->estado}'. Debe ser registrada y pesada en depósito antes de emitir un despacho.",
                ],
            ];
        }

        return [
            'status' => 200,
            'payload' => $bolsa,
        ];
    }

    /**
     * Valida que un código de barras de 13 dígitos no esté registrado aún
     * (útil para escaneo en alta de bolsas / remitos de recepción).
     *
     * @return array{status: int, payload: array<string, mixed>}
     */
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
}

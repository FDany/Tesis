<?php

namespace App\Enums;

enum EstadoBolsa: string
{
    case NO_RECIBIDA = 'NO_RECIBIDA';
    case RECIBIDA = 'RECIBIDA';
    case DISPONIBLE = 'DISPONIBLE';
    case ENTREGADA_A_SERVICIO = 'ENTREGADA_A_SERVICIO';
    case UTILIZADA = 'UTILIZADA';
    case INGRESADA_AL_DEPOSITO = 'INGRESADA_AL_DEPOSITO';
    case PESADA = 'PESADA';
    case DESPACHADA = 'DESPACHADA';
    case RETIRADA_POR_DGM = 'RETIRADA_POR_DGM';
    case TRATADA_DISPOSICION_FINAL = 'TRATADA_DISPOSICION_FINAL';

    /**
     * Etiqueta legible para mostrar en vistas, badges y reportes.
     */
    public function label(): string
    {
        return match ($this) {
            self::NO_RECIBIDA => 'No Recibida',
            self::RECIBIDA => 'Recibida',
            self::DISPONIBLE => 'Disponible',
            self::ENTREGADA_A_SERVICIO => 'Entregada a Servicio',
            self::UTILIZADA => 'Utilizada',
            self::INGRESADA_AL_DEPOSITO => 'Ingresada al Depósito',
            self::PESADA => 'Pesada',
            self::DESPACHADA => 'Despachada',
            self::RETIRADA_POR_DGM => 'Retirada por DGM',
            self::TRATADA_DISPOSICION_FINAL => 'Tratada / Disposición Final',
        };
    }

    /**
     * Estados que representan bolsas que efectivamente ingresaron al hospital.
     */
    public static function recibidas(): array
    {
        return [
            self::RECIBIDA->value,
            self::DISPONIBLE->value,
            self::ENTREGADA_A_SERVICIO->value,
            self::UTILIZADA->value,
            self::INGRESADA_AL_DEPOSITO->value,
            self::PESADA->value,
            self::DESPACHADA->value,
            self::RETIRADA_POR_DGM->value,
            self::TRATADA_DISPOSICION_FINAL->value,
        ];
    }

    /**
     * Estados que representan bolsas que ya fueron utilizadas o pasaron por generación de residuos.
     */
    public static function utilizadas(): array
    {
        return [
            self::UTILIZADA->value,
            self::INGRESADA_AL_DEPOSITO->value,
            self::PESADA->value,
            self::DESPACHADA->value,
            self::RETIRADA_POR_DGM->value,
            self::TRATADA_DISPOSICION_FINAL->value,
        ];
    }

    /**
     * Estados que representan bolsas que salieron del hospital con operador externo (DGM).
     */
    public static function retiradas(): array
    {
        return [
            self::RETIRADA_POR_DGM->value,
            self::TRATADA_DISPOSICION_FINAL->value,
        ];
    }

    /**
     * Estados de bolsas físicamente almacenadas en el depósito de residuos.
     */
    public static function enDeposito(): array
    {
        return [
            self::INGRESADA_AL_DEPOSITO->value,
            self::PESADA->value,
        ];
    }
}

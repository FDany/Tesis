<?php

namespace App\Enums;

enum TipoIncidencia: string
{
    // A-C: Identificación y Código
    case CODIGO_ILEGIBLE = 'CODIGO_ILEGIBLE';
    case CODIGO_DUPLICADO = 'CODIGO_DUPLICADO';
    case CODIGO_NO_REGISTRADO = 'CODIGO_NO_REGISTRADO';

    // D-F, J: Trazabilidad y Servicio
    case BOLSA_SIN_ENTREGA = 'BOLSA_SIN_ENTREGA';
    case BOLSA_NO_RETORNADA = 'BOLSA_NO_RETORNADA';
    case INGRESO_DEP_SIN_ENTREGA = 'INGRESO_DEP_SIN_ENTREGA';
    case BOLSA_SIN_SERVICIO = 'BOLSA_SIN_SERVICIO';

    // G-I: Pesaje y Cantidades
    case DIFERENCIA_PESO = 'DIFERENCIA_PESO';
    case DIFERENCIA_CONCILIACION_DGM = 'DIFERENCIA_CONCILIACION_DGM';
    case BOLSA_SIN_PESAJE = 'BOLSA_SIN_PESAJE';

    // K-L: Documentación y Otros
    case DOCUMENTACION_FALTANTE = 'DOCUMENTACION_FALTANTE';
    case OTRA = 'OTRA';

    // M-N: Daños y Peso
    case BOLSA_DANADA = 'BOLSA_DANADA';
    case PESO_FUERA_DE_RANGO = 'PESO_FUERA_DE_RANGO';

    /**
     * Retorna una etiqueta legible para mostrar en las vistas/tablas.
     */
    public function label(): string
    {
        return match ($this) {
            self::CODIGO_ILEGIBLE => 'Código de barras ilegible',
            self::CODIGO_DUPLICADO => 'Código de barras duplicado',
            self::CODIGO_NO_REGISTRADO => 'Código no registrado en sistema',
            self::BOLSA_SIN_ENTREGA => 'Bolsa encontrada sin entrega registrada',
            self::BOLSA_NO_RETORNADA => 'Bolsa entregada pero no retornada a depósito',
            self::INGRESO_DEP_SIN_ENTREGA => 'Ingreso a depósito sin entrega previa',
            self::BOLSA_SIN_SERVICIO => 'Bolsa sin servicio de origen identificado',
            self::DIFERENCIA_PESO => 'Diferencia en el peso registrado',
            self::DIFERENCIA_CONCILIACION_DGM => 'Diferencia de cantidad en retiro DGM',
            self::BOLSA_SIN_PESAJE => 'Bolsa pendiente de pesaje',
            self::DOCUMENTACION_FALTANTE => 'Documentación física o digital faltante',

            self::BOLSA_DANADA => 'Bolsa dañada o comprometida',
            self::PESO_FUERA_DE_RANGO => 'Peso de la bolsa fuera del rango esperado',

            self::OTRA => 'Otra incidencia / Evento no contemplado',

            
        };
    }

    /**
     * Retorna únicamente los tipos de incidencia que pueden ser creados manualmente por un usuario.
     */
    public static function tiposManuales(): array
    {
        return [
            self::CODIGO_ILEGIBLE->value => self::CODIGO_ILEGIBLE->label(),
            self::CODIGO_NO_REGISTRADO->value => self::CODIGO_NO_REGISTRADO->label(),
            self::BOLSA_SIN_ENTREGA->value => self::BOLSA_SIN_ENTREGA->label(),
            self::BOLSA_SIN_SERVICIO->value => self::BOLSA_SIN_SERVICIO->label(),
            self::DIFERENCIA_PESO->value => self::DIFERENCIA_PESO->label(),
            self::DOCUMENTACION_FALTANTE->value => self::DOCUMENTACION_FALTANTE->label(),

            self::BOLSA_DANADA->value => self::BOLSA_DANADA->label(),
            self::PESO_FUERA_DE_RANGO->value => self::PESO_FUERA_DE_RANGO->label(),

            self::OTRA->value => self::OTRA->label(),
        ];
    }
}

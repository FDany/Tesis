<?php

namespace Database\Seeders;

use App\Enums\EstadoBolsa;
use App\Models\Auditoria;
use Illuminate\Database\Seeder;

class AuditoriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Movimientos de bolsas con el mismo formato que AuditoriaService
     * (valor_anterior / valor_nuevo en JSON con los campos que cambiaron).
     */
    public function run(): void
    {
        $registros = [
            [1, 30, 2, '2026-11-22 09:00:00', 'ALTA RECEPCION',
                null,
                ['estado' => EstadoBolsa::RECIBIDA->value, 'remito_recepcion_id' => 5]],
            [2, 16, 2, '2026-11-10 10:00:00', 'Control recepción - Disponible',
                ['estado' => EstadoBolsa::RECIBIDA->value, 'remito_recepcion_id' => 3],
                ['estado' => EstadoBolsa::DISPONIBLE->value, 'remito_recepcion_id' => 3]],
            [3, 17, 2, '2026-11-11 08:00:00', 'ENTREGA A SERVICIO',
                ['estado' => EstadoBolsa::DISPONIBLE->value, 'remitos_serv_id' => null],
                ['estado' => EstadoBolsa::ENTREGADA_A_SERVICIO->value, 'remitos_serv_id' => 2]],
            [4, 19, 2, '2026-11-13 08:00:00', 'ENTREGA A SERVICIO',
                ['estado' => EstadoBolsa::DISPONIBLE->value, 'remitos_serv_id' => null],
                ['estado' => EstadoBolsa::ENTREGADA_A_SERVICIO->value, 'remitos_serv_id' => 4]],
            [5, 20, 4, '2026-11-21 18:00:00', 'Recepción en depósito',
                ['estado' => EstadoBolsa::ENTREGADA_A_SERVICIO->value, 'recep_dep_id' => null],
                ['estado' => EstadoBolsa::INGRESADA_AL_DEPOSITO->value, 'recep_dep_id' => 5]],
            [6, 21, 4, '2026-11-21 18:30:00', 'Pesaje en depósito',
                ['estado' => EstadoBolsa::INGRESADA_AL_DEPOSITO->value, 'peso' => null],
                ['estado' => EstadoBolsa::PESADA->value, 'peso' => 3.9]],
            [7, 23, 4, '2026-11-20 10:00:00', 'DESPACHO A RETIRO',
                ['estado' => EstadoBolsa::PESADA->value, 'rem_sal_id' => null],
                ['estado' => EstadoBolsa::DESPACHADA->value, 'rem_sal_id' => 4]],
            [8, 25, 4, '2026-11-14 15:00:00', 'RETIRO POR DGM',
                ['estado' => EstadoBolsa::DESPACHADA->value, 'rem_sal_id' => 6],
                ['estado' => EstadoBolsa::RETIRADA_POR_DGM->value, 'rem_sal_id' => 6]],
            [9, 26, 4, '2026-11-14 15:30:00', 'RETIRO POR DGM',
                ['estado' => EstadoBolsa::DESPACHADA->value, 'rem_sal_id' => 7],
                ['estado' => EstadoBolsa::RETIRADA_POR_DGM->value, 'rem_sal_id' => 7]],
            [10, 28, 4, '2026-11-16 10:00:00', 'Tratamiento / disposición final',
                ['estado' => EstadoBolsa::RETIRADA_POR_DGM->value],
                ['estado' => EstadoBolsa::TRATADA_DISPOSICION_FINAL->value, 'numero_manifiesto' => 3]],
        ];

        foreach ($registros as [$id, $bolsaId, $usuarioId, $fecha, $operacion, $anterior, $nuevo]) {
            Auditoria::firstOrCreate(
                ['id' => $id],
                [
                    'responsable_usuario_id' => $usuarioId,
                    'fecha_hora' => $fecha,
                    'operacion' => $operacion,
                    'bolsa_id' => $bolsaId,
                    'valor_anterior' => $anterior === null ? null : json_encode($anterior, JSON_UNESCAPED_UNICODE),
                    'valor_nuevo' => json_encode($nuevo, JSON_UNESCAPED_UNICODE),
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]
            );
        }
    }
}

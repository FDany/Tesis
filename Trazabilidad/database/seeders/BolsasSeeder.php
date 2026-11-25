<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bolsa;
use App\Enums\EstadoBolsa;

class BolsasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ------------------------------------------------------------------------
        // 1. Bolsas RETIRADAS POR DGM (Completaron la conciliación en remitos de salida)
        // ------------------------------------------------------------------------

        // Remito Interno RSI-2026-00001 (Despachada / Pendiente de retiro)
        Bolsa::firstOrCreate([
            'id' => 1,
            'codigo_barra' => '0001000000001',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::DESPACHADA->value,
            'peso' => 4.5,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-05 18:45',
            'recep_dep_id' => 1,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => 1,
            'created_at' => '2026-11-05 19:43:37',
            'updated_at' => '2026-11-05 19:43:37',
        ]);

        // Remito Interno RSI-2026-00002 (Retirada por DGM - Conciliado)
        Bolsa::firstOrCreate([
            'id' => 2,
            'codigo_barra' => '0001000000002',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::RETIRADA_POR_DGM->value,
            'peso' => 3.2,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-05 18:50:00',
            'recep_dep_id' => 1,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => 2,
            'created_at' => '2026-11-05 19:43:37',
            'updated_at' => '2026-11-05 19:43:37',
        ]);

        // Remito Interno RSI-2026-00003 (Retirada por DGM - Con Incidencia)
        Bolsa::firstOrCreate([
            'id' => 3,
            'codigo_barra' => '0001000000003',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::RETIRADA_POR_DGM->value,
            'peso' => 5.1,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-05 19:15:00',
            'recep_dep_id' => 2,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => 3,
            'created_at' => '2026-11-05 19:43:37',
            'updated_at' => '2026-11-05 19:43:37',
        ]);

        Bolsa::firstOrCreate([
            'id' => 4,
            'codigo_barra' => '0001000000004',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::RETIRADA_POR_DGM->value,
            'peso' => 2.8,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-05 19:15:00',
            'recep_dep_id' => 2,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => 3,
            'created_at' => '2026-11-05 20:11:00',
            'updated_at' => '2026-11-05 20:11:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 5,
            'codigo_barra' => '0001000000005',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::RETIRADA_POR_DGM->value,
            'peso' => 4.0,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-05 19:15:00',
            'recep_dep_id' => 2,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => 3,
            'created_at' => '2026-11-05 20:11:00',
            'updated_at' => '2026-11-05 20:11:00',
        ]);

        // ------------------------------------------------------------------------
        // 2. Bolsas PESADAS (Disponibles para escaneo en create.tsx)
        // ------------------------------------------------------------------------
        Bolsa::firstOrCreate([
            'id' => 6,
            'codigo_barra' => '0001000000006',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::PESADA->value,
            'peso' => 3.7,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-06 07:45:00',
            'recep_dep_id' => 3,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => null,
            'created_at' => '2026-11-06 08:15:00',
            'updated_at' => '2026-11-06 08:15:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 7,
            'codigo_barra' => '0001000000007',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::PESADA->value,
            'peso' => 6.0,
            'pesa_usuario_id' => 4,
            'fecha_pesaje' => '2026-11-06 07:45:00',
            'recep_dep_id' => 3,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'rem_sal_id' => null,
            'created_at' => '2026-11-06 08:15:00',
            'updated_at' => '2026-11-06 08:15:00',
        ]);

        // ------------------------------------------------------------------------
        // 3. Bolsas DISPONIBLES (Stock vacías en Depósito Central)
        // ------------------------------------------------------------------------
        Bolsa::firstOrCreate([
            'id' => 8,
            'codigo_barra' => '0001000000008',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::DISPONIBLE->value,
            'peso' => null,
            'rem_rep_id' => 1,
            'remitos_serv_id' => null,
            'recep_dep_id' => null,
            'rem_sal_id' => null,
            'created_at' => '2026-10-05 10:00:00',
            'updated_at' => '2026-10-05 10:00:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 9,
            'codigo_barra' => '0001000000009',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::DISPONIBLE->value,
            'peso' => null,
            'rem_rep_id' => 1,
            'remitos_serv_id' => null,
            'recep_dep_id' => null,
            'rem_sal_id' => null,
            'created_at' => '2026-10-05 10:00:00',
            'updated_at' => '2026-10-05 10:00:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 10,
            'codigo_barra' => '0001000000010',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => EstadoBolsa::DISPONIBLE->value,
            'peso' => null,
            'rem_rep_id' => 1,
            'remitos_serv_id' => null,
            'recep_dep_id' => null,
            'rem_sal_id' => null,
            'created_at' => '2026-10-05 10:00:00',
            'updated_at' => '2026-10-05 10:00:00',
        ]);

        // ------------------------------------------------------------------------
        // 4. Bolsas RECIBIDAS (Remito de recepción #2 pendiente de control)
        // ------------------------------------------------------------------------
        for ($i = 1; $i <= 5; $i++) {
            Bolsa::firstOrCreate([
                'id' => 10 + $i,
                'codigo_barra' => '0002' . str_pad((string) $i, 9, '0', STR_PAD_LEFT),
                'tipo_bolsa_id' => 1,
                'tamanio_id' => 1,
                'estado' => EstadoBolsa::RECIBIDA->value,
                'peso' => null,
                'rem_rep_id' => 2,
                'remitos_serv_id' => null,
                'recep_dep_id' => null,
                'rem_sal_id' => null,
                'created_at' => '2026-11-20 09:00:00',
                'updated_at' => '2026-11-20 09:00:00',
            ]);
        }

        // ------------------------------------------------------------------------
        // 5. Datos de prueba adicionales (bolsas 16-31), al menos una por estado.
        //    Prefijo del código = id del remito de recepción (0003, 0004, 0005, 0006).
        //    Remito recepción #3: tipo 1 / tamaño 1. #4: tipo 2 / tamaño 2.
        //    #5: tipo 3 / tamaño 3. #6: tipo 1 / tamaño 2.
        // ------------------------------------------------------------------------
        $tipoTamanioPorRemito = [
            3 => [1, 1],
            4 => [2, 2],
            5 => [3, 3],
            6 => [1, 2],
        ];

        $nuevasBolsas = [
            // DISPONIBLE: remito #3 conciliado el 10-11, aún sin entregar.
            ['id' => 16, 'codigo_barra' => '0003000000001', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::DISPONIBLE, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-10 10:00:00'],

            // ENTREGADA_A_SERVICIO: remitos de servicio #2, #3 y #4.
            ['id' => 17, 'codigo_barra' => '0003000000002', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::ENTREGADA_A_SERVICIO, 'remitos_serv_id' => 2, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-11 08:00:00'],
            ['id' => 18, 'codigo_barra' => '0004000000001', 'rem_rep_id' => 4, 'estado' => EstadoBolsa::ENTREGADA_A_SERVICIO, 'remitos_serv_id' => 3, 'created_at' => '2026-11-12 08:30:00', 'updated_at' => '2026-11-12 13:00:00'],
            ['id' => 19, 'codigo_barra' => '0003000000003', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::ENTREGADA_A_SERVICIO, 'remitos_serv_id' => 4, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-13 08:00:00'],

            // INGRESADA_AL_DEPOSITO: recepción en depósito #5, pendiente de pesaje.
            ['id' => 20, 'codigo_barra' => '0003000000004', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::INGRESADA_AL_DEPOSITO, 'remitos_serv_id' => 2, 'recep_dep_id' => 5, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-21 18:00:00'],

            // PESADA: recepción en depósito #5, con peso cargado.
            ['id' => 21, 'codigo_barra' => '0003000000005', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::PESADA, 'remitos_serv_id' => 2, 'recep_dep_id' => 5, 'peso' => 3.9, 'fecha_pesaje' => '2026-11-21 18:30:00', 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-21 18:30:00'],
            ['id' => 22, 'codigo_barra' => '0004000000002', 'rem_rep_id' => 4, 'estado' => EstadoBolsa::PESADA, 'remitos_serv_id' => 3, 'recep_dep_id' => 5, 'peso' => 2.1, 'fecha_pesaje' => '2026-11-21 18:40:00', 'created_at' => '2026-11-12 08:30:00', 'updated_at' => '2026-11-21 18:40:00'],

            // DESPACHADA: remitos de salida #4 y #5 (pendientes de retiro).
            ['id' => 23, 'codigo_barra' => '0003000000006', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::DESPACHADA, 'remitos_serv_id' => 2, 'recep_dep_id' => 4, 'peso' => 4.2, 'fecha_pesaje' => '2026-11-13 18:20:00', 'rem_sal_id' => 4, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-20 10:00:00'],
            ['id' => 24, 'codigo_barra' => '0004000000003', 'rem_rep_id' => 4, 'estado' => EstadoBolsa::DESPACHADA, 'remitos_serv_id' => 3, 'recep_dep_id' => 4, 'peso' => 1.8, 'fecha_pesaje' => '2026-11-13 18:25:00', 'rem_sal_id' => 5, 'created_at' => '2026-11-12 08:30:00', 'updated_at' => '2026-11-21 10:00:00'],

            // RETIRADA_POR_DGM: remitos de salida #6 (conciliado) y #7 (con incidencia).
            ['id' => 25, 'codigo_barra' => '0003000000007', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::RETIRADA_POR_DGM, 'remitos_serv_id' => 2, 'recep_dep_id' => 4, 'peso' => 5.0, 'fecha_pesaje' => '2026-11-13 18:30:00', 'rem_sal_id' => 6, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-14 15:00:00'],
            ['id' => 26, 'codigo_barra' => '0003000000008', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::RETIRADA_POR_DGM, 'remitos_serv_id' => 2, 'recep_dep_id' => 4, 'peso' => 3.3, 'fecha_pesaje' => '2026-11-13 18:35:00', 'rem_sal_id' => 7, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-14 15:30:00'],
            ['id' => 27, 'codigo_barra' => '0004000000004', 'rem_rep_id' => 4, 'estado' => EstadoBolsa::RETIRADA_POR_DGM, 'remitos_serv_id' => 3, 'recep_dep_id' => 4, 'peso' => 2.4, 'fecha_pesaje' => '2026-11-13 18:40:00', 'rem_sal_id' => 7, 'created_at' => '2026-11-12 08:30:00', 'updated_at' => '2026-11-14 15:30:00'],

            // TRATADA_DISPOSICION_FINAL: remitos de salida #8 y #9 (manifiestos N° 3 y 4).
            ['id' => 28, 'codigo_barra' => '0003000000009', 'rem_rep_id' => 3, 'estado' => EstadoBolsa::TRATADA_DISPOSICION_FINAL, 'remitos_serv_id' => 2, 'recep_dep_id' => 4, 'peso' => 4.6, 'fecha_pesaje' => '2026-11-13 18:45:00', 'rem_sal_id' => 8, 'created_at' => '2026-11-10 08:00:00', 'updated_at' => '2026-11-16 10:00:00'],
            ['id' => 29, 'codigo_barra' => '0004000000005', 'rem_rep_id' => 4, 'estado' => EstadoBolsa::TRATADA_DISPOSICION_FINAL, 'remitos_serv_id' => 3, 'recep_dep_id' => 4, 'peso' => 2.7, 'fecha_pesaje' => '2026-11-13 18:50:00', 'rem_sal_id' => 9, 'created_at' => '2026-11-12 08:30:00', 'updated_at' => '2026-11-16 11:00:00'],

            // RECIBIDA: remitos de recepción #5 y #6 (pendientes de control).
            ['id' => 30, 'codigo_barra' => '0005000000001', 'rem_rep_id' => 5, 'estado' => EstadoBolsa::RECIBIDA, 'created_at' => '2026-11-22 09:00:00', 'updated_at' => '2026-11-22 09:00:00'],
            ['id' => 31, 'codigo_barra' => '0006000000001', 'rem_rep_id' => 6, 'estado' => EstadoBolsa::RECIBIDA, 'created_at' => '2026-11-23 09:30:00', 'updated_at' => '2026-11-23 09:30:00'],
        ];

        foreach ($nuevasBolsas as $datos) {
            [$tipoBolsaId, $tamanioId] = $tipoTamanioPorRemito[$datos['rem_rep_id']];
            $pesada = isset($datos['peso']);

            Bolsa::firstOrCreate(
                ['id' => $datos['id']],
                [
                    'codigo_barra' => $datos['codigo_barra'],
                    'tipo_bolsa_id' => $tipoBolsaId,
                    'tamanio_id' => $tamanioId,
                    'estado' => $datos['estado']->value,
                    'peso' => $datos['peso'] ?? null,
                    'pesa_usuario_id' => $pesada ? 4 : null,
                    'fecha_pesaje' => $datos['fecha_pesaje'] ?? null,
                    'rem_rep_id' => $datos['rem_rep_id'],
                    'remitos_serv_id' => $datos['remitos_serv_id'] ?? null,
                    'recep_dep_id' => $datos['recep_dep_id'] ?? null,
                    'rem_sal_id' => $datos['rem_sal_id'] ?? null,
                    'created_at' => $datos['created_at'],
                    'updated_at' => $datos['updated_at'],
                ]
            );
        }
    }
}

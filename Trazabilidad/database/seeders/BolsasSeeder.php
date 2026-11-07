<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bolsa;

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
            'estado' => 'DESPACHADA',
            'peso' => 4.5,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
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
            'estado' => 'RETIRADA POR DGM',
            'peso' => 3.2,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
            'rem_sal_id' => 2,
            'created_at' => '2026-11-05 19:43:51',
            'updated_at' => '2026-11-05 19:43:51',
        ]);

        // Remito Interno RSI-2026-00003 (Retirada por DGM - Con Incidencia)
        Bolsa::firstOrCreate([
            'id' => 3,
            'codigo_barra' => '0001000000003',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => 'RETIRADA POR DGM',
            'peso' => 5.1,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
            'rem_sal_id' => 3,
            'created_at' => '2026-11-05 20:10:00',
            'updated_at' => '2026-11-05 20:10:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 4,
            'codigo_barra' => '0001000000004',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => 'RETIRADA POR DGM',
            'peso' => 2.8,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
            'rem_sal_id' => 3,
            'created_at' => '2026-11-05 20:11:00',
            'updated_at' => '2026-11-05 20:11:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 5,
            'codigo_barra' => '0001000000005',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => 'RETIRADA POR DGM',
            'peso' => 3.9,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
            'rem_sal_id' => 3,
            'created_at' => '2026-11-05 20:12:00',
            'updated_at' => '2026-11-05 20:12:00',
        ]);

        // ------------------------------------------------------------------------
        // 2. Bolsas PESADAS (Disponibles para escaneo en create.tsx)
        // ------------------------------------------------------------------------
        Bolsa::firstOrCreate([
            'id' => 6,
            'codigo_barra' => '0001000000006',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => 'PESADA',
            'peso' => 4.1,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
            'rem_sal_id' => null,
            'created_at' => '2026-11-06 08:00:00',
            'updated_at' => '2026-11-06 08:00:00',
        ]);

        Bolsa::firstOrCreate([
            'id' => 7,
            'codigo_barra' => '0001000000007',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'estado' => 'PESADA',
            'peso' => 6.0,
            'rem_rep_id' => 1,
            'remitos_serv_id' => 1,
            'recep_dep_id' => null,
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
            'estado' => 'DISPONIBLE',
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
            'estado' => 'DISPONIBLE',
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
            'estado' => 'DISPONIBLE',
            'peso' => null,
            'rem_rep_id' => 1,
            'remitos_serv_id' => null,
            'recep_dep_id' => null,
            'rem_sal_id' => null,
            'created_at' => '2026-10-05 10:00:00',
            'updated_at' => '2026-10-05 10:00:00',
        ]);
    }
}

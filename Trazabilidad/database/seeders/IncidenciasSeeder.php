<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Incidencia;

class IncidenciasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Incidencia::firstOrCreate([
            'id' => 1,
            'fecha_hora' => '2026-11-06 01:18:00',
            'usuario_registra' => 1,
            'rem_sal_id' => 3, // Apunta al remito RSI-2026-00003
            'tipo_incidencia' => 'DISCREPANCIA_CONCILIACION_DGM',
            'descripcion' => 'Discrepancia en remito interno RSI-2026-00003 (DGM N° 0001-00000002): El sistema registró 3 bolsas vs. 2 declaradas por DGM. Diferencia: 1 bolsa(s).',
            'estado' => 'ABIERTA',
            'created_at' => '2026-11-06 01:18:00',
            'updated_at' => '2026-11-06 01:18:00',
        ]);
    }
}

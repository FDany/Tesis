<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            'fecha_hora' => "2026-11-05 22:19:35",
            'usuario_registra' => 1,
            'rem_sal_id' => 2,
            'tipo_incidencia' => "DISCREPANCIA_CONCILIACION_DGM",
            'descripcion' => "Discrepancia en remito N° 0001-00000002: El sistema registró 1 bolsas vs. 3 declaradas por DGM. Diferencia: -2.",
            'estado' => 'ABIERTA',
            'created_at' => "2026-11-05 22:19:35",
            'updated_at' => "2026-11-05 22:19:35",
        ]);
    }
}

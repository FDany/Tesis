<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RemitoSalidaRetiro;

class RemitosSalidaRetiroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RemitoSalidaRetiro::firstOrCreate([
            'id' => 1,
            'numero_remito' => '0001-00000001',
            'fecha_retiro' => "2026-11-06 01:17:00",
            'cantidad_bolsas_declaradas_Empresa' => 1,
            'responsable_empresa' => 'Juan Gomez',
            'usuario_despacha_id' => 1,
            'created_at' => "2026-11-05 22:18:19",
            'updated_at' => "2026-11-05 22:18:19",
        ]);
        RemitoSalidaRetiro::firstOrCreate([
            'id' => 2,
            'numero_remito' => '0001-00000002',
            'fecha_retiro' => "2026-11-06 01:18:00",
            'cantidad_bolsas_declaradas_Empresa' => 1,
            'responsable_empresa' => 'Daniel Perez',
            'usuario_despacha_id' => 1,
            'created_at' => "2026-11-05 22:19:35",
            'updated_at' => "2026-11-05 22:19:35",
        ]);
    }
}

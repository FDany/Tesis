<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RemitoSalidaRetiro;

class RemitosSalidaRetiroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Remito Pendiente de Retiro DGM (1 bolsa asignada en BolsasSeeder)
        RemitoSalidaRetiro::firstOrCreate([
            'id' => 1,
            'numero_remito_interno' => 'RSI-2026-00001',
            'fecha_emision' => '2026-11-05 10:00:00',
            'cantidad_bolsas_sistema' => 1,
            'usuario_despacha_id' => 1,
            'estado' => 'PENDIENTE_RETIRO',
            'numero_remito' => null,
            'fecha_retiro' => null,
            'cantidad_bolsas_declaradas_Empresa' => null,
            'responsable_empresa' => null,
            'datos_transporte' => null,
            'observaciones' => 'Residuos agrupados en depósito central a la espera del camión DGM.',
            'created_at' => '2026-11-05 10:00:00',
            'updated_at' => '2026-11-05 10:00:00',
        ]);

        // 2. Remito Conciliado Exitosamente (1 bolsa asignada)
        RemitoSalidaRetiro::firstOrCreate([
            'id' => 2,
            'numero_remito_interno' => 'RSI-2026-00002',
            'fecha_emision' => '2026-11-05 20:00:00',
            'cantidad_bolsas_sistema' => 1,
            'usuario_despacha_id' => 1,
            'estado' => 'CONCILIADO',
            'numero_remito' => '0001-00000001',
            'fecha_retiro' => '2026-11-06 01:17:00',
            'cantidad_bolsas_declaradas_Empresa' => 1,
            'responsable_empresa' => 'Juan Gomez',
            'datos_transporte' => 'Patente AB 123 CD - Transporte San Bernardo',
            'observaciones' => 'Retiro efectuado sin observaciones.',
            'created_at' => '2026-11-05 22:18:19',
            'updated_at' => '2026-11-06 01:17:00',
        ]);

        // 3. Remito Con Incidencia por Discrepancia (3 bolsas sistema vs 2 declaradas DGM)
        RemitoSalidaRetiro::firstOrCreate([
            'id' => 3,
            'numero_remito_interno' => 'RSI-2026-00003',
            'fecha_emision' => '2026-11-05 21:00:00',
            'cantidad_bolsas_sistema' => 3,
            'usuario_despacha_id' => 1,
            'estado' => 'CON_INCIDENCIA',
            'numero_remito' => '0001-00000002',
            'fecha_retiro' => '2026-11-06 01:18:00',
            'cantidad_bolsas_declaradas_Empresa' => 2,
            'responsable_empresa' => 'Daniel Perez',
            'datos_transporte' => 'Patente XY 987 ZW',
            'observaciones' => 'El chofer declaró una bolsa menos respecto al remito interno.',
            'created_at' => '2026-11-05 22:19:35',
            'updated_at' => '2026-11-06 01:18:00',
        ]);
    }
}

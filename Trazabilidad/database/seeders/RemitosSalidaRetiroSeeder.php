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
            'usuario_despacha_id' => 4,
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
            'usuario_despacha_id' => 4,
            'estado' => 'CONCILIADO',
            'numero_remito' => '0001-00000001',
            'fecha_retiro' => '2026-11-06 01:17:00',
            'cantidad_bolsas_declaradas_Empresa' => 1,
            'responsable_empresa' => 'Juan Gomez',
            'datos_transporte' => 'Patente AB 123 CD - Transporte San Bernardo',
            'observaciones' => 'Retiro efectuado sin observaciones.',
            'created_at' => '2026-11-05 20:00:00',
            'updated_at' => '2026-11-06 01:17:00',
        ]);

        // 3. Remito Con Incidencia por Discrepancia (3 bolsas sistema vs 2 declaradas DGM)
        RemitoSalidaRetiro::firstOrCreate([
            'id' => 3,
            'numero_remito_interno' => 'RSI-2026-00003',
            'fecha_emision' => '2026-11-05 21:00:00',
            'cantidad_bolsas_sistema' => 3,
            'usuario_despacha_id' => 4,
            'estado' => 'CON_INCIDENCIA',
            'numero_remito' => '0001-00000002',
            'fecha_retiro' => '2026-11-06 01:18:00',
            'cantidad_bolsas_declaradas_Empresa' => 2,
            'responsable_empresa' => 'Daniel Perez',
            'datos_transporte' => 'Patente XY 987 ZW',
            'observaciones' => 'El chofer declaró una bolsa menos respecto al remito interno.',
            'created_at' => '2026-11-05 21:00:00',
            'updated_at' => '2026-11-06 01:18:00',
        ]);

        // ------------------------------------------------------------------------
        // Datos de prueba adicionales
        // ------------------------------------------------------------------------

        // 4. Pendiente de retiro DGM: bolsa 23 (DESPACHADA)
        RemitoSalidaRetiro::firstOrCreate(
            ['id' => 4],
            [
                'numero_remito_interno' => 'RSI-2026-00004',
                'fecha_emision' => '2026-11-20 10:00:00',
                'cantidad_bolsas_sistema' => 1,
                'usuario_despacha_id' => 4,
                'estado' => 'PENDIENTE_RETIRO',
                'observaciones' => 'Bolsa de Laboratorio a la espera del camión DGM.',
                'created_at' => '2026-11-20 10:00:00',
                'updated_at' => '2026-11-20 10:00:00',
            ]
        );

        // 5. Pendiente de retiro DGM: bolsa 24 (DESPACHADA)
        RemitoSalidaRetiro::firstOrCreate(
            ['id' => 5],
            [
                'numero_remito_interno' => 'RSI-2026-00005',
                'fecha_emision' => '2026-11-21 10:00:00',
                'cantidad_bolsas_sistema' => 1,
                'usuario_despacha_id' => 4,
                'estado' => 'PENDIENTE_RETIRO',
                'observaciones' => 'Residuos químicos agrupados en depósito central.',
                'created_at' => '2026-11-21 10:00:00',
                'updated_at' => '2026-11-21 10:00:00',
            ]
        );

        // 6. Conciliado sin diferencias: bolsa 25 (RETIRADA_POR_DGM)
        RemitoSalidaRetiro::firstOrCreate(
            ['id' => 6],
            [
                'numero_remito_interno' => 'RSI-2026-00006',
                'fecha_emision' => '2026-11-14 09:00:00',
                'cantidad_bolsas_sistema' => 1,
                'usuario_despacha_id' => 4,
                'estado' => 'CONCILIADO',
                'numero_remito' => '0001-00000003',
                'fecha_retiro' => '2026-11-14 15:00:00',
                'cantidad_bolsas_declaradas_Empresa' => 1,
                'responsable_empresa' => 'Juan Gomez',
                'datos_transporte' => 'Patente AB 123 CD - Transporte San Bernardo',
                'observaciones' => 'Retiro efectuado sin observaciones.',
                'created_at' => '2026-11-14 09:00:00',
                'updated_at' => '2026-11-14 15:00:00',
            ]
        );

        // 7. Con incidencia: 2 bolsas en sistema (26 y 27) vs 1 declarada por DGM
        RemitoSalidaRetiro::firstOrCreate(
            ['id' => 7],
            [
                'numero_remito_interno' => 'RSI-2026-00007',
                'fecha_emision' => '2026-11-14 10:00:00',
                'cantidad_bolsas_sistema' => 2,
                'usuario_despacha_id' => 4,
                'estado' => 'CON_INCIDENCIA',
                'numero_remito' => '0001-00000004',
                'fecha_retiro' => '2026-11-14 15:30:00',
                'cantidad_bolsas_declaradas_Empresa' => 1,
                'responsable_empresa' => 'Daniel Perez',
                'datos_transporte' => 'Patente XY 987 ZW',
                'observaciones' => 'El chofer declaró una bolsa menos respecto al remito interno.',
                'created_at' => '2026-11-14 10:00:00',
                'updated_at' => '2026-11-14 15:30:00',
            ]
        );

        // 8. Conciliado -> FINALIZADO por el manifiesto N° 3: bolsa 28 (TRATADA_DISPOSICION_FINAL)
        RemitoSalidaRetiro::firstOrCreate(
            ['id' => 8],
            [
                'numero_remito_interno' => 'RSI-2026-00008',
                'fecha_emision' => '2026-11-14 11:00:00',
                'cantidad_bolsas_sistema' => 1,
                'usuario_despacha_id' => 4,
                'estado' => 'CONCILIADO',
                'numero_remito' => '0001-00000005',
                'fecha_retiro' => '2026-11-14 16:00:00',
                'cantidad_bolsas_declaradas_Empresa' => 1,
                'responsable_empresa' => 'Juan Gomez',
                'datos_transporte' => 'Patente AB 123 CD - Transporte San Bernardo',
                'observaciones' => 'Retiro efectuado sin observaciones.',
                'created_at' => '2026-11-14 11:00:00',
                'updated_at' => '2026-11-14 16:00:00',
            ]
        );

        // 9. Conciliado -> FINALIZADO por el manifiesto N° 4: bolsa 29 (TRATADA_DISPOSICION_FINAL)
        RemitoSalidaRetiro::firstOrCreate(
            ['id' => 9],
            [
                'numero_remito_interno' => 'RSI-2026-00009',
                'fecha_emision' => '2026-11-14 12:00:00',
                'cantidad_bolsas_sistema' => 1,
                'usuario_despacha_id' => 4,
                'estado' => 'CONCILIADO',
                'numero_remito' => '0001-00000006',
                'fecha_retiro' => '2026-11-14 16:30:00',
                'cantidad_bolsas_declaradas_Empresa' => 1,
                'responsable_empresa' => 'Martín Sosa',
                'datos_transporte' => 'Patente AC 456 EF',
                'observaciones' => 'Retiro de residuos químicos.',
                'created_at' => '2026-11-14 12:00:00',
                'updated_at' => '2026-11-14 16:30:00',
            ]
        );
    }
}

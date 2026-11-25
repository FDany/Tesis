<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Incidencia;
use App\Enums\TipoIncidencia;

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
            'tipo_incidencia' => TipoIncidencia::DIFERENCIA_CONCILIACION_DGM->value,
            'descripcion' => 'Discrepancia en remito interno RSI-2026-00003 (DGM N° 0001-00000002): El sistema registró 3 bolsas vs. 2 declaradas por DGM. Diferencia: 1 bolsa(s).',
            'estado' => 'ABIERTA',
            'created_at' => '2026-11-06 01:18:00',
            'updated_at' => '2026-11-06 01:18:00',
        ]);

        // ------------------------------------------------------------------------
        // Datos de prueba adicionales
        // ------------------------------------------------------------------------

        // 2. Discrepancia automática al conciliar RSI-2026-00007 (2 bolsas sistema vs 1 DGM).
        Incidencia::firstOrCreate(
            ['id' => 2],
            [
                'fecha_hora' => '2026-11-14 15:30:00',
                'usuario_registra' => 4,
                'rem_sal_id' => 7,
                'tipo_incidencia' => TipoIncidencia::DIFERENCIA_CONCILIACION_DGM->value,
                'descripcion' => 'Discrepancia en remito interno RSI-2026-00007 (DGM N° 0001-00000004): El sistema registró 2 bolsas vs. 1 declaradas por DGM. Diferencia: 1 bolsa(s).',
                'estado' => 'ABIERTA',
                'created_at' => '2026-11-14 15:30:00',
                'updated_at' => '2026-11-14 15:30:00',
            ]
        );

        // 3. Diferencia de peso en la bolsa 22 (PESADA), ya resuelta.
        Incidencia::firstOrCreate(
            ['id' => 3],
            [
                'fecha_hora' => '2026-11-21 18:45:00',
                'usuario_registra' => 4,
                'bolsa_id' => 22,
                'tipo_bolsa_id' => 2,
                'servicio_id' => 15,
                'tipo_incidencia' => TipoIncidencia::DIFERENCIA_PESO->value,
                'descripcion' => 'La bolsa 0004000000002 registró 2.1 kg en el pesaje; el servicio informó aproximadamente 2.6 kg.',
                'accion_adoptada' => 'Se recalibró la balanza del depósito y se verificó nuevamente el peso (2.1 kg). Se toma como válido el peso del sistema.',
                'usuario_cierra' => 1,
                'fecha_resolucion' => '2026-11-22 09:30:00',
                'estado' => 'RESUELTA',
                'created_at' => '2026-11-21 18:45:00',
                'updated_at' => '2026-11-22 09:30:00',
            ]
        );

        // 4. Código ilegible en la bolsa 19 (ENTREGADA_A_SERVICIO en Pediatría), abierta.
        Incidencia::firstOrCreate(
            ['id' => 4],
            [
                'fecha_hora' => '2026-11-14 11:00:00',
                'usuario_registra' => 3,
                'bolsa_id' => 19,
                'tipo_bolsa_id' => 1,
                'servicio_id' => 8,
                'tipo_incidencia' => TipoIncidencia::CODIGO_ILEGIBLE->value,
                'descripcion' => 'La etiqueta de la bolsa 0003000000003 se encuentra deteriorada y el lector no logra escanearla.',
                'estado' => 'ABIERTA',
                'created_at' => '2026-11-14 11:00:00',
                'updated_at' => '2026-11-14 11:00:00',
            ]
        );

        // 5. Documentación faltante en el remito de recepción #4 (CONCILIADO), resuelta.
        Incidencia::firstOrCreate(
            ['id' => 5],
            [
                'fecha_hora' => '2026-11-12 11:15:00',
                'usuario_registra' => 2,
                'rem_rep_id' => 4,
                'tipo_bolsa_id' => 2,
                'tipo_incidencia' => TipoIncidencia::DOCUMENTACION_FALTANTE->value,
                'descripcion' => 'El remito de recepción #4 se registró sin la copia firmada del proveedor.',
                'accion_adoptada' => 'El proveedor envió la copia digital firmada y se archivó junto al remito.',
                'usuario_cierra' => 1,
                'fecha_resolucion' => '2026-11-13 09:00:00',
                'estado' => 'RESUELTA',
                'created_at' => '2026-11-12 11:15:00',
                'updated_at' => '2026-11-13 09:00:00',
            ]
        );
    }
}

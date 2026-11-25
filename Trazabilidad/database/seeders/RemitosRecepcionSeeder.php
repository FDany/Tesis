<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RemitoRecepcion;

class RemitosRecepcionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RemitoRecepcion::firstOrCreate([
            'id' => 1,
            'fecha_recepcion' => '2026-10-05 10:00:00',
            'recep_usuario_id' => 2,
            'codigo_inicio' => '1-1',
            'codigo_fin' => '1-10',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'cantidad_declarada' => 10,
            // Sus bolsas ya fueron controladas (DISPONIBLE o estados posteriores).
            'estado' => 'CONCILIADO',
            'control_usuario_id' => 2,
            'fecha_control' => '2026-10-05 11:00:00',
        ]);

        // Remito pendiente de control: sus bolsas quedan RECIBIDA (ver BolsasSeeder).
        RemitoRecepcion::firstOrCreate([
            'id' => 2,
            'fecha_recepcion' => '2026-11-20 09:00:00',
            'recep_usuario_id' => 2,
            'codigo_inicio' => '2-1',
            'codigo_fin' => '2-5',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'cantidad_declarada' => 5,
            'estado' => 'PENDIENTE_CONTROL',
        ]);

        // ------------------------------------------------------------------------
        // Datos de prueba adicionales
        // ------------------------------------------------------------------------

        // #3 Conciliado: origen de las bolsas 16-17, 19-21, 23, 25-26 y 28 (prefijo 0003).
        RemitoRecepcion::firstOrCreate(
            ['id' => 3],
            [
                'fecha_recepcion' => '2026-11-10 08:00:00',
                'recep_usuario_id' => 2,
                'observaciones' => 'Entrega mensual de bolsas rojas grandes.',
                'codigo_inicio' => '3-1',
                'codigo_fin' => '3-9',
                'tipo_bolsa_id' => 1,
                'tamanio_id' => 1,
                'cantidad_declarada' => 9,
                'estado' => RemitoRecepcion::ESTADO_CONCILIADO,
                'control_usuario_id' => 2,
                'fecha_control' => '2026-11-10 10:00:00',
                'created_at' => '2026-11-10 08:00:00',
                'updated_at' => '2026-11-10 10:00:00',
            ]
        );

        // #4 Conciliado: origen de las bolsas 18, 22, 24, 27 y 29 (prefijo 0004).
        RemitoRecepcion::firstOrCreate(
            ['id' => 4],
            [
                'fecha_recepcion' => '2026-11-12 08:30:00',
                'recep_usuario_id' => 2,
                'observaciones' => 'Bolsas amarillas pequeñas para residuos químicos.',
                'codigo_inicio' => '4-1',
                'codigo_fin' => '4-5',
                'tipo_bolsa_id' => 2,
                'tamanio_id' => 2,
                'cantidad_declarada' => 5,
                'estado' => RemitoRecepcion::ESTADO_CONCILIADO,
                'control_usuario_id' => 1,
                'fecha_control' => '2026-11-12 11:00:00',
                'created_at' => '2026-11-12 08:30:00',
                'updated_at' => '2026-11-12 11:00:00',
            ]
        );

        // #5 Pendiente de control: bolsa 30 queda RECIBIDA (prefijo 0005).
        RemitoRecepcion::firstOrCreate(
            ['id' => 5],
            [
                'fecha_recepcion' => '2026-11-22 09:00:00',
                'recep_usuario_id' => 2,
                'codigo_inicio' => '5-1',
                'codigo_fin' => '5-1',
                'tipo_bolsa_id' => 3,
                'tamanio_id' => 3,
                'cantidad_declarada' => 1,
                'estado' => RemitoRecepcion::ESTADO_PENDIENTE_CONTROL,
                'created_at' => '2026-11-22 09:00:00',
                'updated_at' => '2026-11-22 09:00:00',
            ]
        );

        // #6 Pendiente de control: bolsa 31 queda RECIBIDA (prefijo 0006).
        RemitoRecepcion::firstOrCreate(
            ['id' => 6],
            [
                'fecha_recepcion' => '2026-11-23 09:30:00',
                'recep_usuario_id' => 2,
                'codigo_inicio' => '6-1',
                'codigo_fin' => '6-1',
                'tipo_bolsa_id' => 1,
                'tamanio_id' => 2,
                'cantidad_declarada' => 1,
                'estado' => RemitoRecepcion::ESTADO_PENDIENTE_CONTROL,
                'created_at' => '2026-11-23 09:30:00',
                'updated_at' => '2026-11-23 09:30:00',
            ]
        );
    }
}

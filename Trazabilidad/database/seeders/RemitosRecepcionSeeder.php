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
    }
}

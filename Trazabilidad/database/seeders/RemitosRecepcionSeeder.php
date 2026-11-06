<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            'fecha_recepcion' => "2026-10-05 10:00:00",
            'recep_usuario_id' => 1,
            'codigo_inicio' => '1-1',
            'codigo_fin' => '1-2',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'cantidad_declarada' => 1,
        ]);
    }
}

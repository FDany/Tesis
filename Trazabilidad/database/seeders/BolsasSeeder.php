<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Bolsa;

class BolsasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bolsa::firstOrCreate([
            'id' => 1,
            'codigo_barra' => '0001000000001',
            'tamanio_id' => 1,
            'tipo_bolsa_id' => 1,
            'estado' => 'pesada',
            'peso' => 4.5,
            'rem_rep_id' => 1,
            'rem_sal_id' => 1,
            'updated_at' => "2026-11-05 19:43:37",
            'created_at' => "2026-11-05 19:43:37",
        ]);
        Bolsa::firstOrCreate([
            'id' => 2,
            'codigo_barra' => '0001000000002',
            'tamanio_id' => 1,
            'tipo_bolsa_id' => 1,
            'estado' => 'pesada',
            'peso' => 3.2,
            'rem_rep_id' => 1,
            'rem_sal_id' => 2,
            'updated_at' => "2026-11-05 19:43:51",
            'created_at' => "2026-11-05 19:43:51",
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\RecepcionDeposito;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecepcionDepositoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tanda 1: bolsas que luego salieron en remitos 1 y 2  
        RecepcionDeposito::firstOrCreate([  
            'id' => 1,  
            'fecha_hora' => '2026-11-05 18:30:00',  
            'recibe_usuario_id' => 4, // usuario deposito  
        ]);  
  
        // Tanda 2: bolsas que salieron en el remito 3 (con incidencia)  
        RecepcionDeposito::firstOrCreate([  
            'id' => 2,  
            'fecha_hora' => '2026-11-05 19:00:00',  
            'recibe_usuario_id' => 4,  
        ]);  
  
        // Tanda 3: bolsas pesadas el 06-11, aún en depósito  
        RecepcionDeposito::firstOrCreate([  
            'id' => 3,  
            'fecha_hora' => '2026-11-06 07:30:00',  
            'recibe_usuario_id' => 4,  
        ]);

        // Tanda 4: bolsas de los remitos de servicio #2 y #3 que luego salieron en los remitos 4-9
        RecepcionDeposito::firstOrCreate(
            ['id' => 4],
            [
                'fecha_hora' => '2026-11-13 18:00:00',
                'recibe_usuario_id' => 4,
                'created_at' => '2026-11-13 18:00:00',
                'updated_at' => '2026-11-13 18:00:00',
            ]
        );

        // Tanda 5: bolsas 20-22, aún en depósito (INGRESADA_AL_DEPOSITO / PESADA)
        RecepcionDeposito::firstOrCreate(
            ['id' => 5],
            [
                'fecha_hora' => '2026-11-21 18:00:00',
                'recibe_usuario_id' => 4,
                'created_at' => '2026-11-21 18:00:00',
                'updated_at' => '2026-11-21 18:00:00',
            ]
        );
    }
}

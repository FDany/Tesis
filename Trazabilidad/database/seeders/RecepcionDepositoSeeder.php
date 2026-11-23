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
            'recibe_usuario_id' => 3, // usuario deposito  
        ]);  
  
        // Tanda 2: bolsas que salieron en el remito 3 (con incidencia)  
        RecepcionDeposito::firstOrCreate([  
            'id' => 2,  
            'fecha_hora' => '2026-11-05 19:00:00',  
            'recibe_usuario_id' => 3,  
        ]);  
  
        // Tanda 3: bolsas pesadas el 06-11, aún en depósito  
        RecepcionDeposito::firstOrCreate([  
            'id' => 3,  
            'fecha_hora' => '2026-11-06 07:30:00',  
            'recibe_usuario_id' => 3,  
        ]);  
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoBolsa;

class TiposBolsaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TipoBolsa::firstOrCreate([
            'id' => 1,
            'tipo_residuo' => 'Residuos Biocontaminados',
            'color' => '#FF0000',
            'proveedor' => 'DGM',
        ]);
        TipoBolsa::firstOrCreate([
            'id' => 2,
            'tipo_residuo' => 'Residuos Quimicos',
            'color' => '#FFFF00',
            'proveedor' => 'DGM',
        ]);

        // Nuevo flujo: residuos comunes reciclables (verde claro).
        TipoBolsa::firstOrCreate(
            ['id' => 3],
            [
                'tipo_residuo' => 'Residuos Comunes Reciclables',
                'color' => '#86EFAC',
                'proveedor' => 'DGM',
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tamanio;

class TamaniosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tamanio::firstOrCreate([
            'id' => 1,
            'nombre' => 'Grande',
        ]);
        Tamanio::firstOrCreate([
            'id' => 2,
            'nombre' => 'Pequeño',
        ]);
        Tamanio::firstOrCreate([
            'id' => 3,
            'nombre' => 'Unico',
        ]);
    }
}

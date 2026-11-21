<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServiciosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Servicio::firstOrCreate([
            'id' => 1,
            'nombre' => 'Fonoaudiologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 2,
            'nombre' => 'Hematologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 3,
            'nombre' => 'Laboratorio',
        ]);
        Servicio::firstOrCreate([
            'id' => 4,
            'nombre' => 'Nutricion',
        ]);
        Servicio::firstOrCreate([
            'id' => 5,
            'nombre' => 'Neurologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 6,
            'nombre' => 'Odontologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 7,
            'nombre' => 'Oftalmologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 8,
            'nombre' => 'Pediatria',
        ]);
        Servicio::firstOrCreate([
            'id' => 9,
            'nombre' => 'Psicologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 10,
            'nombre' => 'Psiquiatria',
        ]);
        Servicio::firstOrCreate([
            'id' => 11,
            'nombre' => 'Rehabilitacion',
        ]);
        Servicio::firstOrCreate([
            'id' => 12,
            'nombre' => 'Otorrinolaringologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 13,
            'nombre' => 'Traumatologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 14,
            'nombre' => 'Urologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 15,
            'nombre' => 'Clinica Medica',
        ]);
        Servicio::firstOrCreate([
            'id' => 16,
            'nombre' => 'Dermatologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 17,
            'nombre' => 'Gastroenterologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 18,
            'nombre' => 'Ginecologia',
        ]);
        Servicio::firstOrCreate([
            'id' => 19,
            'nombre' => 'Cirugia General',
        ]);
    }
}

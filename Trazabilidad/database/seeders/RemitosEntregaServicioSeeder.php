<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RemitoEntregaServicio;

class RemitosEntregaServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RemitoEntregaServicio::firstOrCreate([
            'id' => 1,
            'entrega_usuario_id' => 1,
            'retira_nombre' => 'María López',
            'entregado_cargo' => 'Enfermera Jefa de Guardia',
            'fecha_entrega' => '2026-11-02 09:00:00',
            'servicio_id' => 1,
            'cantidad_bolsas_dadas' => 7,
            'created_at' => '2026-11-02 09:00:00',
            'updated_at' => '2026-11-02 09:00:00',
        ]);
    }
}

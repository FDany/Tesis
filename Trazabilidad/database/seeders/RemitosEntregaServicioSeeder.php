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
            'entrega_usuario_id' => 2,
            'retira_nombre' => 'María López',
            'entregado_cargo' => 'Enfermera Jefa de Guardia',
            'fecha_entrega' => '2026-11-02 09:00:00',
            'servicio_id' => 1,
            'cantidad_bolsas_dadas' => 7,
            'created_at' => '2026-11-02 09:00:00',
            'updated_at' => '2026-11-02 09:00:00',
        ]);

        // ------------------------------------------------------------------------
        // Datos de prueba adicionales
        // ------------------------------------------------------------------------

        // #2 Laboratorio: bolsas 17 (sigue ENTREGADA_A_SERVICIO), 20, 21, 23, 25, 26 y 28.
        RemitoEntregaServicio::firstOrCreate(
            ['id' => 2],
            [
                'entrega_usuario_id' => 2,
                'retira_nombre' => 'Carlos Méndez',
                'entregado_cargo' => 'Técnico de Laboratorio',
                'fecha_entrega' => '2026-11-11 08:00:00',
                'servicio_id' => 3,
                'cantidad_bolsas_dadas' => 7,
                'created_at' => '2026-11-11 08:00:00',
                'updated_at' => '2026-11-11 08:00:00',
            ]
        );

        // #3 Clínica Médica: bolsas 18 (sigue ENTREGADA_A_SERVICIO), 22, 24, 27 y 29.
        RemitoEntregaServicio::firstOrCreate(
            ['id' => 3],
            [
                'entrega_usuario_id' => 2,
                'retira_nombre' => 'Laura Fernández',
                'entregado_cargo' => 'Enfermera de Piso',
                'fecha_entrega' => '2026-11-12 13:00:00',
                'servicio_id' => 15,
                'cantidad_bolsas_dadas' => 5,
                'created_at' => '2026-11-12 13:00:00',
                'updated_at' => '2026-11-12 13:00:00',
            ]
        );

        // #4 Pediatría: bolsa 19 (ENTREGADA_A_SERVICIO).
        RemitoEntregaServicio::firstOrCreate(
            ['id' => 4],
            [
                'entrega_usuario_id' => 2,
                'retira_nombre' => 'Sofía Ramírez',
                'entregado_cargo' => 'Jefa de Enfermería Pediátrica',
                'fecha_entrega' => '2026-11-13 08:00:00',
                'servicio_id' => 8,
                'cantidad_bolsas_dadas' => 1,
                'created_at' => '2026-11-13 08:00:00',
                'updated_at' => '2026-11-13 08:00:00',
            ]
        );
    }
}

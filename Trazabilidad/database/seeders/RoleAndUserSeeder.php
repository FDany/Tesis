<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RoleAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // 1. Crear Roles si no existen
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        $recepcionRole = Role::firstOrCreate([
            'name' => 'recepcion',
            'guard_name' => 'web',
        ]);

        // 2. Crear Usuario Administrador de Prueba
        $admin = User::firstOrCreate(
            ['dni' => '12345678'], // DNI para probar en Login
            [
                'first_name' => 'Administrador',
                'last_name' => 'Sistema',
                'email' => 'admin@ecogestion.com',
                'password' => '12345678', // Contraseña
            ]
        );

         // 3. Crear un Recepcionista de Prueba
        $recepcionista = User::firstOrCreate(
            ['dni' => '87654321'],
            [
                'first_name' => 'Recepcionista',
                'last_name' => 'Sistema',
                'email' => 'recepcionista@ecogestion.com',
                'password' => '87654321',
            ]
        );

        // 3. Asignar Roles de Spatie
        $admin->assignRole($adminRole);
        $recepcionista->assignRole($recepcionRole);
    }
}

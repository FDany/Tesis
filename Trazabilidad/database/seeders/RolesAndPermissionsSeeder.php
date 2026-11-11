<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        //Crear Permisos
        Permission::create(['name' => 'ver dashboard']);
        Permission::create(['name' => 'listar usuarios']);
        Permission::create(['name' => 'crear usuarios']);
        Permission::create(['name' => 'editar usuarios']);
        Permission::create(['name' => 'eliminar usuarios']);
        Permission::create(['name' => 'listar roles']);
        Permission::create(['name' => 'crear roles']);
        Permission::create(['name' => 'editar roles']);
        Permission::create(['name' => 'eliminar roles']);
        Permission::create(['name' => 'listar permisos']);
        Permission::create(['name' => 'listar tamBolsas']);
        Permission::create(['name' => 'crear tamBolsas']);
        Permission::create(['name' => 'editar tamBolsas']);
        Permission::create(['name' => 'eliminar tamBolsas']);
        Permission::create(['name' => 'listar servicios']);
        Permission::create(['name' => 'crear servicios']);
        Permission::create(['name' => 'editar servicios']);
        Permission::create(['name' => 'eliminar servicios']);
        Permission::create(['name' => 'listar flujosResiduos']);
        Permission::create(['name' => 'crear flujosResiduos']);
        Permission::create(['name' => 'editar flujosResiduos']);
        Permission::create(['name' => 'eliminar flujosResiduos']);
        Permission::create(['name' => 'listar remitosRecepcion']);
        Permission::create(['name' => 'crear remitosRecepcion']);
        Permission::create(['name' => 'ver detalleRemitoRecepcion']);
        Permission::create(['name' => 'listar remitosSalida']);
        Permission::create(['name' => 'crear remitosSalida']);
        Permission::create(['name' => 'ver detalleRemitoSalida']);
        Permission::create(['name' => 'imprimirPDF remitoSalida']);
        Permission::create(['name' => 'listar bolsas']);
        Permission::create(['name' => 'crear bolsas']);
        Permission::create(['name' => 'ver detalleBolsa']);
        Permission::create(['name' => 'listar incidencias']);
        Permission::create(['name' => 'crear incidencias']);
        Permission::create(['name' => 'ver detalleIncidencia']);
        Permission::create(['name' => 'resolver incidencias']);
        Permission::create(['name' => 'generar remitoRecepcion']);
        Permission::create(['name' => 'registrar entregaBolsasServicio']);

        //Crear Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'admin',]);
        $adminRole = Role::firstOrCreate(['name' => 'admin-prueba',]);
        $recepcionRole = Role::firstOrCreate(['name' => 'recepcion',]);
        $depositoRole = Role::firstOrCreate(['name' => 'deposito',]);

        //Asignar permisos a los roles
        // Super Admin obtiene absolutamente todos los permisos
        $superAdminRole->givePermissionTo(Permission::all());

        // Admin obtiene todos los permisos excepto los de editar y eliminar
        $permisosAdmin = Permission::where('name', 'not like', '%editar%')
            ->where('name', 'not like', '%eliminar%')
            ->get();
        $adminRole->syncPermissions($permisosAdmin);

        $recepcionRole->givePermissionTo([
            'ver dashboard',
            'listar tamBolsas', 'crear tamBolsas', 'editar tamBolsas',
            'listar remitosRecepcion', 'crear remitosRecepcion', 'ver detalleRemitoRecepcion', 'generar remitoRecepcion',
            'listar flujosResiduos', 'crear flujosResiduos', 'editar flujosResiduos',
            'listar bolsas', 'crear bolsas', 'ver detalleBolsa',
            'registrar entregaBolsasServicio',
        ]);
        $depositoRole->givePermissionTo([
            'ver dashboard',
            'listar bolsas', 'ver detalleBolsa',
            'listar remitosSalida', 'crear remitosSalida', 'ver detalleRemitoSalida', 'imprimirPDF remitoSalida',
        ]);

        //Crear Usuarios y asignar roles
        User::firstOrCreate(
            ['dni' => '12345678'], // DNI para probar en Login
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'email' => 'superadmin@example.com',
                'password' => bcrypt('12345678'),
            ]
        )->assignRole($superAdminRole);

        User::firstOrCreate(
            ['dni' => '87654321'],
            [
                'first_name' => 'Admin',
                'last_name' => 'Sistema',
                'email' => 'admin@example.com',
                'password' => bcrypt('87654321'),
            ]
        )->assignRole($adminRole);

        User::firstOrCreate(
            ['dni' => '11111111'],
            [
                'first_name' => 'Recepcionista',
                'last_name' => 'Sistema',
                'email' => 'recepcionista@example.com',
                'password' => bcrypt('11111111'),
            ]
        )->assignRole($recepcionRole);

        User::firstOrCreate(
            ['dni' => '22222222'],
            [
                'first_name' => 'Deposito',
                'last_name' => 'Sistema',
                'email' => 'deposito@example.com',
                'password' => bcrypt('22222222'),
            ]
        )->assignRole($depositoRole);
    }
}

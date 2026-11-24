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

        // Crear Permisos
        $permissions = [
            // Dashboard
            'ver dashboard',

            // Usuarios, Roles y Permisos
            'listar usuarios',
            'crear usuarios',
            'editar usuarios',
            'eliminar usuarios',

            'listar roles',
            'crear roles',
            'editar roles',
            'eliminar roles',

            'listar permisos',
            'crear permisos',
            'editar permisos',
            'eliminar permisos',

            // Catálogos
            'listar tamBolsas',
            'crear tamBolsas',
            'editar tamBolsas',
            'eliminar tamBolsas',

            'listar flujosResiduos',
            'crear flujosResiduos',
            'editar flujosResiduos',
            'eliminar flujosResiduos',

            'listar servicios',
            'crear servicios',
            'editar servicios',
            'eliminar servicios',

            // Remitos de Recepción (Insumos)
            'listar remitosRecepcion',
            'crear remitosRecepcion',
            'verDetalle remitosRecepcion',
            'enviarPDFxCorreo remitosRecepcion',
            'descargarPDF remitosRecepcion',

            // Bolsas
            'listar bolsas',
            'crear bolsas',
            'verDetalle bolsas',
            'descargarExcel bolsas',

            // Remitos de Entrega a Servicio
            'listar remitosEntregaServicio',
            'crear remitosEntregaServicio',
            'descargarPDF remitosEntregaServicio',

            // Depósito de Residuos
            // 'registrarRecepcionBolsa Deposito',
            // 'registrarPesoBolsa Deposito',
            'gestionar deposito',

            // Remitos de Salida y Conciliación DGM
            'listar remitosSalida',
            'crear remitosSalida',
            'verDetalle remitosSalida',
            'descargarPDF remitosSalida',
            'conciliar remitosSalida',
            'anular remitosSalida',

            // Manifiestos Finales (Disposición Final)
            'listar manifiestosFinales',
            'crear manifiestosFinales',
            'verDetalle manifiestosFinales',
            'descargarDocumento manifiestosFinales',

            // Incidencias
            'listar incidencias',
            'crear incidencias',
            'verDetalle incidencias',
            'resolver incidencias',

            //Reportes
            'ver reportes',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // 1. ADMINISTRADOR
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        // 2. RECEPCIÓN / DEPÓSITO DE INSUMOS
        $recepcionInsumosRole = Role::firstOrCreate(['name' => 'recepcion-insumos', 'guard_name' => 'web']);
        $recepcionInsumosRole->syncPermissions([
            'ver dashboard',
            'listar tamBolsas', 'crear tamBolsas', 'editar tamBolsas',
            'listar flujosResiduos', 'crear flujosResiduos', 'editar flujosResiduos',
            'listar servicios',
            'listar remitosRecepcion', 'crear remitosRecepcion', 'verDetalle remitosRecepcion',
            'enviarPDFxCorreo remitosRecepcion', 'descargarPDF remitosRecepcion',
            'listar bolsas', 'crear bolsas', 'verDetalle bolsas', 'descargarExcel bolsas',
            'listar remitosEntregaServicio', 'crear remitosEntregaServicio', 'descargarPDF remitosEntregaServicio',
            'listar incidencias', 'crear incidencias', 'verDetalle incidencias',
        ]);

        // 3. SERVICIOS
        $serviciosRole = Role::firstOrCreate(['name' => 'servicios', 'guard_name' => 'web']);
        $serviciosRole->syncPermissions([
            'ver dashboard',
            'listar bolsas', 'verDetalle bolsas',
            'listar remitosEntregaServicio', 'descargarPDF remitosEntregaServicio',
            'listar incidencias', 'crear incidencias', 'verDetalle incidencias',
        ]);

        // 4. DEPÓSITO DE RESIDUOS
        $depositoResiduosRole = Role::firstOrCreate(['name' => 'deposito-residuos', 'guard_name' => 'web']);
        $depositoResiduosRole->syncPermissions([
            'ver dashboard',
            'listar bolsas', 'verDetalle bolsas', 'descargarExcel bolsas',
            'gestionar deposito',
            'listar remitosSalida', 'crear remitosSalida', 'verDetalle remitosSalida',
            'descargarPDF remitosSalida', 'conciliar remitosSalida', 'anular remitosSalida',
            'listar manifiestosFinales', 'crear manifiestosFinales', 'verDetalle manifiestosFinales', 'descargarDocumento manifiestosFinales',
            'listar incidencias', 'crear incidencias', 'verDetalle incidencias', 'resolver incidencias',
        ]);

        // 5. ÁREA AMBIENTAL
        $areaAmbientalRole = Role::firstOrCreate(['name' => 'area-ambiental', 'guard_name' => 'web']);
        $areaAmbientalRole->syncPermissions([
            'ver dashboard',
            'listar tamBolsas', 'listar flujosResiduos', 'listar servicios',
            'listar bolsas', 'verDetalle bolsas', 'descargarExcel bolsas',
            'listar remitosRecepcion', 'verDetalle remitosRecepcion', 'descargarPDF remitosRecepcion',
            'listar remitosEntregaServicio', 'descargarPDF remitosEntregaServicio',
            'listar remitosSalida', 'verDetalle remitosSalida', 'descargarPDF remitosSalida',
            'listar manifiestosFinales', 'verDetalle manifiestosFinales', 'descargarDocumento manifiestosFinales',
            'listar incidencias', 'verDetalle incidencias', 'resolver incidencias',
        ]);

        // 6. ADMINISTRACIÓN
        $administracionRole = Role::firstOrCreate(['name' => 'administracion', 'guard_name' => 'web']);
        $administracionRole->syncPermissions([
            'ver dashboard',
            'listar bolsas', 'verDetalle bolsas', 'descargarExcel bolsas',
            'listar remitosRecepcion', 'verDetalle remitosRecepcion', 'descargarPDF remitosRecepcion',
            'listar remitosEntregaServicio', 'descargarPDF remitosEntregaServicio',
            'listar remitosSalida', 'verDetalle remitosSalida', 'descargarPDF remitosSalida',
            'listar manifiestosFinales', 'verDetalle manifiestosFinales', 'descargarDocumento manifiestosFinales',
            'listar incidencias', 'verDetalle incidencias',
        ]);

        // Crear Usuarios y asignar roles
        // Usuarios de prueba por perfil
        $usuariosPrueba = [
            [
                'dni' => '12345678',
                'first_name' => 'Admin',
                'last_name' => 'General',
                'email' => 'admin@ecogestion.local',
                'role' => $adminRole,
            ],
            [
                'dni' => '11111111',
                'first_name' => 'Recepción',
                'last_name' => 'Insumos',
                'email' => 'recepcion@ecogestion.local',
                'role' => $recepcionInsumosRole,
            ],
            [
                'dni' => '22222222',
                'first_name' => 'Personal',
                'last_name' => 'Servicios',
                'email' => 'servicios@ecogestion.local',
                'role' => $serviciosRole,
            ],
            [
                'dni' => '33333333',
                'first_name' => 'Depósito',
                'last_name' => 'Residuos',
                'email' => 'deposito@ecogestion.local',
                'role' => $depositoResiduosRole,
            ],
            [
                'dni' => '44444444',
                'first_name' => 'Área',
                'last_name' => 'Ambiental',
                'email' => 'ambiental@ecogestion.local',
                'role' => $areaAmbientalRole,
            ],
            [
                'dni' => '55555555',
                'first_name' => 'Personal',
                'last_name' => 'Administración',
                'email' => 'administracion@ecogestion.local',
                'role' => $administracionRole,
            ],
        ];

        foreach ($usuariosPrueba as $data) {
            $user = User::firstOrCreate(
                ['dni' => $data['dni']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'email' => $data['email'],
                    'password' => $data['dni'],
                    'must_change_password' => false,
                ]
            );

            $user->syncRoles([$data['role']]);
        }
    }
}

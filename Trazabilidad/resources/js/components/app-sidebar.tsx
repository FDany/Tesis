import { Link, usePage } from '@inertiajs/react';

import {
    BarChart3,
    LayoutDashboard,
    Plus,
    Settings,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { useAuth } from '@/hooks/use-auth';

type AppNavItem = NavItem & {
    adminOnly?: boolean;
};

const navItems: AppNavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        permission: 'ver dashboard',
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: Users,
        permission: 'listar usuarios',
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: ShieldCheck,
        permission: 'listar roles',
    },
    {
        title: 'Permisos',
        href: '/permisos',
        icon: ShieldCheck,
        permission: 'listar permisos',
    },
    {
        title: 'Tamaños de Bolsa',
        href: '/tamanios',
        icon: Trash2,
        permission: 'listar tamBolsas',
    },
    {
        title: 'Flujos de Residuos',
        href: '/tipos-bolsa',
        icon: Trash2,
        permission: 'listar flujosResiduos',
    },
    {
        title: 'Remitos de Recepción',
        href: '/remitos-recepcion',
        icon: LayoutDashboard,
        permission: 'listar remitosRecepcion',
    },
    {
        title: 'Bolsas',
        href: '/bolsas',
        icon: Trash2,
        permission: 'listar bolsas',
    },
    {
        title: 'Servicios',
        href: '/servicios',
        icon: LayoutDashboard,
        permission: 'listar servicios',
    },
    {
        title: 'Remitos de Servicios',
        href: '/remitos-entrega-servicio',
        icon: Trash2,
        permission: 'listar remitosEntregaServicio',
    },
    {
        title: 'Recepción Depósito',
        href: '/recepciones-deposito',
        icon: Trash2,
        permission: 'registrarRecepcionBolsa Deposito',
    },
    {
        title: 'Pesaje Depósito',
        href: '/pesaje-deposito',
        icon: Trash2,
        permission: 'registrarPesoBolsa Deposito',
    },
    {
        title: 'Remitos de Salida',
        href: '/remitos-salida',
        icon: LayoutDashboard,
        permission: 'listar remitosSalida',
    },
    {
        title: 'Incidencias',
        href: '/incidencias',
        icon: LayoutDashboard,
        permission: 'listar incidencias',
    },
    /*{
        title: 'Nueva Carga',
        href: '/bolsas/create',
        icon: Plus,
        permission: 'crear bolsas',
    },
    /*{
        title: 'Crear Remito de Recepción',
        href: '/remitos-recepcion/create',
        icon: Plus,
        permission: 'crear remitosRecepcion',
    },*/
    {
        title: 'Reportes',
        href: '/reportes',
        icon: BarChart3,
    },
    {
        title: 'Configuración',
        href: '/configuracion',
        icon: Settings,
        adminOnly: true,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { can } = useAuth();

    const filteredNavItems = navItems.filter((item) => {
        // Si el ítem no tiene la propiedad 'permission', se muestra a todos.
        // Si la tiene, evalúa si el usuario tiene el permiso asignado en Spatie (o es super-admin).
        return !item.permission || can(item.permission);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

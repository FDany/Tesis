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
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: Users,
        adminOnly: true,
        permission: 'listar usuarios',

    },
    {
        title: 'Roles',
        href: '/roles',
        icon: ShieldCheck,
        permission: 'listar roles',
        adminOnly: true,
    },
    {
        title: 'Permisos',
        href: '/permisos',
        icon: ShieldCheck,
        permission: 'listar permisos',
        adminOnly: true,
    },
    {
        title: 'Tamaños de bolsa',
        href: '/tamanios',
        icon: Trash2,
        permission: 'listar tamBolsas',
    },
    {
        title: 'Tipos de residuos',
        href: '/tipos-bolsa',
        icon: Trash2,
        permission: 'listar flujosResiduos',
    },
    {
        title: 'Remitos de recepción',
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
        title: 'Remitos de servicios',
        href: '/remitos-entrega-servicio',
        icon: Trash2,
        permission: 'registrar entregaBolsasServicio',
    },
    {
        title: 'Recepción Depósito',
        href: '/recepciones-deposito',
        icon: Trash2,
        permission: 'listar bolsas',
    },
    {
        title: 'Pesaje Depósito',
        href: '/pesaje-deposito',
        icon: Trash2,
        permission: 'listar bolsas',
    },
    {
        title: 'Remitos de salida',
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

    const { canManageAdministration } = usePage<{
        canManageAdministration: boolean;
    }>().props;

    const { can } = useAuth();



    const mainNavItems = navItems.filter(
        (item) => !item.adminOnly || canManageAdministration,
    );
    const filteredNavItems = mainNavItems.filter((item) => {
        // Si el ítem no tiene la propiedad 'permission', se muestra a todos (ej:Dashboard).
        // Si la tiene, evalúa si el usuario tiene el permiso asignado en Spatie.
        return !item.permission || can(item.permission);
    })

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

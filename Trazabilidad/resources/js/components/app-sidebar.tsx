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
        title: 'Tamaños de bolsa',
        href: '/tamanios',
        icon: Trash2,
        permission: 'listar tamBolsas',
    },
    {
        title: 'Gestión de Servicios',
        href: '/servicios',
        icon: LayoutDashboard,
        permission: 'listar servicios',
    },
    // Agrega estos enlaces cuando existan sus rutas Laravel y páginas Inertia.
    {
        title: 'Gestión de Tipos de Residuos',
        href: '/tipos-bolsa',
        icon: Trash2,
        permission: 'listar flujosResiduos',
    },
    {
        title: 'Gestión de Remitos de Recepción',
        href: '/remitos-recepcion',
        icon: LayoutDashboard,
        permission: 'listar remitosRecepcion',
    },
    {
        title: 'Crear Remito de Recepción',
        href: '/remitos-recepcion/create',
        icon: Plus,
    },
    {
        title: 'Remitos de recepción',
        href: '/remitos-recepcion',
        icon: LayoutDashboard,
        permission: 'listar remitosSalida',
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
        permission: 'listar incidencias',
    },
    {
        title: 'Entrega a servicios',
        href: '/residuos',
        icon: Trash2,
        permission: 'registrar entregaBolsasServicio',
    },
    {
        title: 'Recepción Depósito',
        href: '/recepciones-deposito',
        icon: Trash2,
    },
    {
        title: 'Pesaje Depósito',
        href: '/pesaje-deposito',
        icon: Trash2,
    },
    {
        title: 'Remitos de salida',
        href: '/remitos-salida',
        icon: LayoutDashboard,
    },
    {
        title: 'Incidencias',
        href: '/incidencias',
        icon: LayoutDashboard,
    },
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

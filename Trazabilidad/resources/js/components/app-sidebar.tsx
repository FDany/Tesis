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

type AppNavItem = NavItem & {
    adminOnly?: boolean;
};

const navItems: AppNavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Usuarios',
        href: '/users',
        icon: Users,
        adminOnly: true,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: ShieldCheck,
        adminOnly: true,
    },

    // Agrega estos enlaces cuando existan sus rutas Laravel y páginas Inertia.
    {
        title: 'Gestión de Tipos de Residuos',
        href: '/tipos-bolsa',
        icon: Trash2,
    },
    {
        title: 'Gestión de Remitos de Recepción',
        href: '/remitos-recepcion',
        icon: LayoutDashboard,
    },
    {
        title: 'Gestión de Residuos',
        href: '/residuos',
        icon: Trash2,
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

    {
        title: 'Nueva Carga',
        href: '/bolsas/create',
        icon: Plus,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { canManageAdministration } = usePage<{
        canManageAdministration: boolean;
    }>().props;

    const mainNavItems = navItems.filter(
        (item) => !item.adminOnly || canManageAdministration,
    );

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

import { Link } from '@inertiajs/react';

import {
    AlertTriangle,
    BarChart3,
    Building2,
    ClipboardCheck,
    FileCheck2,
    KeyRound,
    LayoutDashboard,
    Package,
    PackageCheck,
    Recycle,
    Ruler,
    Scale,
    ScanBarcode,
    Send,
    Settings,
    ShieldCheck,
    Truck,
    Users,
    ClipboardList
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
        icon: KeyRound,
        permission: 'listar permisos',
    },
    {
        title: 'Tamaños de Bolsa',
        href: '/tamanios',
        icon: Ruler,
        permission: 'listar tamBolsas',
    },
    {
        title: 'Flujos de Residuos',
        href: '/tipos-bolsa',
        icon: Recycle,
        permission: 'listar flujosResiduos',
    },
    {
        title: 'Remitos de Recepción',
        href: '/remitos-recepcion',
        icon: ClipboardCheck,
        permission: 'listar remitosRecepcion',
    },
    {
        title: 'Control Recepción',
        href: '/control-recepcion',
        icon: ScanBarcode,
        permission: 'controlar remitosRecepcion',
    },
    {
        title: 'Bolsas',
        href: '/bolsas',
        icon: Package,
        permission: 'listar bolsas',
    },
    {
        title: 'Servicios',
        href: '/servicios',
        icon: Building2,
        permission: 'listar servicios',
    },
    {
        title: 'Remitos de Servicios',
        href: '/remitos-entrega-servicio',
        icon: Send,
        permission: 'listar remitosEntregaServicio',
    },
    {
        title: 'Depósito',
        href: '/deposito',
        icon: PackageCheck,
        permission: 'gestionar deposito',
    },
    {
        title: 'Remitos de Salida',
        href: '/remitos-salida',
        icon: Truck,
        permission: 'listar remitosSalida',
    },
    {
        title: 'Incidencias',
        href: '/incidencias',
        icon: AlertTriangle,
        permission: 'listar incidencias',
    },
    {
        title: 'Manifiestos Finales',
        href: '/manifiestos-finales',
        icon: FileCheck2,
        permission: 'listar manifiestosFinales',
    },
    {
        title: 'Reportes',
        href: '/reportes',
        icon: BarChart3,
        permission: 'ver reportes'
    },
    {
        title: 'Auditorias',
        href: '/auditorias',
        icon: ClipboardList,
        permission: 'listar auditorias'
    },
    // {
    //     title: 'Configuración',
    //     href: '/configuracion',
    //     icon: Settings,
    //     adminOnly: true,
    // },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { can } = useAuth();

    const filteredNavItems = navItems.filter((item) => {
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

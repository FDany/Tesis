// import { Head } from '@inertiajs/react';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import { dashboard } from '@/routes';

import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Trash2, TrendingUp } from 'lucide-react';
import type { Auth } from '@/types';

type DashboardProps = {
    auth: Auth;
};

const exampleMetrics = {
    collectedTons: 1248,
    activeRoutes: 18,
    totalRoutes: 20,
    pendingAlerts: 3,
    fullContainers: 12,
};

export default function Dashboard({ auth }: DashboardProps) {
    const user = auth.user;
    const fullName = `${user.first_name} ${user.last_name}`;
    const roles = user.roles?.map((role) => role.name).join(', ') || 'Sin rol';

    return (
        <>
            <Head title="Panel principal" />

            <div className="space-y-6 p-4">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Panel principal
                    </h1>
                    <p className="text-muted-foreground">
                        Bienvenido, <strong>{fullName}</strong>. Rol: {roles}.
                    </p>
                </header>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Residuos recolectados"
                        value={`${exampleMetrics.collectedTons.toLocaleString()} TN`}
                        icon={<Trash2 />}
                        detail={
                            <span className="flex items-center gap-1 text-emerald-600">
                                <TrendingUp className="h-3 w-3" />
                                +12% este mes
                            </span>
                        }
                    />
                    <MetricCard
                        title="Rutas activas"
                        value={`${exampleMetrics.activeRoutes} / ${exampleMetrics.totalRoutes}`}
                        icon={<CheckCircle2 />}
                        detail={
                            <span className="text-muted-foreground">
                                Operación al 90%
                            </span>
                        }
                    />
                    <MetricCard
                        title="Alertas pendientes"
                        value={exampleMetrics.pendingAlerts.toLocaleString()}
                        icon={<AlertTriangle />}
                        detail={
                            <span className="text-amber-600">
                                Requieren atención
                            </span>
                        }
                    />
                    <MetricCard
                        title="Contenedores llenos"
                        value={exampleMetrics.fullContainers.toLocaleString()}
                        icon={<TrendingUp />}
                        detail={
                            <span className="text-destructive">
                                Capacidad &gt; 85%
                            </span>
                        }
                    />
                </div>
            </div>
        </>
    );
}

function MetricCard({
    title,
    value,
    icon,
    detail,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    detail: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-medium text-muted-foreground">
                    {title}
                </span>
                {icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="mt-1 text-xs">{detail}</div>
        </section>
    );
}

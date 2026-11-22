import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, RefreshCw } from 'lucide-react';
import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';
import type { FiltrosDashboard as FiltrosDashboardType } from '../types/dashboard';
import type { Servicio } from '@/features/servicios/types/servicio';

interface Props {
    filtros: FiltrosDashboardType;
    servicios?: Servicio[];
}

export function FiltrosDashboard({ filtros, servicios = [] }: Props) {
    const valores = {
        fecha_inicio: filtros.fecha_inicio ?? '',
        fecha_fin: filtros.fecha_fin ?? '',
        servicio_id: filtros.servicio_id?.toString() ?? '',
    };

    const campos: CampoFiltro[] = [
        {
            key: 'fecha_inicio',
            label: 'Fecha Desde',
            type: 'date',
        },
        {
            key: 'fecha_fin',
            label: 'Fecha Hasta',
            type: 'date',
        },
    ];

    if (servicios.length > 0) {
        campos.push({
            key: 'servicio_id',
            label: 'Servicio Origen',
            type: 'select',
            options: [
                { value: 'TODOS', label: 'Todos los Servicios' },
                ...servicios.map((servicio) => ({
                    value: String(servicio.id),
                    label: servicio.nombre,
                })),
            ],
        });
    }

    const handleFiltroChange = (key: string, value: string) => {
        const valor =
            key === 'servicio_id'
                ? value === 'TODOS'
                    ? undefined
                    : Number(value)
                : value || undefined;

        router.get(
            '/dashboard',
            { ...filtros, [key]: valor },
            { preserveState: true, replace: true },
        );
    };

    const handleLimpiarFiltros = () => {
        router.get('/dashboard', {}, { preserveState: true, replace: true });
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="flex items-center gap-2 text-muted-foreground md:self-start">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">
                            Filtros del Panel
                        </span>
                    </div>

                    <div className="max-w-3xl flex-1">
                        <FiltroGenerico
                            campos={campos}
                            valores={valores}
                            onChange={handleFiltroChange}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLimpiarFiltros}
                        className="h-9 gap-1.5 self-end"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Limpiar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
import { Head, router, Link } from '@inertiajs/react';
import CantFilas from '@/components/CantFilas';
import Paginacion, {
    type PaginacionData,
} from '@/components/Paginador';
import { RemitoEntregaServicioTable } from '@/features/remitos-entrega-servicio/components/RemitoEntregaServicioTable';
import type { RemitoEntregaServicio } from '@/features/remitos-entrega-servicio/types/remitoEntregaServicio';
import { useState, type FormEvent } from 'react';
import { RemitoEntregaServicioFiltros } from '@/features/remitos-entrega-servicio/components/RemitoEntregaServicioFiltros';
import type { Servicio } from '@/features/servicios';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth'

interface Props {
    remitos: PaginacionData & { data: RemitoEntregaServicio[] };
    porPagina: number;
    opcionesPorPagina: number[];
    servicios: Array<Pick<Servicio, 'id' | 'nombre'>>;
    filtros: {
        buscar: string;
        retira_nombre: string;
        servicio_id: string;
    };
}

export default function RemitosEntregaServicioIndex({
    remitos,
    porPagina,
    opcionesPorPagina,
    servicios,
    filtros
}: Props) {

    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [retiraNombre, setRetiraNombre] = useState(filtros.retira_nombre ?? '');
    const [servicioId, setServicioId] = useState(filtros.servicio_id ?? '');

    const visitarListado = (
        cambios: Partial<{
            buscar: string;
            retira_nombre: string;
            servicio_id: string;
            por_pagina: number;
        }> = {},
    ) => {
        router.get(
            '/remitos-entrega-servicio',
            {
                buscar,
                retira_nombre: retiraNombre,
                servicio_id: servicioId,
                por_pagina: porPagina,
                ...cambios,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const aplicarBusqueda = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visitarListado();
    };

    const cambiarFiltro = (key: string, value: string) => {
        if (key === 'buscar') {
            setBuscar(value);
            return;
        }

        if (key === 'retira_nombre') {
            setRetiraNombre(value);
            return;
        }

        if (key === 'servicio_id') {
            const nuevoServicioId = value === 'TODOS' ? '' : value;
            setServicioId(nuevoServicioId);
            visitarListado({ servicio_id: nuevoServicioId });
        }
    };

    const handlePorPaginaChange = (cantidad: number) => {
        visitarListado({ por_pagina: cantidad });
    };

    const { can } = useAuth();

    return (
        <>
            <Head title="Remitos de Entrega a Servicios" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Remitos de Entrega a Servicios
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Historial de bolsas entregadas a los servicios.
                        </p>
                    </div>
                    {(can('crear remitosEntregaServicio')) && (
                        <Button asChild>
                            <Link href="/remitos-entrega-servicio/create">
                                <Plus className="size-4" />
                                Nueva Entrega a Servicio
                            </Link>
                        </Button>)}
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                    <form onSubmit={aplicarBusqueda} className="min-w-0 flex-1">
                        <RemitoEntregaServicioFiltros
                            valores={{
                                buscar,
                                retira_nombre: retiraNombre,
                                servicio_id: servicioId,
                            }}
                            servicios={servicios}
                            onChange={cambiarFiltro}
                        />
                        <button type="submit" className="sr-only">
                            Buscar remito
                        </button>
                    </form>

                    <div className="flex justify-start lg:justify-end lg:-translate-y-1.5">
                        <CantFilas
                            value={porPagina}
                            options={opcionesPorPagina}
                            onChange={handlePorPaginaChange}
                        />
                    </div>
                </div>

                <RemitoEntregaServicioTable data={remitos.data} />
                <Paginacion pagination={remitos} />
            </div>
        </>
    );
}

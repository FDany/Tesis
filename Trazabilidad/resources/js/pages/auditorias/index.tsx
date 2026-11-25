import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CantFilas from '@/components/CantFilas';
import Paginacion, { type PaginacionData } from '@/components/Paginador';
import { AuditoriaFiltros } from '../../features/auditorias/components/AuditoriaFiltros';
import {
    AuditoriaTabla,
    type CampoOrdenAuditoria,
} from '../../features/auditorias/components/AuditoriaTabla';
import type {
    Auditoria,
    AuditoriaFiltros as FiltrosTipo,
} from '../../features/auditorias/types/auditoria';

interface PaginatedAuditorias extends PaginacionData {
    data: Auditoria[];
}

interface ResponsableOption {
    id: number;
    first_name: string;
    last_name: string;
}

interface AuditoriasPageProps {
    auditorias: PaginatedAuditorias;
    filtros: FiltrosTipo;
    operacionesDisponibles: string[];
    responsables: ResponsableOption[];
    porPagina: number;
    opcionesPorPagina: number[];
    sort: string;
    direction: 'asc' | 'desc';
}

export default function AuditoriasIndex({
    auditorias,
    filtros,
    operacionesDisponibles,
    responsables,
    porPagina,
    opcionesPorPagina,
    sort,
    direction,
}: AuditoriasPageProps) {
    const [formFiltros, setFormFiltros] = useState<FiltrosTipo>(filtros);

    const navegarConParametros = (overrides: Record<string, string | number | undefined>) => {
        router.get(
            '/auditorias',
            {
                codigo_barra: formFiltros.codigo_barra || undefined,
                operacion: formFiltros.operacion || undefined,
                responsable_id: formFiltros.responsable_id || undefined,
                fecha_desde: formFiltros.fecha_desde || undefined,
                fecha_hasta: formFiltros.fecha_hasta || undefined,
                por_pagina: porPagina,
                sort,
                direction,
                ...overrides,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleBuscar = (e: React.FormEvent) => {
        e.preventDefault();
        navegarConParametros({ page: 1 });
    };

    const handleLimpiar = () => {
        const limpios: FiltrosTipo = {
            codigo_barra: '',
            operacion: '',
            responsable_id: '',
            fecha_desde: '',
            fecha_hasta: '',
        };
        setFormFiltros(limpios);
        router.get(
            '/auditorias',
            {
                por_pagina: porPagina,
                sort: 'fecha_hora',
                direction: 'desc',
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleCambiarFilas = (nuevaCantidad: number) => {
        navegarConParametros({
            por_pagina: nuevaCantidad,
            page: 1,
        });
    };

    const handleOrdenar = (campo: CampoOrdenAuditoria) => {
        const nuevaDireccion = sort === campo && direction === 'asc' ? 'desc' : 'asc';
        navegarConParametros({
            sort: campo,
            direction: nuevaDireccion,
            page: 1,
        });
    };

    return (
        <>
            <Head title="Auditorías" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Auditorías</h1>
                        <p className="text-sm text-muted-foreground">
                            Historial de operaciones y cambios registrados sobre bolsas.
                        </p>
                    </div>

                    <CantFilas
                        value={porPagina}
                        options={opcionesPorPagina}
                        onChange={handleCambiarFilas}
                        total={auditorias.total}
                    />
                </div>

                <AuditoriaFiltros
                    filtros={formFiltros}
                    operacionesDisponibles={operacionesDisponibles}
                    responsables={responsables}
                    onChange={setFormFiltros}
                    onSubmit={handleBuscar}
                    onLimpiar={handleLimpiar}
                />

                <div className="overflow-hidden rounded-md border">
                    <AuditoriaTabla
                        auditorias={auditorias.data}
                        ordenActual={sort}
                        direccionActual={direction}
                        onOrdenar={handleOrdenar}
                    />

                    <Paginacion pagination={auditorias} />
                </div>
            </div>
        </>
    );
}

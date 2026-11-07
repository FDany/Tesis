// resources/js/pages/incidencias/index.tsx

import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IncidenciaBadge } from '@/features/incidencias/components/IncidenciaBadge';
import { IncidenciaFiltros } from '@/features/incidencias/components/IncidenciaFiltros';
import { ResolverIncidenciaModal } from '@/features/incidencias/components/ResolverIncidenciaModal';
import { IncidenciaTabla } from '@/features/incidencias/components/IncidenciaTabla';
import { CheckSquare, Eye, AlertCircle, Plus, Building2, Package, FileText } from 'lucide-react';
import type { Incidencia } from '@/features/incidencias/types/incidencia';
import type { User } from '@/types/auth';

interface PaginatedData<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    incidencias: PaginatedData<Incidencia>;
    filters: {
        estado?: string;
        tipo_incidencia?: string;
    };
}

export default function IncidenciasIndex({ incidencias, filters }: Props) {
    const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenResolverModal = (incidencia: Incidencia) => {
        setSelectedIncidencia(incidencia);
        setIsModalOpen(true);
    };

    const obtenerNombreUsuario = (usuario?: number | User | null): string => {
        if (!usuario || typeof usuario !== 'object') return 'Sistema';

        const firstName = usuario.first_name || '';
        const lastName = usuario.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || 'Sistema';
    };

    return (
        <div>
            <Head title="Gestión de Incidencias" />

            <div className="max-w-6xl mx-auto space-y-6 p-6">
                {/* Encabezado */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestión de Incidencias</h1>
                        <p className="text-sm text-muted-foreground">
                            Monitoreo y resolución de discrepancias en despachos y novedades del sistema.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <IncidenciaFiltros filters={filters} />
                        <Link href="/incidencias/crear">
                            <Button className="gap-2 bg-sky-600 hover:bg-sky-700 text-white shrink-0">
                                <Plus className="h-4 w-4" />
                                Nueva Incidencia
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Tarjeta de la Tabla */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            Listado de Incidencias ({incidencias.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <IncidenciaTabla
                            incidencias={incidencias.data}
                            onResolve={handleOpenResolverModal}
                        />
                    </CardContent>
                </Card>

                {/* Paginación */}
                {incidencias.last_page > 1 && (
                    <div className="flex items-center justify-end gap-2">
                        {incidencias.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded text-xs font-medium border ${link.active
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-muted border-input'
                                    } ${!link.url && 'pointer-events-none opacity-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ResolverIncidenciaModal
                incidencia={selectedIncidencia}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}

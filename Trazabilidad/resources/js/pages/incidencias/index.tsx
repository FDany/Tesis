// resources/js/pages/incidencias/index.tsx

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IncidenciaBadge } from '@/features/incidencias/components/IncidenciaBadge';
import { IncidenciaFiltros } from '@/features/incidencias/components/IncidenciaFiltros';
import { ResolverIncidenciaModal } from '@/features/incidencias/components/ResolverIncidenciaModal';
import { CheckSquare, Eye, AlertCircle } from 'lucide-react';
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

                    <IncidenciaFiltros filters={filters} />
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20"># ID</TableHead>
                                    <TableHead>Fecha / Hora</TableHead>
                                    <TableHead>Tipo Incidencia</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Origen / Referencia</TableHead>
                                    <TableHead>Registrado Por</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incidencias.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                            No se encontraron incidencias registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    incidencias.data.map((incidencia) => (
                                        <TableRow key={incidencia.id}>
                                            <TableCell className="font-bold">#{incidencia.id}</TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {new Date(incidencia.fecha_hora).toLocaleString('es-AR', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-semibold">
                                                {incidencia.tipo_incidencia}
                                            </TableCell>
                                            <TableCell className="max-w-50 truncate text-xs text-muted-foreground" title={incidencia.descripcion}>
                                                {incidencia.descripcion}
                                            </TableCell>
                                            <TableCell>
                                                {incidencia.remito_salida_retiro ? (
                                                    <span className="text-xs font-medium">
                                                        Remito DGM: #{incidencia.remito_salida_retiro.numero_remito}
                                                    </span>
                                                ) : incidencia.bolsa ? (
                                                    <span className="text-xs font-medium">
                                                        Bolsa: {incidencia.bolsa.codigo_barra}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">General</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {obtenerNombreUsuario(incidencia.usuario_registra)}
                                            </TableCell>
                                            <TableCell>
                                                <IncidenciaBadge estado={incidencia.estado} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Enlace a la vista de detalle show.tsx */}
                                                    <Link href={`/incidencias/${incidencia.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver Detalle">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>

                                                    {incidencia.estado !== 'CERRADA' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1 text-xs"
                                                            onClick={() => handleOpenResolverModal(incidencia)}
                                                        >
                                                            <CheckSquare className="h-3.5 w-3.5 text-primary" />
                                                            Resolver
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
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

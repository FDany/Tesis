import React from 'react';
import { Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IncidenciaBadge } from '@/features/incidencias/components/IncidenciaBadge';
import { CheckSquare, Eye, Building2, Package, FileText } from 'lucide-react';
import type { Incidencia } from '@/features/incidencias/types/incidencia';
import type { User } from '@/types/auth';

interface IncidenciaTablaProps {
    incidencias: Incidencia[];
    onResolve: (incidencia: Incidencia) => void;
}

export function IncidenciaTabla({ incidencias, onResolve }: IncidenciaTablaProps) {
    const obtenerNombreUsuario = (usuario?: number | User | null): string => {
        if (!usuario || typeof usuario !== 'object') return 'Sistema';

        const firstName = usuario.first_name || '';
        const lastName = usuario.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || 'Sistema';
    };

    if (incidencias.length === 0) {
        return (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No se encontraron incidencias registradas.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
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
                {incidencias.map((incidencia) => (
                    <TableRow key={incidencia.id}>
                        <TableCell className="whitespace-nowrap">
                            {new Date(incidencia.fecha_hora).toLocaleString('es-AR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                            })}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold">
                            {incidencia.tipo_incidencia}
                        </TableCell>
                        <TableCell className="max-w-55 truncate text-xs text-muted-foreground" title={incidencia.descripcion}>
                            {incidencia.descripcion}
                        </TableCell>
                        <TableCell>
                            {incidencia.servicio ? (
                                <span className="text-xs font-medium text-sky-700 dark:text-sky-400 flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                                    {incidencia.servicio.nombre}
                                </span>
                            ) : incidencia.remito_salida_retiro ? (
                                <span className="text-xs font-medium flex items-center gap-1">
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    Remito DGM: #{incidencia.remito_salida_retiro.numero_remito}
                                </span>
                            ) : incidencia.bolsa ? (
                                <span className="text-xs font-medium flex items-center gap-1">
                                    <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    Bolsa: {incidencia.bolsa.codigo_barra}
                                </span>
                            ) : incidencia.codigo_no_registrado ? (
                                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                                    Obs: {incidencia.codigo_no_registrado}
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground italic">General</span>
                            )}
                        </TableCell>
                        <TableCell className="text-xs">
                            {obtenerNombreUsuario(incidencia.usuario_registra)}
                        </TableCell>
                        <TableCell>
                            <IncidenciaBadge estado={incidencia.estado} />
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
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
                                        onClick={() => onResolve(incidencia)}
                                    >
                                        <CheckSquare className="h-3.5 w-3.5 text-primary" />
                                        Resolver
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

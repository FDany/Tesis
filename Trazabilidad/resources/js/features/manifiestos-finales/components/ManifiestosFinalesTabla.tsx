import React from 'react';
import { Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, FileText, FileCheck2 } from 'lucide-react';
import type { ManifiestoFinal } from '../types/manifiestoFinal';
import { useAuth } from '@/hooks/use-auth';

interface ManifiestosFinalesTablaProps {
    manifiestos: ManifiestoFinal[];
}

export function ManifiestosFinalesTabla({ manifiestos }: ManifiestosFinalesTablaProps) {
    const { can } = useAuth();

    const formatearFecha = (fecha?: string | null) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
        });
    };

    return (
        <TooltipProvider>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>N° Manifiesto</TableHead>
                        <TableHead>Remito Salida Asociado</TableHead>
                        <TableHead>Fecha Manifiesto</TableHead>
                        <TableHead>Fecha Tratamiento</TableHead>
                        <TableHead className="text-center">Bolsas</TableHead>
                        <TableHead className="text-right">Peso Informado (Kg)</TableHead>
                        <TableHead className="text-center">Certificado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {manifiestos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                No se encontraron manifiestos finales registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        manifiestos.map((manifiesto) => {
                            const remito = manifiesto.remito_salida_retiro;

                            return (
                                <TableRow key={manifiesto.id}>
                                    <TableCell className="font-mono font-bold text-emerald-700">
                                        {manifiesto.numero_manifiesto}
                                    </TableCell>

                                    <TableCell>
                                        {remito ? (
                                            <div className="flex flex-col">
                                                {can('verDetalle remitosSalida') ? (
                                                    <Link
                                                        href={`/remitos-salida/${remito.id}`}
                                                        className="font-mono font-semibold text-primary hover:underline"
                                                    >
                                                        #{remito.numero_remito_interno}
                                                    </Link>
                                                ) : (
                                                    <span className="font-mono font-semibold">
                                                        #{remito.numero_remito_interno}
                                                    </span>
                                                )}
                                                {remito.numero_remito && (
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        DGM: {remito.numero_remito}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Sin remito</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-sm">
                                        {formatearFecha(manifiesto.fecha)}
                                    </TableCell>

                                    <TableCell className="text-sm font-medium">
                                        {formatearFecha(manifiesto.fecha_tratamiento)}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-mono">
                                            {manifiesto.cantidad_bolsas}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right font-mono font-semibold">
                                        {Number(manifiesto.peso_informado).toFixed(2)} Kg
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {manifiesto.documento_oficial ? (
                                            <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50 gap-1">
                                                <FileCheck2 className="h-3 w-3" /> Adjunto
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs">
                                                Sin archivo
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {can('verDetalle manifiestosFinales') && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Link href={`/manifiestos-finales/${manifiesto.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Ver detalle</TooltipContent>
                                                </Tooltip>
                                            )}

                                            {manifiesto.documento_oficial && can('descargarDocumento manifiestosFinales') && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                window.open(`/manifiestos-finales/${manifiesto.id}/documento`, '_blank')
                                                            }
                                                        >
                                                            <FileText className="h-4 w-4 text-emerald-600" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Ver certificado digital</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TooltipProvider>
    );
}

import React from 'react';
import { router, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Printer, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { RemitoSalidaRetiro, EstadoRemitoSalida } from '@/features/remitos-salida/types/remitoSalidaRetiro';

interface RemitoSalidaTablaProps {
    data: RemitoSalidaRetiro[];
}

export function RemitoSalidaTabla({ data }: RemitoSalidaTablaProps) {
    /**
     * Renderiza la insignia visual según el estado del remito.
     */
    const renderBadgeEstado = (estado: EstadoRemitoSalida) => {
        switch (estado) {
            case 'PENDIENTE_RETIRO':
                return (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 flex items-center justify-center gap-1 w-fit mx-auto">
                        <Clock className="h-3 w-3" /> Pendiente Retiro
                    </Badge>
                );
            case 'CONCILIADO':
                return (
                    <Badge className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1 w-fit mx-auto">
                        <CheckCircle2 className="h-3 w-3" /> Conciliado
                    </Badge>
                );
            case 'CON_INCIDENCIA':
                return (
                    <Badge variant="destructive" className="flex items-center justify-center gap-1 w-fit mx-auto">
                        <AlertTriangle className="h-3 w-3" /> Con Incidencia
                    </Badge>
                );
            case 'ANULADO':
                return (
                    <Badge variant="secondary" className="flex items-center justify-center gap-1 w-fit mx-auto">
                        <XCircle className="h-3 w-3" /> Anulado
                    </Badge>
                );
            default:
                return <Badge variant="outline">{estado}</Badge>;
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-base font-medium">No hay remitos de salida registrados.</p>
                <p className="text-sm">Haga clic en "Nuevo Despacho Interno" para emitir una salida.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>N° Remito Interno</TableHead>
                        <TableHead>Fecha Emisión</TableHead>
                        <TableHead>N° Remito DGM</TableHead>
                        <TableHead className="text-center">Bolsas Sistema</TableHead>
                        <TableHead className="text-center">Bolsas DGM</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center w-32">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((remito) => {
                        const cantSistema = remito.cantidad_bolsas_sistema || remito.bolsas_count || 0;
                        const cantDgm = remito.cantidad_bolsas_declaradas_Empresa ?? '-';

                        return (
                            <TableRow key={remito.id}>
                                <TableCell className="font-mono font-bold text-primary">
                                    {remito.numero_remito_interno}
                                </TableCell>
                                <TableCell>
                                    {new Date(remito.fecha_emision).toLocaleString('es-AR', {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                    })}
                                </TableCell>
                                <TableCell className="font-mono">
                                    {remito.numero_remito ? (
                                        <span className="font-semibold text-foreground">{remito.numero_remito}</span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">Pendiente DGM</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center font-semibold">{cantSistema}</TableCell>
                                <TableCell className="text-center font-semibold">{cantDgm}</TableCell>
                                <TableCell className="text-center">
                                    {renderBadgeEstado(remito.estado)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {/* Botón Imprimir PDF Interno */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => window.open(`/remitos-salida/${remito.id}/pdf`, '_blank')}
                                            title="Imprimir PDF Interno"
                                        >
                                            <Printer className="h-4 w-4 text-primary" />
                                        </Button>

                                        {/* Enlace directo con Link de Inertia a la vista show */}
                                        <Link href={`/remitos-salida/${remito.id}`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Ver Detalle y Conciliar"
                                            >
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

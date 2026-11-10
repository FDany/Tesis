import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Scale, Truck, FileClock } from 'lucide-react';
import type { EstadoPendientes } from '../types/dashboard';

interface Props {
    pendientes: EstadoPendientes;
}

const getColorDot = (color: string) => {
    const colorLower = color?.toLowerCase() || '';
    if (colorLower.includes('rojo') || colorLower.includes('red')) return 'bg-red-500';
    if (colorLower.includes('amarillo') || colorLower.includes('yellow')) return 'bg-amber-400';
    if (colorLower.includes('azul') || colorLower.includes('blue')) return 'bg-blue-500';
    if (colorLower.includes('negro') || colorLower.includes('black')) return 'bg-slate-800';
    return 'bg-emerald-500';
};

export function TableroEstadosPendientes({ pendientes }: Props) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-500">
                    <AlertCircle className="h-5 w-5" />
                    Estado de Operación & Alertas
                </CardTitle>
                <CardDescription>
                    Resumen de residuos y documentación pendiente de procesamiento.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* 1. Pendientes de Pesaje */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Scale className="h-3.5 w-3.5 text-amber-600" />
                            Pendientes de Pesaje
                        </span>
                    </div>
                    {pendientes.pesaje.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No hay bolsas sin pesar en depósito.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-1.5">
                            {pendientes.pesaje.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm py-0.5">
                                    <span className="flex items-center gap-2 text-muted-foreground capitalize">
                                        <span className={`h-2.5 w-2.5 rounded-full ${getColorDot(item.color)}`} />
                                        {item.tipo_residuo}:
                                    </span>
                                    <strong className="font-mono text-foreground">{item.cantidad}</strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Pendientes de Retiro */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5 text-sky-600" />
                            Pendientes de Retiro (Depósito)
                        </span>
                    </div>
                    {pendientes.retiro.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No hay bolsas acumuladas para retiro.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-1.5">
                            {pendientes.retiro.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm py-0.5">
                                    <span className="flex items-center gap-2 text-muted-foreground capitalize">
                                        <span className={`h-2.5 w-2.5 rounded-full ${getColorDot(item.color)}`} />
                                        {item.tipo_residuo}:
                                    </span>
                                    <strong className="font-mono text-foreground">{item.cantidad}</strong>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Documentación Pendiente */}
                <div className="space-y-2 pt-1 border-t">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <FileClock className="h-3.5 w-3.5 text-rose-600" />
                        Documentación Pendiente
                    </span>
                    <div className="flex justify-between items-center text-sm bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-md border border-rose-100 dark:border-rose-900/50">
                        <span className="text-rose-900 dark:text-rose-200 font-medium">Remitos DGM pendientes</span>
                        <span className="font-bold font-mono text-rose-700 dark:text-rose-400">
                            {pendientes.documentacion.remitos_dgm}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded-md border">
                        <span className="text-muted-foreground font-medium">Manifiestos por cerrar</span>
                        <span className="font-bold font-mono">
                            {pendientes.documentacion.manifiestos}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

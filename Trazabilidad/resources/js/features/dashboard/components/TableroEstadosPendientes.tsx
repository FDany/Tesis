import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Scale, Truck, FileClock } from 'lucide-react';
import type { EstadoPendientes } from '../types/dashboard';

interface Props {
    pendientes: EstadoPendientes;
}

export function TableroEstadosPendientes({ pendientes }: Props) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-500">
                    <AlertCircle className="h-5 w-5" />
                    Operación y Documentación Pendiente
                </CardTitle>
                <CardDescription>
                    Bolsas pendientes de pesaje/retiro y documentación por cerrar.
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
                                        <span
                                            className="h-2.5 w-2.5 rounded-full shrink-0 border border-black/10"
                                            style={{ backgroundColor: item.color || '#10b981' }}
                                        />
                                        {item.tipo_residuo}:
                                    </span>
                                    <strong className="font-mono text-foreground">
                                        {item.cantidad.toLocaleString('es-AR')}
                                    </strong>
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
                            Pendientes de Retiro
                        </span>
                    </div>
                    {pendientes.retiro.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No hay bolsas listas para retiro.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-1.5">
                            {pendientes.retiro.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm py-0.5">
                                    <span className="flex items-center gap-2 text-muted-foreground capitalize">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full shrink-0 border border-black/10"
                                            style={{ backgroundColor: item.color || '#10b981' }}
                                        />
                                        {item.tipo_residuo}:
                                    </span>
                                    <strong className="font-mono text-foreground">
                                        {item.cantidad.toLocaleString('es-AR')}
                                    </strong>
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
                        <span className="text-rose-900 dark:text-rose-200 font-medium">Remitos DGM</span>
                        <span className="font-bold font-mono text-rose-700 dark:text-rose-400">
                            {pendientes.documentacion.remitos_dgm.toLocaleString('es-AR')}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded-md border">
                        <span className="text-muted-foreground font-medium">Manifiestos</span>
                        <span className="font-bold font-mono">
                            {pendientes.documentacion.manifiestos.toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

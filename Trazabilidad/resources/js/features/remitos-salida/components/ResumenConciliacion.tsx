import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Scale, PackageCheck, FileText } from 'lucide-react';

interface Props {
    cantidadSistema: number;
    pesoSistema: number;
    cantidadDgm: number;
}

export function ResumenConciliacion({ cantidadSistema, pesoSistema, cantidadDgm }: Props) {
    const coincide = cantidadSistema === cantidadDgm;
    const diferencia = cantidadSistema - cantidadDgm;

    return (
        <div className="space-y-4">
            {/* Tarjetas de Métricas en Tiempo Real */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Cantidad Sistema</p>
                            <p className="text-2xl font-bold">{cantidadSistema} <span className="text-sm font-normal text-muted-foreground">bolsas</span></p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <PackageCheck className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Peso Total Sistema</p>
                            <p className="text-2xl font-bold">{pesoSistema.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Scale className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">Declarado por DGM</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold">{cantidadDgm} <span className="text-sm font-normal text-muted-foreground">bolsas</span></p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            {cantidadDgm > 0 && (
                                <Badge variant={coincide ? 'default' : 'destructive'} className="text-[10px]">
                                    {coincide ? 'Coincide' : `Dif: ${diferencia}`}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerta de Estado de Conciliación */}
            {cantidadDgm > 0 && (
                coincide ? (
                    <Alert className="border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Conciliación Correcta</AlertTitle>
                        <AlertDescription className="text-xs mt-1 text-green-700 dark:text-green-300">
                            La cantidad de bolsas escaneadas coincide perfectamente con la cantidad declarada en el remito de DGM.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Se generará una Incidencia Automática</AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                            Existe una diferencia de <strong>{Math.abs(diferencia)} bolsa(s)</strong> entre el sistema ({cantidadSistema}) y lo declarado por DGM ({cantidadDgm}). Al registrar el remito se abrirá una incidencia de tipo{' '}
                            <code className="rounded bg-destructive/20 px-1 py-0.5 font-mono font-semibold">
                                DISCREPANCIA_CONCILIACION_DGM
                            </code>{' '}
                            en estado <strong className="underline">ABIERTA</strong>.
                        </AlertDescription>
                    </Alert>
                )
            )}
        </div>
    );
}

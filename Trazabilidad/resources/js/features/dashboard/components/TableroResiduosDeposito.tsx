import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Warehouse } from 'lucide-react';
import type { ConteoPorCorriente } from '../types/dashboard';

interface Props {
    residuosDeposito: ConteoPorCorriente[];
}

export function TableroResiduosDeposito({ residuosDeposito }: Props) {
    const totalBolsas = residuosDeposito.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
    const totalPeso = residuosDeposito.reduce((acc, item) => acc + Number(item.peso_total || 0), 0);

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-emerald-600" />
                    Residuos en Depósito
                </CardTitle>
                <CardDescription>
                    Total de bolsas almacenadas actualmente por corriente de residuo.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {residuosDeposito.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                        No hay residuos almacenados en depósito actualmente.
                    </p>
                ) : (
                    <>
                        <div className="space-y-2.5">
                            {residuosDeposito.map((item, idx) => (
                                <div
                                    key={item.tipo_bolsa_id ?? `${item.tipo_residuo}-${idx}`}
                                    className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-sm"
                                >
                                    <span className="flex items-center gap-2.5 font-medium text-foreground capitalize">
                                        <span
                                            className="h-3.5 w-3.5 rounded-full shrink-0 border border-black/10"
                                            style={{ backgroundColor: item.color || '#10b981' }}
                                        />
                                        {item.tipo_residuo}
                                    </span>
                                    <div className="text-right">
                                        <span className="font-bold font-mono text-base bg-muted px-2.5 py-0.5 rounded-md">
                                            {Number(item.cantidad || 0).toLocaleString('es-AR')} bolsas
                                        </span>
                                        {typeof item.peso_total === 'number' && (
                                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                                {Number(item.peso_total).toFixed(2)} Kg
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t text-sm">
                            <span className="font-medium text-muted-foreground">Total en Depósito</span>
                            <div className="text-right">
                                <span className="font-bold font-mono text-base text-emerald-700 dark:text-emerald-400">
                                    {totalBolsas.toLocaleString('es-AR')} bolsas
                                </span>
                                {totalPeso > 0 && (
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {totalPeso.toFixed(2)} Kg
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

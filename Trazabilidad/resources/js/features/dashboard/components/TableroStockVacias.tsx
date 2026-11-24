import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';
import type { ItemStockVacias } from '../types/dashboard';

interface Props {
    stockVacias: ItemStockVacias[];
}

export function TableroStockVacias({ stockVacias }: Props) {
    const totalStock = stockVacias.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-sky-600" />
                    Stock de Bolsas Vacías
                </CardTitle>
                <CardDescription>
                    Inventario disponible de bolsas vacías por tipo y tamaño.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {stockVacias.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                        No hay registro de stock de bolsas vacías.
                    </p>
                ) : (
                    <>
                        <div className="space-y-3">
                            {stockVacias.map((item, index) => (
                                <div
                                    key={item.tipo_bolsa_id ? `${item.tipo_bolsa_id}-${item.tamanio_id ?? 'unico'}-${index}` : index}
                                    className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/40 transition-colors text-sm"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm border border-black/10"
                                            style={{ backgroundColor: item.color || '#10b981' }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground capitalize">
                                                {item.nombre}
                                            </span>
                                            {item.nombre_tamanio && (
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    Tamaño: {item.nombre_tamanio}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold font-mono text-base bg-muted px-2.5 py-0.5 rounded-md">
                                        {Number(item.cantidad || 0).toLocaleString('es-AR')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t text-sm">
                            <span className="font-medium text-muted-foreground">Total Stock Vacías</span>
                            <span className="font-bold font-mono text-base text-sky-700 dark:text-sky-400">
                                {totalStock.toLocaleString('es-AR')} bolsas
                            </span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

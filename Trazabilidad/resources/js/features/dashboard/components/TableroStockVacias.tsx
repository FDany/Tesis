import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';
import type { ItemStockVacias } from '../types/dashboard';

interface Props {
    stockVacias: ItemStockVacias[];
}

export function TableroStockVacias({ stockVacias }: Props) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-sky-600" />
                    Stock de Bolsas Vacías
                </CardTitle>
                <CardDescription>
                    Inventario disponible en depósito de insumos por tipo y tamaño.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {stockVacias.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                        No hay registro de stock de bolsas vacías.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {stockVacias.map((item, index) => (
                            <div
                                key={item.tipo_bolsa_id ? `${item.tipo_bolsa_id}-${item.tamanio_id ?? index}` : index}
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
                                    {item.cantidad.toLocaleString('es-AR')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

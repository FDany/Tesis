import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';
import type { ItemStockVacias } from '../types/dashboard';

interface Props {
    stockVacias: ItemStockVacias[];
}

// Mapeo dinámico de estilos de color según el valor devuelto por tipos_bolsa
const getColorBadge = (color: string) => {
    const colorLower = color?.toLowerCase() || '';
    if (colorLower.includes('rojo') || colorLower.includes('red')) {
        return 'bg-red-500';
    }
    if (colorLower.includes('amarillo') || colorLower.includes('yellow')) {
        return 'bg-amber-400';
    }
    if (colorLower.includes('azul') || colorLower.includes('blue')) {
        return 'bg-blue-500';
    }
    if (colorLower.includes('negro') || colorLower.includes('black')) {
        return 'bg-slate-800';
    }
    return 'bg-emerald-500';
};

export function TableroStockVacias({ stockVacias }: Props) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-sky-600" />
                    Stock de Bolsas Vacías
                </CardTitle>
                <CardDescription>
                    Inventario disponible por tipo, color y tamaño.
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
                                key={item.tipo_bolsa_id ? `${item.tipo_bolsa_id}-${index}` : index}
                                className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/40 transition-colors text-sm"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className={`h-3.5 w-3.5 rounded-full shrink-0 shadow-sm ${getColorBadge(item.color)}`}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground capitalize">
                                            {item.nombre}
                                        </span>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            Color: {item.color} {item.nombre_tamanio ? `• ${item.nombre_tamanio}` : ''}
                                        </span>
                                    </div>
                                </div>
                                <span className="font-bold font-mono text-base bg-muted px-2.5 py-0.5 rounded-md">
                                    {item.cantidad}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

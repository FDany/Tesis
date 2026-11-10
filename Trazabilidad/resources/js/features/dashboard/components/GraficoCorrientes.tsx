import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Biohazard } from 'lucide-react';
import type { CorrienteResiduo } from '../types/dashboard';

interface Props {
    corrientes: CorrienteResiduo[];
}

const HEX_COLOR_MAP: Record<string, string> = {
    rojo: '#ef4444',
    red: '#ef4444',
    amarillo: '#f59e0b',
    yellow: '#f59e0b',
    azul: '#3b82f6',
    blue: '#3b82f6',
    negro: '#1e293b',
    black: '#1e293b',
    verde: '#10b981',
    green: '#10b981',
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-popover/95 backdrop-blur-sm border text-popover-foreground p-3 rounded-lg shadow-lg text-xs space-y-1.5 max-w-55 z-50 pointer-events-none">
                <p className="font-semibold flex items-center gap-1.5 leading-tight wrap-break-words">
                    <span
                        className="h-2.5 w-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: data.color }}
                    />
                    <span>{data.name}</span>
                </p>
                <div className="text-muted-foreground pt-1 border-t space-y-0.5 font-mono">
                    <div className="flex justify-between items-center gap-2">
                        <span>Bolsas:</span>
                        <strong className="text-foreground font-bold">{data.value}</strong>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <span>Peso total:</span>
                        <strong className="text-foreground font-bold">{data.peso} Kg</strong>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const resolveColor = (colorName: string) => {
    const key = colorName?.toLowerCase() || '';
    return HEX_COLOR_MAP[key] || '#6366f1';
};

export function GraficoCorrientes({ corrientes }: Props) {
    const chartData = corrientes.map((c) => ({
        name: c.tipo_residuo,
        value: c.cantidad_total,
        peso: c.peso_total,
        color: resolveColor(c.color),
    }));

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Biohazard className="h-5 w-5 text-red-600" />
                    Indicadores por Corriente (Tipo de Residuo)
                </CardTitle>
                <CardDescription>
                    Distribución de bolsas totales y kilogramos por corriente de residuo.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Gráfica Donut / Pie Chart */}
                <div className="h-55 w-full">
                    {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            Sin datos para el período seleccionado.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    wrapperStyle={{ zIndex: 1000 }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Desglose Detallado por Tamaño dentro de cada Corriente */}
                <div className="flex flex-col gap-3 pt-2 border-t">
                    {corrientes.map((corriente) => (
                        <div
                            key={corriente.tipo_bolsa_id}
                            className="p-3 rounded-lg border bg-muted/30 space-y-2 text-sm"
                        >
                            <div className="flex items-center justify-between font-semibold">
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full shrink-0"
                                        style={{ backgroundColor: resolveColor(corriente.color) }}
                                    />
                                    {corriente.tipo_residuo}
                                </span>
                                <span className="text-xs font-mono font-bold bg-background px-2 py-0.5 rounded border">
                                    {corriente.peso_total} Kg
                                </span>
                            </div>

                            <div className="space-y-1 text-xs text-muted-foreground pt-1">
                                {corriente.por_tamanio && corriente.por_tamanio.length > 0 ? (
                                    corriente.por_tamanio.map((t, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>Bolsas {t.nombre_tamanio}:</span>
                                            <strong className="text-foreground font-mono">{t.cantidad} ({t.peso_total} Kg)</strong>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-between">
                                        <span>Cantidad Total:</span>
                                        <strong className="text-foreground font-mono">{corriente.cantidad_total} bolsas</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

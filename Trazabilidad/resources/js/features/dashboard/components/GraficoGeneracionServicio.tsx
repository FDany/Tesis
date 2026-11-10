import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Building2 } from 'lucide-react';
import type { MetricaServicio } from '../types/dashboard';

interface Props {
    metricasServicio: MetricaServicio[];
}

export function GraficoGeneracionServicio({ metricasServicio }: Props) {
    const chartData = metricasServicio.map((item) => ({
        nombre: item.nombre_servicio,
        kilogramos: Number(item.kilogramos),
        bolsas: Number(item.cantidad_bolsas),
    }));

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    Generación por Servicio Hospitalario
                </CardTitle>
                <CardDescription>
                    Comparativo de peso acumulado (Kg) y bolsas generadas según el servicio de origen.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Gráfico de Barras con Recharts */}
                <div className="h-70 w-full pt-4">
                    {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            Sin datos de servicios para el período seleccionado.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis
                                    dataKey="nombre"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                    interval={0}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                    unit=" Kg"
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === 'kilogramos' ? `${value} Kg` : `${value} bolsas`,
                                        name === 'kilogramos' ? 'Peso Total' : 'Cantidad Bolsas',
                                    ]}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="kilogramos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Tabla Detallada Acumulada */}
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Servicio Hospitalario</TableHead>
                                <TableHead className="text-center">Bolsas Despachadas</TableHead>
                                <TableHead className="text-right">Kilogramos Totales</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metricasServicio.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                                        No hay registros disponibles.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                metricasServicio.map((row) => (
                                    <TableRow key={row.servicio_id}>
                                        <TableCell className="font-semibold">{row.nombre_servicio}</TableCell>
                                        <TableCell className="text-center font-mono">{row.cantidad_bolsas}</TableCell>
                                        <TableCell className="text-right font-mono font-bold text-emerald-600">
                                            {Number(row.kilogramos).toFixed(2)} Kg
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

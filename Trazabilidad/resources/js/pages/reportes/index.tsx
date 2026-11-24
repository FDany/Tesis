import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageCheck, RefreshCw, Scale, Truck, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
    FiltrosReportes,
    GraficoCorrientes,
    GraficoGeneracionServicio,
    type FiltrosReportesParams,
    type ReportesData,
} from '@/features/reportes';
import type { Servicio } from '@/features/servicios/types/servicio';

interface Props {
    filtros: FiltrosReportesParams;
    servicios?: Servicio[];
    reportes: ReportesData;
}

export default function ReportesPage({
    filtros,
    servicios = [],
    reportes,
}: Props) {
    const { generales, corrientes, kilogramos_por_periodo, metricas_servicio } = reportes;

    return (
        <>
            <Head title="Reportes Estadísticos - Gestión Ambiental" />

            <div className="container mx-auto p-4 md:p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Reportes e Indicadores Estadísticos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Estadísticas históricas por período, corriente de residuo, tamaño y servicio hospitalario.
                    </p>
                </div>

                {/* 1. Filtros por rango de fechas y servicio */}
                <FiltrosReportes filtros={filtros} servicios={servicios} />

                {/* 2. Indicadores Generales (Punto 21) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Bolsas Recibidas
                            </CardTitle>
                            <PackageCheck className="h-4 w-4 text-sky-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{generales.bolsas_recibidas.toLocaleString('es-AR')}</div>
                            <p className="text-xs text-muted-foreground mt-1">Ingresadas en el período</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Bolsas Utilizadas
                            </CardTitle>
                            <RefreshCw className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{generales.bolsas_utilizadas.toLocaleString('es-AR')}</div>
                            <p className="text-xs text-muted-foreground mt-1">Con uso registrado</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Kg Generados
                            </CardTitle>
                            <Scale className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Number(generales.kilogramos_generados).toFixed(2)} Kg</div>
                            <p className="text-xs text-muted-foreground mt-1">Peso total acumulado</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Promedio / Bolsa
                            </CardTitle>
                            <Scale className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Number(generales.peso_promedio_bolsa).toFixed(2)} Kg</div>
                            <p className="text-xs text-muted-foreground mt-1">Sobre bolsas pesadas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Bolsas Retiradas
                            </CardTitle>
                            <Truck className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{generales.bolsas_retiradas.toLocaleString('es-AR')}</div>
                            <p className="text-xs text-muted-foreground mt-1">Retiradas DGM / dispuestas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Kilogramos por Período y Distribución por Corriente */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 h-full">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-sky-600" />
                                Kilogramos por Período
                            </CardTitle>
                            <CardDescription>
                                Evolución del peso (Kg) y cantidad de bolsas dentro del rango seleccionado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            {kilogramos_por_periodo.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                    Sin datos para el período seleccionado.
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={kilogramos_por_periodo} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis
                                            dataKey="etiqueta"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 12 }}
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
                                                name === 'kilogramos' ? 'Kilogramos' : 'Bolsas',
                                            ]}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        />
                                        <Bar dataKey="kilogramos" fill="#0284c7" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-1">
                        <GraficoCorrientes corrientes={corrientes} />
                    </div>
                </div>

                {/* 4. Generación por Servicio Hospitalario */}
                <GraficoGeneracionServicio metricasServicio={metricas_servicio} />
            </div>
        </>
    );
}

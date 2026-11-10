import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageCheck, Scale, RefreshCw, ArrowUpRight } from 'lucide-react';
import type { IndicadoresGenerales } from '../types/dashboard';

interface Props {
    generales: IndicadoresGenerales;
}

export function KpiCardGeneral({ generales }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Bolsas Recibidas */}
            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bolsas Recibidas
                    </CardTitle>
                    <PackageCheck className="h-4 w-4 text-sky-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{generales.bolsas_recibidas}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total en el período</p>
                </CardContent>
            </Card>

            {/* Bolsas Utilizadas */}
            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bolsas Utilizadas
                    </CardTitle>
                    <RefreshCw className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{generales.bolsas_utilizadas}</div>
                    <p className="text-xs text-muted-foreground mt-1">En servicios hospitalarios</p>
                </CardContent>
            </Card>

            {/* Kilogramos Generados */}
            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Kg Generados
                    </CardTitle>
                    <Scale className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{generales.kilogramos_generados} Kg</div>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" /> Peso acumulado
                    </p>
                </CardContent>
            </Card>

            {/* Peso Promedio por Bolsa */}
            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Promedio / Bolsa
                    </CardTitle>
                    <Scale className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{generales.peso_promedio_bolsa} Kg</div>
                    <p className="text-xs text-muted-foreground mt-1">Peso medio registrado</p>
                </CardContent>
            </Card>

            {/* Bolsas Retiradas DGM */}
            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bolsas Retiradas
                    </CardTitle>
                    <PackageCheck className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{generales.bolsas_retiradas}</div>
                    <p className="text-xs text-muted-foreground mt-1">Despachadas por DGM</p>
                </CardContent>
            </Card>
        </div>
    );
}

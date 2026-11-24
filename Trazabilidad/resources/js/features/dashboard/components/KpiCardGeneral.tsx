import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageCheck, Scale, RefreshCw, Truck } from 'lucide-react';
import type { ResumenMesDashboard } from '../types/dashboard';

interface Props {
    resumenMes: ResumenMesDashboard;
}

export function KpiCardGeneral({ resumenMes }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bolsas Recibidas
                    </CardTitle>
                    <PackageCheck className="h-4 w-4 text-sky-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{resumenMes.bolsas_recibidas}</div>
                    <p className="text-xs text-muted-foreground mt-1">Mes en curso</p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bolsas Utilizadas
                    </CardTitle>
                    <RefreshCw className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{resumenMes.bolsas_utilizadas}</div>
                    <p className="text-xs text-muted-foreground mt-1">En servicios hospitalarios</p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bolsas Retiradas
                    </CardTitle>
                    <Truck className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{resumenMes.bolsas_retiradas}</div>
                    <p className="text-xs text-muted-foreground mt-1">Retiradas por DGM / dispuestas</p>
                </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Kg Generados
                    </CardTitle>
                    <Scale className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{resumenMes.kilogramos_generados.toFixed(2)} Kg</div>
                    <p className="text-xs text-muted-foreground mt-1">Peso acumulado en el mes</p>
                </CardContent>
            </Card>
        </div>
    );
}

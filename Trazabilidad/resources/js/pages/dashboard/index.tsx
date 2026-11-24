import React from 'react';
import { Head } from '@inertiajs/react';
import { KpiCardGeneral } from '@/features/dashboard/components/KpiCardGeneral';
import { TableroStockVacias } from '@/features/dashboard/components/TableroStockVacias';
import { TableroResiduosDeposito } from '@/features/dashboard/components/TableroResiduosDeposito';
import { TableroEstadosPendientes } from '@/features/dashboard/components/TableroEstadosPendientes';
import type { DashboardPageProps } from '@/features/dashboard/types/dashboard';

export default function DashboardPage({
    resumen_mes = {
        bolsas_recibidas: 0,
        bolsas_utilizadas: 0,
        bolsas_retiradas: 0,
        kilogramos_generados: 0,
    },
    tablero = {
        stock_vacias: [],
        residuos_deposito: [],
        pendientes: {
            pesaje: [],
            retiro: [],
            documentacion: {
                remitos_dgm: 0,
                manifiestos: 0,
            },
        },
    },
}: DashboardPageProps) {
    return (
        <>
            <Head title="Tablero de Control - Gestión Ambiental" />

            <div className="container mx-auto p-4 md:p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Tablero de Control
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Estado operativo en tiempo real del Área Ambiental y resumen del mes en curso.
                    </p>
                </div>

                <KpiCardGeneral resumenMes={resumen_mes} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <TableroStockVacias stockVacias={tablero.stock_vacias} />
                    <TableroResiduosDeposito residuosDeposito={tablero.residuos_deposito} />
                    <TableroEstadosPendientes pendientes={tablero.pendientes} />
                </div>
            </div>
        </>
    );
}

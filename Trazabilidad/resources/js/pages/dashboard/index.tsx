import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FiltrosDashboard } from '@/features/dashboard/components/FiltrosDashboard';
import { KpiCardGeneral } from '@/features/dashboard/components/KpiCardGeneral';
import { TableroStockVacias } from '@/features/dashboard/components/TableroStockVacias';
import { TableroEstadosPendientes } from '@/features/dashboard/components/TableroEstadosPendientes';
import { GraficoCorrientes } from '@/features/dashboard/components/GraficoCorrientes';
import { GraficoGeneracionServicio } from '@/features/dashboard/components/GraficoGeneracionServicio';
import type { FiltrosDashboard as FiltrosType, TableroControlData } from '@/features/dashboard/types/dashboard';
import type { Servicio } from '@/features/servicios/types/servicio';

interface Props {
    filtros: FiltrosType;
    servicios?: Servicio[];
    indicadores: TableroControlData;
}

export default function DashboardPage({ filtros, servicios = [], indicadores }: Props) {
    return (
        <div>
            <Head title="Panel Principal - Gestión Ambiental" />

            <div className="container mx-auto p-4 md:p-6 space-y-6">
                {/* Encabezado Principal */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Panel Principal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Monitoreo en tiempo real y estadísticas del sistema de gestión ambiental de residuos.
                    </p>
                </div>

                {/* 1. Barra de Filtros Aislada */}
                <FiltrosDashboard filtros={filtros} servicios={servicios} />

                {/* 2. Tarjetas KPI Generales */}
                <KpiCardGeneral generales={indicadores.generales} />

                {/* 3. Grid de Operación y Corrientes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna 1: Stock Vacías */}
                    <TableroStockVacias stockVacias={indicadores.stock_vacias} />

                    {/* Columna 2: Estado de Operación & Alertas */}
                    <TableroEstadosPendientes pendientes={indicadores.pendientes} />

                    {/* Columna 3: Gráfico de Corrientes / Tipos de Residuo */}
                    <GraficoCorrientes corrientes={indicadores.corrientes} />
                </div>

                {/* 4. Gráficos de Generación por Servicio Hospitalario */}
                <div className="pt-2">
                    <GraficoGeneracionServicio metricasServicio={indicadores.metricas_servicio} />
                </div>
            </div>
        </div>
    );
}

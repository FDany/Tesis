import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck2, Search, X } from 'lucide-react';
import { ManifiestosFinalesTabla } from '@/features/manifiestos-finales/components/ManifiestosFinalesTabla';
import { FiltroGenerico, type CampoFiltro } from '@/components/filtros/FiltroGenerico';
import Paginacion, { type PaginacionData } from '@/components/Paginador';
import CantFilas from '@/components/CantFilas';
import FlashMessage from '@/components/FlashMessage';
import type { ManifiestoFinal } from '@/features/manifiestos-finales/types/manifiestoFinal';

interface ManifiestosPaginados extends PaginacionData {
    data: ManifiestoFinal[];
}

interface Props {
    manifiestos: ManifiestosPaginados;
    porPagina: number;
    opcionesPorPagina: number[];
    filtros: {
        buscar: string;
        fecha_desde: string;
        fecha_hasta: string;
    };
}

const CAMPOS_FILTRO: CampoFiltro[] = [
    {
        key: 'buscar',
        label: 'Buscar',
        type: 'text',
        placeholder: 'N° manifiesto, remito interno o DGM...',
    },
    {
        key: 'fecha_desde',
        label: 'Fecha Desde',
        type: 'date',
    },
    {
        key: 'fecha_hasta',
        label: 'Fecha Hasta',
        type: 'date',
    },
];

export default function IndexManifiestosFinales({
    manifiestos,
    porPagina,
    opcionesPorPagina,
    filtros,
}: Props) {
    const [valores, setValores] = useState<Record<string, string>>({
        buscar: filtros.buscar || '',
        fecha_desde: filtros.fecha_desde || '',
        fecha_hasta: filtros.fecha_hasta || '',
    });

    const handleChangeFiltro = (key: string, value: string) => {
        setValores((prev) => ({ ...prev, [key]: value }));
    };

    const aplicarFiltros = (nuevaCantidadFilas = porPagina) => {
        router.get(
            '/manifiestos-finales',
            {
                ...valores,
                por_pagina: nuevaCantidadFilas,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleLimpiar = () => {
        const limpios = { buscar: '', fecha_desde: '', fecha_hasta: '' };
        setValores(limpios);
        router.get(
            '/manifiestos-finales',
            { por_pagina: porPagina },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const hayFiltrosActivos = Boolean(
        filtros.buscar || filtros.fecha_desde || filtros.fecha_hasta
    );

    return (
        <>
            <Head title="Manifiestos Finales" />

            <div className="p-6 space-y-6">
                <FlashMessage />

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <FileCheck2 className="h-6 w-6 text-emerald-600" />
                            Manifiestos Finales de Disposición
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Certificados oficiales de tratamiento y disposición final emitidos por el operador habilitado.
                        </p>
                    </div>
                </div>

                {/* Filtros y Selector de Filas */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 space-y-4">
                        <FiltroGenerico
                            campos={CAMPOS_FILTRO}
                            valores={valores}
                            onChange={handleChangeFiltro}
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
                            <CantFilas
                                value={porPagina}
                                options={opcionesPorPagina}
                                onChange={(val) => aplicarFiltros(val)}
                            />

                            <div className="flex items-center gap-2">
                                {hayFiltrosActivos && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleLimpiar}
                                        className="gap-1"
                                    >
                                        <X className="h-4 w-4" />
                                        Limpiar
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    onClick={() => aplicarFiltros()}
                                    className="gap-2"
                                >
                                    <Search className="h-4 w-4" />
                                    Filtrar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla + Paginador integrado */}
                <Card className="shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <ManifiestosFinalesTabla manifiestos={manifiestos.data} />
                    </CardContent>

                    <Paginacion pagination={manifiestos} />
                </Card>
            </div>
        </>
    );
}

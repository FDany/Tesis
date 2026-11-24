import React, { useState, type FormEvent } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import type { RemitoSalidaRetiro } from '@/features/remitos-salida/types/remitoSalidaRetiro';
import { RemitoSalidaFiltros } from '@/features/remitos-salida/components/RemitoSalidaFiltros';
import { RemitosSalidaTabla } from '@/features/remitos-salida/components/RemitosSalidaTabla';
import Paginacion, { type PaginacionData } from '@/components/Paginador';
import FlashMessage from '@/components/FlashMessage';
import { useAuth } from '@/hooks/use-auth';

interface Props {
    remitos: PaginacionData & { data: RemitoSalidaRetiro[] };
    filtros: {
        buscar: string;
        estado: string;
    };
}

export default function IndexRemitosSalida({ remitos, filtros }: Props) {
    const { can } = useAuth();

    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const [estado, setEstado] = useState(filtros.estado ?? '');

    const aplicarFiltros = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            '/remitos-salida',
            { buscar, estado },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const cambiarFiltro = (key: string, value: string) => {
        if (key === 'buscar') {
            setBuscar(value);
            return;
        }

        if (key === 'estado') {
            const nuevoEstado = value === 'TODOS' ? '' : value;
            setEstado(nuevoEstado);

            router.get(
                '/remitos-salida',
                { buscar, estado: nuevoEstado },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    };

    return (
        <>
            <Head title="Remitos de Salida" />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <FlashMessage />

                {/* Encabezado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Remitos de Salida</h1>
                        <p className="text-muted-foreground">
                            Gestión de despachos internos (PDF) y trazabilidad de conciliación con retiros DGM.
                        </p>
                    </div>
                    {can('crear remitosSalida') && (
                        <Button asChild size="lg">
                            <Link href="/remitos-salida/create">
                                <Plus className="mr-2 h-5 w-5" /> Nuevo Despacho Interno
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <form onSubmit={aplicarFiltros}>
                        <RemitoSalidaFiltros
                            valores={{ buscar, estado }}
                            onChange={cambiarFiltro}
                        />
                        <button type="submit" className="sr-only">
                            Buscar remito
                        </button>
                    </form>
                </div>

                {/* Tabla de Remitos */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Despachos Registrados
                        </CardTitle>
                        <CardDescription>
                            Listado general de remitos internos emitidos y su estado de retiro con DGM.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RemitosSalidaTabla data={remitos.data} />

                        {/* Paginación */}
                        <Paginacion pagination={remitos} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

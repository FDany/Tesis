import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, Clock, CheckCircle2, AlertTriangle, XCircle, Package } from 'lucide-react';
import { ResumenConciliacion } from '@/features/remitos-salida/components/ResumenConciliacion';
import type { RemitoSalidaRetiro, EstadoRemitoSalida, ConciliarRemitoSalidaRetiroDTO } from '@/features/remitos-salida/types/remitoSalidaRetiro';

interface Props {
    remito: RemitoSalidaRetiro;
}

export default function ShowRemitoSalida({ remito }: Props) {
    const bolsas = remito.bolsas || [];
    const pesoTotal = remito.peso_total_sistema || bolsas.reduce((acc, b) => acc + (Number(b.peso) || 0), 0);

    // Formulario de Inertia sincronizado con el DTO que espera ResumenConciliacion
    const { data, setData, post, processing, errors } = useForm<ConciliarRemitoSalidaRetiroDTO>({
        numero_remito: remito.numero_remito || '',
        fecha_retiro: remito.fecha_retiro || new Date().toISOString().slice(0, 16),
        cantidad_bolsas_declaradas_Empresa: remito.cantidad_bolsas_declaradas_Empresa ?? bolsas.length,
        responsable_empresa: remito.responsable_empresa || '',
        datos_transporte: remito.datos_transporte || '',
        observaciones: remito.observaciones || '',
    });

    const handleConciliarSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/remitos-salida/${remito.id}/conciliar`);
    };

    const renderBadgeEstado = (estado: EstadoRemitoSalida) => {
        switch (estado) {
            case 'PENDIENTE_RETIRO':
                return (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 gap-1">
                        <Clock className="h-3 w-3" /> Pendiente Retiro
                    </Badge>
                );
            case 'CONCILIADO':
                return (
                    <Badge className="bg-green-600 hover:bg-green-700 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Conciliado
                    </Badge>
                );
            case 'CON_INCIDENCIA':
                return (
                    <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Con Incidencia
                    </Badge>
                );
            case 'ANULADO':
                return (
                    <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" /> Anulado
                    </Badge>
                );
            default:
                return <Badge variant="outline">{estado}</Badge>;
        }
    };

    return (
        <>
            <Head title={`Remito Interno ${remito.numero_remito_interno}`} />

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Encabezado Principal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Link href="/remitos-salida">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Remito Interno #{remito.numero_remito_interno}
                            </h1>
                            {renderBadgeEstado(remito.estado)}
                        </div>
                        <p className="text-sm text-muted-foreground pl-11">
                            Emitido el {new Date(remito.fecha_emision).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.open(`/remitos-salida/${remito.id}/pdf`, '_blank')}
                    >
                        <Printer className="h-4 w-4 text-sky-600" />
                        Imprimir PDF Interno
                    </Button>
                </div>

                {/* Sección de Conciliación (Formulario y Métricas) */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Trazabilidad y Conciliación DGM</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResumenConciliacion
                            remito={remito}
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={handleConciliarSubmit}
                        />
                    </CardContent>
                </Card>

                {/* Tabla de Bolsas Incluidas */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                Bolsas Incluidas en el Despacho ({bolsas.length})
                            </div>
                            <span className="text-sm font-normal text-muted-foreground">
                                Peso Total: <strong className="text-foreground">{pesoTotal.toFixed(2)} Kg</strong>
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código de Barras</TableHead>
                                    <TableHead>Tipo de Residuo</TableHead>
                                    <TableHead className="text-right">Peso (Kg)</TableHead>
                                    <TableHead className="text-center">Estado Bolsa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bolsas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No hay bolsas asociadas a este remito.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bolsas.map((bolsa) => (
                                        <TableRow key={bolsa.id}>
                                            <TableCell className="font-mono font-bold">{bolsa.codigo_barra}</TableCell>
                                            <TableCell>{bolsa.tipo_bolsa?.tipo_residuo || 'General'}</TableCell>
                                            <TableCell className="text-right font-mono font-semibold">{Number(bolsa.peso).toFixed(2)} Kg</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="text-xs">
                                                    {bolsa.estado}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

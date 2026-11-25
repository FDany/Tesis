import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, Clock, CheckCircle2, AlertTriangle, XCircle, Package, FileCheck2 } from 'lucide-react';
import { ResumenConciliacion } from '@/features/remitos-salida/components/ResumenConciliacion';
import { FormularioManifiestoFinal } from '@/features/manifiestos-finales';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import FlashMessage from '@/components/FlashMessage';
import type { RemitoSalidaRetiro, EstadoRemitoSalida, ConciliarRemitoSalidaRetiroDTO } from '@/features/remitos-salida/types/remitoSalidaRetiro';
import { useAuth } from '@/hooks/use-auth';
import { ESTADO_BOLSA_LABELS } from '@/features/bolsas/types/bolsa';

interface Props {
    remito: RemitoSalidaRetiro;
}

export default function ShowRemitoSalida({ remito }: Props) {
    const { can } = useAuth();
    const [modalAnularAbierto, setModalAnularAbierto] = useState(false);

    const bolsas = remito.bolsas || [];
    const pesoTotal = Number(remito.peso_total_sistema) || bolsas.reduce((acc, b) => acc + (Number(b.peso) || 0), 0);

    // Formulario de Conciliación DGM
    const { data, setData, post, processing, errors } = useForm<ConciliarRemitoSalidaRetiroDTO>({
        numero_remito: remito.numero_remito || '',
        fecha_retiro: remito.fecha_retiro || new Date().toISOString().slice(0, 16),
        cantidad_bolsas_declaradas_Empresa: remito.cantidad_bolsas_declaradas_Empresa ?? bolsas.length,
        responsable_empresa: remito.responsable_empresa || '',
        datos_transporte: remito.datos_transporte || '',
        observaciones: remito.observaciones || '',
    });

    // Formulario de Anulación
    const formAnular = useForm({
        motivo_anulacion: '',
    });

    const handleConciliarSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/remitos-salida/${remito.id}/conciliar`);
    };

    const handleConfirmarAnulacion = () => {
        formAnular.post(`/remitos-salida/${remito.id}/anular`, {
            onSuccess: () => {
                setModalAnularAbierto(false);
                formAnular.reset();
            },
        });
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
            case 'FINALIZADO':
                return (
                    // <Badge className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                    //     <FileCheck2 className="h-3 w-3" /> Finalizado
                    // </Badge>

                    <Badge className="bg-blue-600 hover:bg-blue-700 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Finalizado
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

    const puedeGestionarManifiesto = ['CONCILIADO', 'CON_INCIDENCIA', 'FINALIZADO'].includes(remito.estado);

    return (
        <>
            <Head title={`Remito Interno ${remito.numero_remito_interno}`} />

            <div className="p-6 space-y-6">
                <FlashMessage />

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

                    <div className="flex items-center gap-2">
                        {remito.estado === 'PENDIENTE_RETIRO' && can('anular remitosSalida') && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="gap-2"
                                onClick={() => setModalAnularAbierto(true)}
                            >
                                <XCircle className="h-4 w-4" />
                                Anular Remito
                            </Button>
                        )}

                        {can('descargarPDF remitosSalida') && (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() => window.open(`/remitos-salida/${remito.id}/pdf`, '_blank')}
                            >
                                <Printer className="h-4 w-4 text-sky-600" />
                                Imprimir PDF Interno
                            </Button>
                        )}
                    </div>
                </div>

                {/* Aviso si el remito fue Anulado */}
                {remito.estado === 'ANULADO' && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Remito de Salida Anulado</AlertTitle>
                        <AlertDescription className="text-xs mt-1 whitespace-pre-line">
                            Las bolsas vinculadas a este despacho fueron liberadas y volvieron a estar disponibles en depósito.
                            {remito.observaciones && (
                                <span className="block mt-2 font-medium">{remito.observaciones}</span>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Sección de Conciliación (Formulario y Métricas) */}
                {remito.estado !== 'ANULADO' && (
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
                )}

                {/* Sección de Manifiesto Final (Visible una vez conciliado) */}
                {puedeGestionarManifiesto && (
                    <FormularioManifiestoFinal remito={remito} />
                )}

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
                                            {remito.estado === 'ANULADO'
                                                ? 'Las bolsas de este remito fueron desvinculadas al anular el despacho.'
                                                : 'No hay bolsas asociadas a este remito.'}
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
                                                    {ESTADO_BOLSA_LABELS[bolsa.estado] ?? bolsa.estado}
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

            {/* Modal de Confirmación de Anulación */}
            <ConfirmDeleteDialog
                open={modalAnularAbierto}
                onOpenChange={setModalAnularAbierto}
                title={`Anular Remito #${remito.numero_remito_interno}`}
                description={`Esta acción marcará el remito como ANULADO y liberará las ${bolsas.length} bolsa(s) asociadas para que vuelvan a estar disponibles en depósito.`}
                confirmLabel="Sí, anular remito"
                processingLabel="Anulando..."
                processing={formAnular.processing}
                confirmDisabled={formAnular.data.motivo_anulacion.trim().length < 5}
                onConfirm={handleConfirmarAnulacion}
            >
                <div className="space-y-2">
                    <Label htmlFor="motivo_anulacion">Motivo de Anulación *</Label>
                    <Textarea
                        id="motivo_anulacion"
                        rows={3}
                        placeholder="Ej: Error en la selección de bolsas / Retiro de DGM reprogramado..."
                        value={formAnular.data.motivo_anulacion}
                        onChange={(e) => formAnular.setData('motivo_anulacion', e.target.value)}
                        required
                    />
                    {formAnular.errors.motivo_anulacion && (
                        <p className="text-xs font-medium text-destructive">
                            {formAnular.errors.motivo_anulacion}
                        </p>
                    )}
                </div>
            </ConfirmDeleteDialog>
        </>
    );
}

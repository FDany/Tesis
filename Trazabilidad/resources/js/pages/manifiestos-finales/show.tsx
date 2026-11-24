import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ArrowLeft,
    FileCheck2,
    FileText,
    Calendar,
    Scale,
    Package,
    Truck,
    ExternalLink,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-react';
import FlashMessage from '@/components/FlashMessage';
import type { ManifiestoFinal } from '@/features/manifiestos-finales/types/manifiestoFinal';
import { useAuth } from '@/hooks/use-auth';
import { ESTADO_BOLSA_LABELS } from '@/features/bolsas/types/bolsa';

interface Props {
    manifiesto: ManifiestoFinal;
}

export default function ShowManifiestoFinal({ manifiesto }: Props) {
    const { can } = useAuth();

    const remito = manifiesto.remito_salida_retiro;
    const bolsas = remito?.bolsas || [];
    const pesoSistema = remito
        ? Number(remito.peso_total_sistema) || bolsas.reduce((acc, b) => acc + (Number(b.peso) || 0), 0)
        : 0;
    const pesoInformado = Number(manifiesto.peso_informado) || 0;
    const diferenciaPeso = pesoInformado - pesoSistema;
    const diferenciaBolsas = remito ? manifiesto.cantidad_bolsas - bolsas.length : 0;

    const formatearFecha = (fecha?: string | null) => {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
        });
    };

    const resumenPorServicio = Object.values(
        bolsas.reduce((acc, b) => {
            const nombre = b.remito_entrega_servicio?.servicio?.nombre || 'Depósito Central';
            if (!acc[nombre]) acc[nombre] = { nombre, cantidad: 0, peso: 0 };
            acc[nombre].cantidad += 1;
            acc[nombre].peso += Number(b.peso) || 0;
            return acc;
        }, {} as Record<string, { nombre: string; cantidad: number; peso: number }>)
    ).sort((a, b) => b.cantidad - a.cantidad);

    return (
        <>
            <Head title={`Manifiesto Final ${manifiesto.numero_manifiesto}`} />

            <div className="p-6 space-y-6">
                <FlashMessage />

                {/* Encabezado Principal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Link href="/manifiestos-finales">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <FileCheck2 className="h-6 w-6 text-emerald-600" />
                                Manifiesto Final #{manifiesto.numero_manifiesto}
                            </h1>
                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                                Disposición Certificada
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground pl-11">
                            Emitido el {formatearFecha(manifiesto.fecha)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {manifiesto.documento_oficial && can('descargarDocumento manifiestosFinales') && (
                            <Button
                                type="button"
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                onClick={() =>
                                    window.open(`/manifiestos-finales/${manifiesto.id}/documento`, '_blank')
                                }
                            >
                                <FileText className="h-4 w-4" />
                                Ver Certificado Digital
                            </Button>
                        )}
                    </div>
                </div>

                {/* Indicadores Clave */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Fecha de Tratamiento</p>
                                <p className="text-sm font-bold mt-0.5">{formatearFecha(manifiesto.fecha_tratamiento)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Bolsas Certificadas</p>
                                <p className="text-lg font-bold font-mono mt-0.5">
                                    {manifiesto.cantidad_bolsas}
                                    {remito && (
                                        <span className="text-xs font-normal text-muted-foreground ml-1.5">
                                            (Sistema: {bolsas.length})
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <Scale className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Peso Informado</p>
                                <p className="text-lg font-bold font-mono mt-0.5">
                                    {pesoInformado.toFixed(2)} Kg
                                    {remito && (
                                        <span className="text-xs font-normal text-muted-foreground ml-1.5">
                                            (Sist: {pesoSistema.toFixed(2)} Kg)
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                            <div
                                className={`p-2 rounded-lg ${diferenciaBolsas === 0 && Math.abs(diferenciaPeso) < 0.01
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-amber-50 text-amber-600'
                                    }`}
                            >
                                {diferenciaBolsas === 0 && Math.abs(diferenciaPeso) < 0.01 ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Control vs. Sistema</p>
                                <p className="text-sm font-bold mt-0.5">
                                    {diferenciaBolsas === 0 && Math.abs(diferenciaPeso) < 0.01
                                        ? 'Sin diferencias'
                                        : `${diferenciaBolsas >= 0 ? '+' : ''}${diferenciaBolsas} bolsas / ${diferenciaPeso >= 0 ? '+' : ''
                                        }${diferenciaPeso.toFixed(2)} Kg`}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Datos del Certificado y Remito de Salida Origen */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                                Datos del Manifiesto Final
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-muted-foreground">Número de Manifiesto</span>
                                <span className="font-mono font-bold">{manifiesto.numero_manifiesto}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-muted-foreground">Fecha de Emisión</span>
                                <span className="font-medium">{formatearFecha(manifiesto.fecha)}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-muted-foreground">Fecha de Tratamiento</span>
                                <span className="font-medium">{formatearFecha(manifiesto.fecha_tratamiento)}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b">
                                <span className="text-muted-foreground">Archivo Adjunto</span>
                                <span className="font-medium truncate max-w-60">
                                    {manifiesto.documento_oficial?.nombre_archivo || 'No adjunto'}
                                </span>
                            </div>
                            {manifiesto.observaciones && (
                                <div className="pt-1">
                                    <span className="text-muted-foreground block mb-1">Observaciones</span>
                                    <p className="p-2.5 rounded-md bg-muted/50 text-foreground whitespace-pre-line">
                                        {manifiesto.observaciones}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-sky-600" />
                                    Remito de Salida Vinculado
                                </span>
                                {remito && can('verDetalle remitosSalida') && (
                                    <Link href={`/remitos-salida/${remito.id}`}>
                                        <Button variant="outline" size="sm" className="gap-1.5 h-8">
                                            Ver Remito
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {remito ? (
                                <>
                                    <div className="flex justify-between py-1.5 border-b">
                                        <span className="text-muted-foreground">Remito Interno</span>
                                        <span className="font-mono font-bold">#{remito.numero_remito_interno}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b">
                                        <span className="text-muted-foreground">Remito DGM (Empresa)</span>
                                        <span className="font-mono font-medium">{remito.numero_remito || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b">
                                        <span className="text-muted-foreground">Responsable Empresa</span>
                                        <span className="font-medium">{remito.responsable_empresa || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b">
                                        <span className="text-muted-foreground">Transporte</span>
                                        <span className="font-medium">{remito.datos_transporte || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5">
                                        <span className="text-muted-foreground">Estado del Remito</span>
                                        <Badge className="bg-emerald-600 hover:bg-emerald-700">{remito.estado}</Badge>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground py-6 text-center">
                                    No se encontró información del remito de salida vinculado.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>


                {/* Resumen por Servicio de Origen */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            Origen de las Bolsas por Servicio
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead className="text-center">Cantidad de Bolsas</TableHead>
                                    <TableHead className="text-right">Peso Total (Kg)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resumenPorServicio.map((s) => (
                                    <TableRow key={s.nombre}>
                                        <TableCell className="font-medium">{s.nombre}</TableCell>
                                        <TableCell className="text-center font-mono">{s.cantidad}</TableCell>
                                        <TableCell className="text-right font-mono font-semibold">
                                            {s.peso.toFixed(2)} Kg
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>



                {/* Tabla de Bolsas Incluidas en la Disposición Final */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                Bolsas Incluidas en el Lote ({bolsas.length})
                            </div>
                            <span className="text-sm font-normal text-muted-foreground">
                                Peso Total Sistema: <strong className="text-foreground">{pesoSistema.toFixed(2)} Kg</strong>
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código de Barras</TableHead>
                                    <TableHead>Tipo de Residuo</TableHead>
                                    <TableHead>Servicio de Origen</TableHead>
                                    <TableHead className="text-right">Peso (Kg)</TableHead>
                                    <TableHead className="text-center">Estado Bolsa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bolsas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No hay bolsas registradas en el remito vinculado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bolsas.map((bolsa) => (
                                        <TableRow key={bolsa.id}>
                                            <TableCell className="font-mono font-bold">{bolsa.codigo_barra}</TableCell>
                                            <TableCell>{bolsa.tipo_bolsa?.tipo_residuo || 'General'}</TableCell>
                                            <TableCell>
                                                {bolsa.remito_entrega_servicio?.servicio?.nombre || 'Depósito Central'}
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-semibold">
                                                {Number(bolsa.peso).toFixed(2)} Kg
                                            </TableCell>
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
        </>
    );
}

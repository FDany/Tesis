import React, { FormEvent, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck2, FileUp, ExternalLink, Calendar, Scale, Package, FileText } from 'lucide-react';
import type { RemitoSalidaRetiro } from '@/features/remitos-salida/types/remitoSalidaRetiro';
import type { CreateManifiestoFinalDTO } from '../types/manifiestoFinal';

interface Props {
    remito: RemitoSalidaRetiro;
}

export function FormularioManifiestoFinal({ remito }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const manifiesto = remito.manifiesto_final;

    const hoy = new Date().toISOString().slice(0, 10);
    const cantidadPorDefecto =
        remito.cantidad_bolsas_declaradas_Empresa ?? remito.cantidad_bolsas_sistema ?? 0;

    const { data, setData, post, processing, errors, reset } = useForm<CreateManifiestoFinalDTO>({
        numero_manifiesto: '',
        fecha: hoy,
        fecha_tratamiento: hoy,
        cantidad_bolsas: cantidadPorDefecto,
        peso_informado: remito.peso_total_sistema ? Number(remito.peso_total_sistema).toFixed(2) : '',
        observaciones: '',
        documento: null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/remitos-salida/${remito.id}/manifiesto-final`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    // VISTA DE SOLO LECTURA: Ya tiene Manifiesto Final cargado
    if (manifiesto) {
        const doc = manifiesto.documento_oficial;

        return (
            <Card className="shadow-sm border-emerald-500/30">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                                Manifiesto Final y Disposición Registrado
                            </CardTitle>
                            <CardDescription>
                                Certificación oficial de tratamiento y disposición final emitida por DGM.
                            </CardDescription>
                        </div>
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 w-fit">
                            Certificado N° {manifiesto.numero_manifiesto}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border bg-muted/30 p-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" /> Fecha Manifiesto
                            </p>
                            <p className="font-semibold text-sm">
                                {new Date(manifiesto.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" /> Fecha Tratamiento
                            </p>
                            <p className="font-semibold text-sm">
                                {new Date(manifiesto.fecha_tratamiento).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Package className="h-3.5 w-3.5" /> Bolsas Tratadas
                            </p>
                            <p className="font-semibold text-sm">{manifiesto.cantidad_bolsas} bolsas</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Scale className="h-3.5 w-3.5" /> Peso Certificado
                            </p>
                            <p className="font-semibold text-sm">{Number(manifiesto.peso_informado).toFixed(2)} kg</p>
                        </div>
                    </div>

                    {manifiesto.observaciones && (
                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Observaciones: </span>
                            <span>{manifiesto.observaciones}</span>
                        </div>
                    )}

                    {doc && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3 bg-card">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <FileText className="h-5 w-5 text-primary shrink-0" />
                                <div className="truncate">
                                    <p className="text-sm font-medium truncate">{doc.nombre_archivo}</p>
                                    <p className="text-xs text-muted-foreground">Documento digital adjunto</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2 shrink-0"
                                onClick={() => window.open(`/storage/${doc.url_archivo}`, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4" />
                                Ver / Descargar Certificado
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // FORMULARIO DE CARGA: Remito conciliado pendiente de manifiesto final
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-primary" />
                    Registrar Manifiesto Final (Disposición DGM)
                </CardTitle>
                <CardDescription>
                    Complete los datos del certificado de tratamiento final proporcionado por DGM y adjunte el respaldo digital.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="numero_manifiesto">N° Manifiesto Final *</Label>
                            <Input
                                id="numero_manifiesto"
                                placeholder="Ej: MF-2026-00142"
                                value={data.numero_manifiesto}
                                onChange={(e) => setData('numero_manifiesto', e.target.value)}
                                required
                            />
                            {errors.numero_manifiesto && (
                                <p className="text-xs font-medium text-destructive">{errors.numero_manifiesto}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fecha">Fecha de Emisión Manifiesto *</Label>
                            <Input
                                id="fecha"
                                type="date"
                                value={data.fecha}
                                onChange={(e) => setData('fecha', e.target.value)}
                                required
                            />
                            {errors.fecha && (
                                <p className="text-xs font-medium text-destructive">{errors.fecha}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fecha_tratamiento">Fecha de Tratamiento / Disposición *</Label>
                            <Input
                                id="fecha_tratamiento"
                                type="date"
                                value={data.fecha_tratamiento}
                                onChange={(e) => setData('fecha_tratamiento', e.target.value)}
                                required
                            />
                            {errors.fecha_tratamiento && (
                                <p className="text-xs font-medium text-destructive">{errors.fecha_tratamiento}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cantidad_bolsas_mf">Cantidad de Bolsas Tratadas *</Label>
                            <Input
                                id="cantidad_bolsas_mf"
                                type="number"
                                min="1"
                                value={data.cantidad_bolsas || ''}
                                onChange={(e) => setData('cantidad_bolsas', Number(e.target.value))}
                                required
                            />
                            {errors.cantidad_bolsas && (
                                <p className="text-xs font-medium text-destructive">{errors.cantidad_bolsas}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="peso_informado">Peso Informado (Kg) *</Label>
                            <Input
                                id="peso_informado"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="Ej: 45.50"
                                value={data.peso_informado}
                                onChange={(e) => setData('peso_informado', e.target.value)}
                                required
                            />
                            {errors.peso_informado && (
                                <p className="text-xs font-medium text-destructive">{errors.peso_informado}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="documento_mf">Archivo Digital (PDF / Imagen) *</Label>
                            <Input
                                id="documento_mf"
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setData('documento', e.target.files?.[0] ?? null)}
                                required
                            />
                            {errors.documento && (
                                <p className="text-xs font-medium text-destructive">{errors.documento}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones_mf">Observaciones del Manifiesto</Label>
                        <Textarea
                            id="observaciones_mf"
                            rows={2}
                            placeholder="Notas adicionales sobre el certificado de disposición final..."
                            value={data.observaciones}
                            onChange={(e) => setData('observaciones', e.target.value)}
                        />
                        {errors.observaciones && (
                            <p className="text-xs font-medium text-destructive">{errors.observaciones}</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={processing}>
                            <FileUp className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando Manifiesto...' : 'Registrar Manifiesto Final'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

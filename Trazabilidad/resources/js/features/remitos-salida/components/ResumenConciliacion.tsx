import React, { FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    AlertTriangle,
    Scale,
    PackageCheck,
    FileText,
    CheckSquare,
    Calendar,
    UserCheck,
    Truck,
    Hash,
} from 'lucide-react';
import type { ConciliarRemitoSalidaRetiroDTO, RemitoSalidaRetiro } from '../types/remitoSalidaRetiro';
import { useAuth } from '@/hooks/use-auth';

interface Props {
    remito: RemitoSalidaRetiro;
    data: ConciliarRemitoSalidaRetiroDTO;
    setData: (key: keyof ConciliarRemitoSalidaRetiroDTO, value: any) => void;
    errors: Partial<Record<keyof ConciliarRemitoSalidaRetiroDTO, string>>;
    processing: boolean;
    onSubmit: (e: FormEvent) => void;
}

export function ResumenConciliacion({
    remito,
    data,
    setData,
    errors,
    processing,
    onSubmit,
}: Props) {
    const { can } = useAuth();
    const esPendiente = remito.estado === 'PENDIENTE_RETIRO';

    const cantidadSistema = remito.cantidad_bolsas_sistema || remito.bolsas_count || 0;
    const pesoSistema = Number(remito.peso_total_sistema || 0);
    const cantidadDgm = esPendiente
        ? (data.cantidad_bolsas_declaradas_Empresa || 0)
        : (remito.cantidad_bolsas_declaradas_Empresa ?? 0);

    const coincide = cantidadSistema === cantidadDgm;
    const diferencia = cantidadSistema - cantidadDgm;

    const renderTarjetasMetricas = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Cantidad Sistema</p>
                        <p className="text-2xl font-bold">
                            {cantidadSistema}{' '}
                            <span className="text-sm font-normal text-muted-foreground">bolsas</span>
                        </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <PackageCheck className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Peso Total Sistema</p>
                        <p className="text-2xl font-bold">
                            {pesoSistema.toFixed(2)}{' '}
                            <span className="text-sm font-normal text-muted-foreground">kg</span>
                        </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Scale className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">Declarado por DGM</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">
                                {cantidadDgm}{' '}
                                <span className="text-sm font-normal text-muted-foreground">bolsas</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <FileText className="h-5 w-5" />
                        </div>
                        {cantidadDgm > 0 && (
                            <Badge variant={coincide ? 'default' : 'destructive'} className="text-[10px]">
                                {coincide ? 'Coincide' : `Dif: ${diferencia}`}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // VISTA DE SOLO LECTURA: El remito ya fue conciliado (o anulado)
    if (!esPendiente) {
        return (
            <div className="space-y-6">
                {renderTarjetasMetricas()}

                {remito.estado !== 'ANULADO' && (
                    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold tracking-tight text-foreground">
                                Datos Registrados del Remito Oficial DGM
                            </h3>
                            <Badge variant="outline" className="text-xs">
                                Retiro Conciliado
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Hash className="h-3.5 w-3.5" /> N° Remito DGM
                                </p>
                                <p className="font-mono font-semibold text-sm">
                                    {remito.numero_remito || '—'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" /> Fecha y Hora de Retiro
                                </p>
                                <p className="font-semibold text-sm">
                                    {remito.fecha_retiro
                                        ? new Date(remito.fecha_retiro).toLocaleString('es-AR', {
                                              dateStyle: 'short',
                                              timeStyle: 'short',
                                          })
                                        : '—'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <UserCheck className="h-3.5 w-3.5" /> Responsable DGM
                                </p>
                                <p className="font-semibold text-sm">
                                    {remito.responsable_empresa || '—'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Truck className="h-3.5 w-3.5" /> Transporte
                                </p>
                                <p className="font-semibold text-sm">
                                    {remito.datos_transporte || 'No especificado'}
                                </p>
                            </div>
                        </div>

                        {remito.observaciones && (
                            <div className="pt-2 border-t text-sm">
                                <span className="font-medium text-muted-foreground">Observaciones: </span>
                                <span>{remito.observaciones}</span>
                            </div>
                        )}
                    </div>
                )}

                {remito.estado === 'CON_INCIDENCIA' && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Conciliado con Discrepancia</AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                            Se registró una diferencia de <strong>{Math.abs(diferencia)} bolsa(s)</strong> respecto al despacho interno.{' '}
                            {remito.incidencia && (
                                <>
                                    Incidencia asociada N° <strong>#{remito.incidencia.id}</strong> (Estado:{' '}
                                    <strong>{remito.incidencia.estado}</strong>).
                                </>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        );
    }

    // VISTA EDITABLE: Remito pendiente de retiro / conciliación
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {renderTarjetasMetricas()}

            {/* Formulario de Entrada de Datos del Manifiesto DGM */}
            <div className="space-y-4 rounded-lg border p-4 bg-card">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Datos del Remito Oficial de DGM
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="numero_remito">N° / Código Remito DGM *</Label>
                        <Input
                            id="numero_remito"
                            placeholder="Ej: 0001-00045892"
                            value={data.numero_remito}
                            onChange={(e) => setData('numero_remito', e.target.value)}
                            required
                        />
                        {errors.numero_remito && (
                            <p className="text-xs font-medium text-destructive">{errors.numero_remito}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fecha_retiro">Fecha y Hora de Retiro *</Label>
                        <Input
                            id="fecha_retiro"
                            type="datetime-local"
                            value={data.fecha_retiro}
                            onChange={(e) => setData('fecha_retiro', e.target.value)}
                            required
                        />
                        {errors.fecha_retiro && (
                            <p className="text-xs font-medium text-destructive">{errors.fecha_retiro}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cantidad_declarada">Cant. Bolsas Declaradas DGM *</Label>
                        <Input
                            id="cantidad_declarada"
                            type="number"
                            min="1"
                            placeholder="Ej: 10"
                            value={data.cantidad_bolsas_declaradas_Empresa || ''}
                            onChange={(e) => setData('cantidad_bolsas_declaradas_Empresa', Number(e.target.value))}
                            required
                        />
                        {errors.cantidad_bolsas_declaradas_Empresa && (
                            <p className="text-xs font-medium text-destructive">
                                {errors.cantidad_bolsas_declaradas_Empresa}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="responsable_empresa">Responsable DGM (Chofer/Retira) *</Label>
                        <Input
                            id="responsable_empresa"
                            placeholder="Nombre y apellido del chofer"
                            value={data.responsable_empresa}
                            onChange={(e) => setData('responsable_empresa', e.target.value)}
                            required
                        />
                        {errors.responsable_empresa && (
                            <p className="text-xs font-medium text-destructive">{errors.responsable_empresa}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="datos_transporte">Datos del Transporte (Patente/Dominio)</Label>
                        <Input
                            id="datos_transporte"
                            placeholder="Ej: AB 123 CD - Transporte San Bernardo"
                            value={data.datos_transporte || ''}
                            onChange={(e) => setData('datos_transporte', e.target.value)}
                        />
                        {errors.datos_transporte && (
                            <p className="text-xs font-medium text-destructive">{errors.datos_transporte}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones de Conciliación</Label>
                    <Textarea
                        id="observaciones"
                        placeholder="Aclaraciones sobre el retiro o motivo de discrepancia..."
                        rows={2}
                        value={data.observaciones || ''}
                        onChange={(e) => setData('observaciones', e.target.value)}
                    />
                    {errors.observaciones && (
                        <p className="text-xs font-medium text-destructive">{errors.observaciones}</p>
                    )}
                </div>
            </div>

            {/* Alerta Evaluativa de Estado de Conciliación */}
            {cantidadDgm > 0 &&
                (coincide ? (
                    <Alert className="border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Conciliación Correcta</AlertTitle>
                        <AlertDescription className="text-xs mt-1 text-green-700 dark:text-green-300">
                            La cantidad de bolsas escaneadas coincide perfectamente con la cantidad declarada en el remito de DGM.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Se generará una Incidencia Automática</AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                            Existe una diferencia de <strong>{Math.abs(diferencia)} bolsa(s)</strong> entre el remito interno (
                            {cantidadSistema}) y lo declarado por DGM ({cantidadDgm}). Se registrará una incidencia de tipo{' '}
                            <code className="rounded bg-destructive/20 px-1 py-0.5 font-mono font-semibold">
                                DIFERENCIA_CONCILIACION_DGM
                            </code>
                            .
                        </AlertDescription>
                    </Alert>
                ))}

            <div className="flex justify-end pt-2">
                {can('conciliar remitosSalida') && (
                    <Button type="submit" size="lg" disabled={processing || cantidadDgm <= 0}>
                        <CheckSquare className="mr-2 h-5 w-5" /> Conciliar y Cerrar Retiro DGM
                    </Button>
                )}
            </div>
        </form>
    );
}

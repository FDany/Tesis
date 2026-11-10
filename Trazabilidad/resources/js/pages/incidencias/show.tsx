// resources/js/pages/incidencias/show.tsx

import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IncidenciaBadge } from '@/features/incidencias/components/IncidenciaBadge';
import { ResolverIncidenciaModal } from '@/features/incidencias/components/ResolverIncidenciaModal';
import { ArrowLeft, CheckSquare, Calendar, User as UserIcon, FileText, AlertCircle, Package, Image as ImageIcon, Building2 } from 'lucide-react';
import type { Incidencia } from '@/features/incidencias/types/incidencia';
import type { User } from '@/types/auth';

interface Props {
    incidencia: Incidencia;
}

export default function IncidenciaShow({ incidencia }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper para concatenar first_name y last_name
    const obtenerNombreUsuario = (usuario?: number | User | null): string => {
        if (!usuario || typeof usuario !== 'object') return 'Sistema';

        const firstName = usuario.first_name || '';
        const lastName = usuario.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || 'Sistema';
    };

    return (
        <div>
            <Head title={`Incidencia #${incidencia.id}`} />

            <div className="space-y-6 p-6 max-w-5xl mx-auto">
                {/* Header principal */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/incidencias">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">Incidencia #{incidencia.id}</h1>
                                <IncidenciaBadge estado={incidencia.estado} />
                            </div>
                            <p className="text-xs font-mono font-semibold text-muted-foreground mt-0.5">
                                Tipo: {incidencia.tipo_incidencia}
                            </p>
                        </div>
                    </div>

                    {incidencia.estado !== 'CERRADA' && (
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-sky-600 hover:bg-sky-700 text-white">
                            <CheckSquare className="h-4 w-4" />
                            Resolver / Actualizar
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Columna Izquierda (2 Cols): Descripción, Evidencia y Resolución */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Descripción */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    Descripción de la Incidencia
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-lg bg-muted/50 border text-sm leading-relaxed whitespace-pre-wrap">
                                    {incidencia.descripcion || 'Sin descripción detallada.'}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Evidencia Fotográfica / Adjuntos Polimórficos */}
                        {incidencia.documentos && incidencia.documentos.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-sky-600" />
                                        Evidencia Adjunta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {incidencia.documentos.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="overflow-hidden rounded-lg border bg-background"
                                            >

                                                {doc.tipo_documento === 'pdf' ? (
                                                    <a
                                                        href={`/storage/${doc.url_archivo}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-4 text-sm text-primary hover:underline"
                                                    >
                                                        <FileText className="h-5 w-5 shrink-0" />
                                                        Abrir PDF: {doc.nombre_archivo}
                                                    </a>
                                                ) : (
                                                    <a
                                                        href={`/storage/${doc.url_archivo}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={`/storage/${doc.url_archivo}`}
                                                            alt={doc.nombre_archivo || 'Evidencia'}
                                                            className="h-48 w-full object-cover transition-opacity hover:opacity-90"
                                                        />
                                                    </a>
                                                )}
                                                <div className="p-2 text-xs text-muted-foreground truncate border-t bg-muted/20">
                                                    {doc.nombre_archivo}
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Acción Adoptada */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <CheckSquare className="h-5 w-5 text-green-600" />
                                    Acción Adoptada y Resolución
                                </CardTitle>
                                <CardDescription>
                                    Acciones correctivas registradas para la resolución o cierre.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {incidencia.accion_adoptada ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-sm leading-relaxed text-green-950 dark:text-green-200 whitespace-pre-wrap">
                                            {incidencia.accion_adoptada}
                                        </div>
                                        {incidencia.fecha_resolucion && (
                                            <p className="text-xs text-muted-foreground text-right">
                                                Resuelto el:{' '}
                                                {new Date(incidencia.fecha_resolucion).toLocaleString('es-AR', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Aún no se han registrado acciones adoptadas para esta incidencia.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna Derecha (1 Col): Metadatos y Origen */}
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Información del Registro</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Fecha y Hora</p>
                                        <p className="font-medium">
                                            {new Date(incidencia.fecha_hora).toLocaleString('es-AR', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Registrado por</p>
                                        <p className="font-medium">
                                            {obtenerNombreUsuario(incidencia.usuario_registra)}
                                        </p>
                                    </div>
                                </div>

                                {incidencia.usuario_cierra && (
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="h-4 w-4 text-green-600 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Resuelto por</p>
                                            <p className="font-medium">
                                                {obtenerNombreUsuario(incidencia.usuario_cierra)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Referencia Origen */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">Origen Asociado</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {incidencia.servicio && (
                                    <div className="p-3 border rounded-lg bg-background flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Servicio</p>
                                            <p className="font-bold text-xs">{incidencia.servicio.nombre}</p>
                                        </div>
                                    </div>
                                )}

                                {incidencia.remito_salida_retiro && (
                                    <div className="p-3 border rounded-lg bg-background flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Remito Salida DGM</p>
                                                <p className="font-bold">#{incidencia.remito_salida_retiro.numero_remito}</p>
                                            </div>
                                        </div>
                                        <Link href="/remitos-salida">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                Ver
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {incidencia.bolsa && (
                                    <div className="p-3 border rounded-lg bg-background flex items-center gap-2">
                                        <Package className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Bolsa</p>
                                            <p className="font-mono font-bold text-xs">{incidencia.bolsa.codigo_barra}</p>
                                        </div>
                                    </div>
                                )}

                                {incidencia.codigo_no_registrado && (
                                    <div className="p-3 border rounded-lg bg-amber-500/10 border-amber-500/20 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                        <div>
                                            <p className="text-xs text-amber-800 dark:text-amber-300">Código Observado (No Reg.)</p>
                                            <p className="font-mono font-bold text-xs text-amber-950 dark:text-amber-200">
                                                {incidencia.codigo_no_registrado}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!incidencia.remito_salida_retiro && !incidencia.bolsa && !incidencia.servicio && !incidencia.codigo_no_registrado && (
                                    <p className="text-xs text-muted-foreground italic">
                                        Sin origen específico vinculado.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Modal para Resolver */}
                <ResolverIncidenciaModal
                    incidencia={incidencia}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />
            </div>
        </div>
    );
}

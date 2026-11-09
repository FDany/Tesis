import React, { ChangeEvent, FormEvent } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Image as ImageIcon, X, Paperclip } from 'lucide-react';

// Reutilización de tus tipos definidos por dominios
import { Servicio } from '@/features/servicios/types/servicio';
import { TipoBolsa } from '@/features/tipos-bolsa/types/tipoBolsa';

interface PageProps {
    [key: string]: unknown;
    tiposManuales: Record<string, string>;
    servicios: Servicio[];
    tiposBolsa: TipoBolsa[];
    errors: Record<string, string>;
}

export default function CreateIncidencia() {
    const { tiposManuales, servicios, tiposBolsa } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        tipo_incidencia: '',
        descripcion: '',
        bolsa_id: '',
        codigo_no_registrado: '',
        servicio_id: '',
        tipo_bolsa_id: '',
        documentos: [] as File[], // Arreglo para la carga múltiple
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/incidencias', {
            forceFormData: true, // Necesario para procesar el envío del array de archivos (FormData)
        });
    };

    // Agregar nuevos archivos seleccionados sin sobrescribir los anteriores
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const nuevosArchivos = Array.from(e.target.files);
            setData('documentos', [...data.documentos, ...nuevosArchivos]);
            // Limpiamos el valor del input para poder re-seleccionar el mismo archivo si fuese necesario
            e.target.value = '';
        }
    };

    // Quitar un archivo individual de la lista
    const handleRemoveFile = (index: number) => {
        const filtrados = data.documentos.filter((_, i) => i !== index);
        setData('documentos', filtrados);
    };

    return (
        <div>
            <Head title="Registrar Incidencia Manual" />

            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Registrar Incidencia Manual</h1>
                        <p className="text-sm text-gray-600">
                            Reporte de imprevistos, discrepancias o anomalías operativas en la trazabilidad.
                        </p>
                    </div>
                    <Link
                        href="/incidencias"
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
                    >
                        Cancelar / Volver
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Formulario de Reporte</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 1. Tipo de Incidencia */}
                            <div className="space-y-2">
                                <Label htmlFor="tipo_incidencia">Tipo de Incidencia *</Label>
                                <Select
                                    value={data.tipo_incidencia}
                                    onValueChange={(val) => setData('tipo_incidencia', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el tipo de incidencia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(tiposManuales).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tipo_incidencia && (
                                    <p className="text-sm text-red-600">{errors.tipo_incidencia}</p>
                                )}
                            </div>

                            {/* Campos Dinámicos según la incidencia elegida */}

                            {/* Caso C: Código No Registrado */}
                            {data.tipo_incidencia === 'CODIGO_NO_REGISTRADO' && (
                                <div className="space-y-2">
                                    <Label htmlFor="codigo_no_registrado">Código Físico Observado *</Label>
                                    <Input
                                        id="codigo_no_registrado"
                                        type="text"
                                        placeholder="Ej: 003587"
                                        value={data.codigo_no_registrado}
                                        onChange={(e) => setData('codigo_no_registrado', e.target.value)}
                                    />
                                    {errors.codigo_no_registrado && (
                                        <p className="text-sm text-red-600">{errors.codigo_no_registrado}</p>
                                    )}
                                </div>
                            )}

                            {/* Casos D y J: Servicio / Tipo de Bolsa */}
                            {['BOLSA_SIN_ENTREGA', 'BOLSA_SIN_SERVICIO'].includes(data.tipo_incidencia) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="servicio_id">Servicio u Origen Detectado</Label>
                                        <Select
                                            value={data.servicio_id}
                                            onValueChange={(val) => setData('servicio_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione el servicio" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {servicios.map((servicio) => (
                                                    <SelectItem key={servicio.id} value={String(servicio.id)}>
                                                        {servicio.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.servicio_id && (
                                            <p className="text-sm text-red-600">{errors.servicio_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tipo_bolsa_id">Tipo de Bolsa / Residuo</Label>
                                        <Select
                                            value={data.tipo_bolsa_id}
                                            onValueChange={(val) => setData('tipo_bolsa_id', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione el tipo de residuo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tiposBolsa.map((tb) => (
                                                    <SelectItem key={tb.id} value={String(tb.id)}>
                                                        {tb.tipo_residuo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.tipo_bolsa_id && (
                                            <p className="text-sm text-red-600">{errors.tipo_bolsa_id}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Adjuntar Documentos / Evidencias (Múltiples) */}
                            <div className="space-y-3">
                                <Label htmlFor="documentos" className="flex items-center gap-1.5">
                                    <Paperclip className="h-4 w-4 text-sky-600" />
                                    Adjuntar Documentos / Evidencias (Opcional)
                                </Label>

                                <Input
                                    id="documentos"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,application/pdf"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Permite seleccionar múltiples fotos (JPG, PNG, WEBP) o documentos (PDF) de hasta 5MB cada uno.
                                </p>

                                {/* Errores de validación generales o de ítem específico */}
                                {errors.documentos && (
                                    <p className="text-sm text-red-600">{errors.documentos}</p>
                                )}
                                {Object.entries(errors)
                                    .filter(([key]) => key.startsWith('documentos.'))
                                    .map(([key, mensaje]) => (
                                        <p key={key} className="text-sm text-red-600">
                                            {mensaje}
                                        </p>
                                    ))}

                                {/* Lista interactiva de archivos adjuntados */}
                                {data.documentos.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs font-semibold text-gray-700">
                                            Archivos seleccionados ({data.documentos.length}):
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {data.documentos.map((file, idx) => {
                                                const esPdf = file.type === 'application/pdf';
                                                return (
                                                    <div
                                                        key={`${file.name}-${idx}`}
                                                        className="flex items-center justify-between p-2.5 rounded-md border bg-muted/30 text-xs"
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                                                            {esPdf ? (
                                                                <FileText className="h-4 w-4 text-red-500 shrink-0" />
                                                            ) : (
                                                                <ImageIcon className="h-4 w-4 text-sky-500 shrink-0" />
                                                            )}
                                                            <div className="truncate">
                                                                <p className="font-medium truncate">{file.name}</p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-gray-500 hover:text-red-600 shrink-0"
                                                            onClick={() => handleRemoveFile(idx)}
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Descripción u Observación */}
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción de la Incidencia *</Label>
                                <Textarea
                                    id="descripcion"
                                    rows={4}
                                    placeholder="Describa detalladamente la situación detectada..."
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-red-600">{errors.descripcion}</p>
                                )}
                            </div>

                            {/* Botón de Envío */}
                            <div className="flex justify-end pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-sky-600 hover:bg-sky-700 text-white"
                                >
                                    {processing ? 'Guardando...' : 'Registrar Incidencia'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

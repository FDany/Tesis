import { Head, router } from '@inertiajs/react';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import type { Tamanio } from '@/features/tamanios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { ESTADO_BOLSA_LABELS } from '@/features/bolsas/types/bolsa';

interface CrearProps {
    tiposBolsa: TipoBolsa[];
    tamanios: Tamanio[];
}

interface FormularioRemito {
    fecha_recepcion: string;
    tipo_bolsa_id: string;
    tamanio_id: string;
    cantidad_declarada: string;
    codigo_inicio: string;
    codigo_fin: string;
    observaciones: string;
}

interface BolsaVistaPrevia {
    codigo_barra: string;
}

interface VistaPrevia {
    remito: FormularioRemito;
    bolsas: BolsaVistaPrevia[];
}

export default function Crear({ tiposBolsa, tamanios }: CrearProps) {
    const [errorBolsa, setErrorBolsa] = useState('');
    //**************************************************************

    const [formulario, setFormulario] = useState<FormularioRemito>({
        fecha_recepcion: '',
        tipo_bolsa_id: '',
        tamanio_id: '',
        cantidad_declarada: '',
        codigo_inicio: '',
        codigo_fin: '',
        observaciones: '',
    });

    const [vistaPrevia, setVistaPrevia] = useState<VistaPrevia | null>(null);
    const [error, setError] = useState('');

    const [documento, setDocumento] = useState<File | null>(null);
    const generarBolsas = () => {
        const inicio = formulario.codigo_inicio.split('-');
        const fin = formulario.codigo_fin.split('-');

        if (inicio.length !== 2 || fin.length !== 2) {
            setError('Formato de código inválido. Use XXXX-XXXXXXXXX');
            return;
        }

        const numeroInicio = parseInt(inicio[1]);
        const numeroFin = parseInt(fin[1]);
        const cantidad = numeroFin - numeroInicio + 1;

        if (cantidad <= 0) {
            setError('El código de inicio debe ser menor al código de fin');
            return;
        }

        if (cantidad !== Number(formulario.cantidad_declarada)) {
            setError(
                `La cantidad declarada (${formulario.cantidad_declarada}) no coincide con el rango de códigos (${cantidad})`,
            );
            return;
        }
  
        setError('');
        setErrorBolsa('');

        const prefijo = inicio[1].padStart(4, '0');
        const bolsas = Array.from({ length: cantidad }, (_, index) => ({
            codigo_barra:
                prefijo + String(numeroInicio + index).padStart(9, '0'),
        }));

        setVistaPrevia({ remito: { ...formulario }, bolsas });
    };


    const tipoBolsaSeleccionado = tiposBolsa.find(
        (tipo) => String(tipo.id) === vistaPrevia?.remito.tipo_bolsa_id,
    );

    const guardarRemito = () => {
        //if (!vistaPrevia || !modoCarga) return;
        if (!vistaPrevia) return;

        const cantidad = Number(vistaPrevia.remito.cantidad_declarada);

        if (vistaPrevia.bolsas.length !== cantidad) {
            setErrorBolsa('Debes completar la cantidad declarada de bolsas.');
            return;
        }

        setErrorBolsa('');

        const payload: Record<string, any> = {
            ...vistaPrevia.remito,
            codigos: vistaPrevia.bolsas.map((bolsa) => bolsa.codigo_barra),
        };

        if (documento) {
            payload.documento = documento;
        }

        router.post('/remitos-recepcion', payload, {
            forceFormData: true,
            onError: (errors) => {
                setErrorBolsa(Object.values(errors).join(' '));
            },
        });
    };


    return (
        <>
            <Head title="Nuevo Remito de Recepción" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Nuevo Remito de Recepción
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Completa los datos del remito y revisa las bolsas antes de guardar.
                    </p>
                </div>
                {!vistaPrevia && (
                    <>
                        <section className="space-y-4 rounded-md border p-4">
                            <h2 className="text-lg font-semibold">Datos del remito</h2>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_recepcion">Fecha de recepción</Label>
                                    <Input
                                        id="fecha_recepcion"
                                        type="datetime-local"
                                        value={formulario.fecha_recepcion}
                                        onChange={(e) =>
                                            setFormulario({ ...formulario, fecha_recepcion: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo_bolsa_id">Tipo de bolsa</Label>

                                    <Select
                                        value={formulario.tipo_bolsa_id}
                                        onValueChange={(value) =>
                                            setFormulario({ ...formulario, tipo_bolsa_id: value })
                                        }
                                    >
                                        <SelectTrigger
                                            id="tipo_bolsa_id"
                                            className="h-10 w-full"
                                        >
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {tiposBolsa.map((tipo) => (

                                                <SelectItem key={tipo.id} value={String(tipo.id)}>
                                                    <span className="flex items-center gap-2">
                                                        <span
                                                            className="size-4 shrink-0 rounded-full border"
                                                            style={{ backgroundColor: tipo.color }}
                                                            aria-label={`Color ${tipo.color}`}
                                                        />
                                                        {tipo.tipo_residuo}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tamanio_id">Tamaño</Label>

                                    <Select
                                        value={formulario.tamanio_id}
                                        onValueChange={(value) =>
                                            setFormulario({ ...formulario, tamanio_id: value })
                                        }
                                    >
                                        <SelectTrigger id="tamanio_id" className="h-10 w-full">
                                            <SelectValue placeholder="Seleccionar tamaño" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {tamanios.map((tamanio) => (
                                                <SelectItem key={tamanio.id} value={String(tamanio.id)}>
                                                    {tamanio.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cantidad_declarada">Cantidad declarada</Label>
                                    <Input
                                        id="cantidad_declarada"
                                        type="number"
                                        min="1"
                                        placeholder="Ej: 100"
                                        value={formulario.cantidad_declarada}
                                        onChange={(e) =>
                                            setFormulario({ ...formulario, cantidad_declarada: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="codigo_inicio">Código inicial</Label>
                                    <Input
                                        id="codigo_inicio"
                                        placeholder="Ej: 3-39836"
                                        value={formulario.codigo_inicio}
                                        onChange={(e) =>
                                            setFormulario({ ...formulario, codigo_inicio: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="codigo_fin">Código final</Label>
                                    <Input
                                        id="codigo_fin"
                                        placeholder="Ej: 3-39935"
                                        value={formulario.codigo_fin}
                                        onChange={(e) =>
                                            setFormulario({ ...formulario, codigo_fin: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <textarea
                                        id="observaciones"
                                        rows={3}
                                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        placeholder="Detalles o notas adicionales sobre el remito..."
                                        value={formulario.observaciones}
                                        onChange={(e) =>
                                            setFormulario({ ...formulario, observaciones: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="documento">Documento respaldatorio (opcional)</Label>
                                    <Input
                                        id="documento"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                        onChange={(e) => {
                                            const archivo = e.target.files?.[0] ?? null;
                                            setDocumento(archivo);
                                        }}
                                    />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>PDF, JPG, PNG o WEBP (máx. 5 MB).</span>
                                        {documento && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-foreground">{documento.name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-xs text-destructive"
                                                    onClick={() => setDocumento(null)}
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="space-y-2">
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.get('/remitos-recepcion')}
                                >
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={generarBolsas}>
                                    Continuar a la carga de bolsas
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {vistaPrevia && (
                    <>
                        <section className="rounded-md border p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">Resumen del remito</h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setVistaPrevia(null)}
                                >
                                    Editar datos
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                <span>Fecha: {vistaPrevia.remito.fecha_recepcion}</span>
                                <span>Cantidad: {vistaPrevia.remito.cantidad_declarada}</span>
                                <span>
                                    Rango: {vistaPrevia.remito.codigo_inicio} – {vistaPrevia.remito.codigo_fin}
                                </span>
                                <span>
                                    Tipo:{' '}
                                    {tiposBolsa.find(
                                        (tipo) => String(tipo.id) === vistaPrevia.remito.tipo_bolsa_id,
                                    )?.tipo_residuo ?? '—'}
                                </span>
                                <span>
                                    Tamaño:{' '}
                                    {tamanios.find(
                                        (tamanio) => String(tamanio.id) === vistaPrevia.remito.tamanio_id,
                                    )?.nombre ?? '—'}
                                </span>

                                <span className="flex items-center gap-2">
                                    Tipo:
                                    {tipoBolsaSeleccionado ? (
                                        <>
                                            <span
                                                className="size-3 shrink-0 rounded-full border"
                                                style={{ backgroundColor: tipoBolsaSeleccionado.color }}
                                                aria-label={`Color ${tipoBolsaSeleccionado.color}`}
                                            />
                                            {tipoBolsaSeleccionado.tipo_residuo}
                                        </>
                                    ) : (
                                        '—'
                                    )}
                                </span>
                            </div>

                        </section>

                        {vistaPrevia.bolsas.length > 0 && (
                            <section className="space-y-4 rounded-md border p-4">
                                <h2 className="text-lg font-semibold">
                                    Bolsas generadas ({vistaPrevia.bolsas.length})
                                </h2>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Código de bolsa</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Tamaño</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vistaPrevia.bolsas.map((bolsa) => (
                                            <TableRow key={bolsa.codigo_barra}>
                                                <TableCell>{bolsa.codigo_barra}</TableCell>
                                                <TableCell>
                                                    {tiposBolsa.find(
                                                        (tipo) => String(tipo.id) === vistaPrevia.remito.tipo_bolsa_id,
                                                    )?.tipo_residuo ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {tamanios.find(
                                                        (tamanio) => String(tamanio.id) === vistaPrevia.remito.tamanio_id,
                                                    )?.nombre ?? '—'}
                                                </TableCell>
                                                <TableCell>{ESTADO_BOLSA_LABELS.RECIBIDA}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </section>
                        )}


                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.get('/remitos-recepcion')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                disabled={
                                    vistaPrevia.bolsas.length !==
                                    Number(vistaPrevia.remito.cantidad_declarada)
                                }
                                onClick={guardarRemito}
                            >
                                Guardar
                            </Button>

                            {errorBolsa && (
                                <p className="text-sm text-destructive">{errorBolsa}</p>
                            )}
                        </div>

                    </>
                )}
            </div>
        </>
    );
}

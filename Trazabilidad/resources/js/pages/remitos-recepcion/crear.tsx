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

type ModoCargaBolsas = 'lote' | 'individual';

export default function Crear({ tiposBolsa, tamanios }: CrearProps) {

    // Estado para los 2 tipos de carga de bolsas: por lote o individual
    const [modoCarga, setModoCarga] = useState<ModoCargaBolsas | null>(null);
    const [codigoBolsa, setCodigoBolsa] = useState('');
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

    const cantidadAlcanzada =
        vistaPrevia !== null &&
        vistaPrevia.bolsas.length >= Number(vistaPrevia.remito.cantidad_declarada);

    // Genera las bolsas
    const generarBolsas = () => {
        const inicio = formulario.codigo_inicio.match(/^(\d{1,4})-(\d{1,9})$/);
        const fin = formulario.codigo_fin.match(/^(\d{1,4})-(\d{1,9})$/);
        const cantidad = Number(formulario.cantidad_declarada);

        if (
            !formulario.fecha_recepcion ||
            !formulario.tipo_bolsa_id ||
            !formulario.tamanio_id ||
            !inicio ||
            !fin ||
            !Number.isInteger(cantidad) ||
            cantidad < 1
        ) {
            setError('Completa los datos y verifica el formato de los códigos.');
            return;
        }

        const prefijoInicio = inicio[1].replace(/^0+/, '') || '0';
        const prefijoFin = fin[1].replace(/^0+/, '') || '0';
        const numeroInicio = Number(inicio[2]);
        const numeroFin = Number(fin[2]);
        const cantidadEnRango = numeroFin - numeroInicio + 1;

        if (prefijoInicio !== prefijoFin || numeroInicio > numeroFin) {
            setError('Los códigos deben tener el mismo prefijo y un rango válido.');
            return;
        }

        if (cantidadEnRango !== cantidad || cantidad > 1000) {
            setError('La cantidad debe coincidir con el rango y no superar 1000.');
            return;
        }

        // const prefijoFormateado = inicio[1].padStart(4, '0');
        // const bolsas = Array.from({ length: cantidadEnRango }, (_, index) => ({
        //     codigo_barra:
        //         prefijoFormateado +
        //         String(numeroInicio + index).padStart(9, '0'),
        // }));

        // setError('');
        // setVistaPrevia({ remito: { ...formulario }, bolsas });

        setError('');
        setErrorBolsa('');
        setCodigoBolsa('');
        setModoCarga(null);
        setVistaPrevia({ remito: { ...formulario }, bolsas: [] });
    };


    const cargarPorLote = () => {
        if (!vistaPrevia) return;

        const inicio = vistaPrevia.remito.codigo_inicio.match(
            /^(\d{1,4})-(\d{1,9})$/,
        );

        if (!inicio) {
            setError('El código inicial no tiene un formato válido.');
            return;
        }

        const cantidad = Number(vistaPrevia.remito.cantidad_declarada);
        const numeroInicio = Number(inicio[2]);
        const prefijo = inicio[1].padStart(4, '0');

        const bolsas = Array.from({ length: cantidad }, (_, index) => ({
            codigo_barra: prefijo + String(numeroInicio + index).padStart(9, '0'),
        }));

        setError('');
        setModoCarga('lote');
        setVistaPrevia({ ...vistaPrevia, bolsas });
    };

    const tipoBolsaSeleccionado = tiposBolsa.find(
        (tipo) => String(tipo.id) === vistaPrevia?.remito.tipo_bolsa_id,
    );


    const agregarBolsaIndividual = () => {
        if (!vistaPrevia || modoCarga !== 'individual') return;

        const codigo = codigoBolsa.trim();
        const inicio = vistaPrevia.remito.codigo_inicio.match(
            /^(\d{1,4})-(\d{1,9})$/,
        );
        const fin = vistaPrevia.remito.codigo_fin.match(
            /^(\d{1,4})-(\d{1,9})$/,
        );

        if (!inicio || !fin || !/^\d{13}$/.test(codigo)) {
            setErrorBolsa('Ingresa o escanea un código de barras válido de 13 dígitos.');
            return;
        }

        const prefijo = inicio[1].padStart(4, '0');
        const numero = Number(codigo.slice(4));
        const numeroInicio = Number(inicio[2]);
        const numeroFin = Number(fin[2]);
        const codigoEsperado =
            prefijo + String(numero).padStart(9, '0');

        if (
            codigo.slice(0, 4) !== prefijo ||
            codigo !== codigoEsperado ||
            numero < numeroInicio ||
            numero > numeroFin
        ) {
            setErrorBolsa('El código no pertenece al rango de este remito.');
            return;
        }

        if (vistaPrevia.bolsas.some((bolsa) => bolsa.codigo_barra === codigo)) {
            setErrorBolsa('Ese código ya fue agregado.');
            return;
        }

        if (vistaPrevia.bolsas.length >= Number(vistaPrevia.remito.cantidad_declarada)) {
            setErrorBolsa('Ya alcanzaste la cantidad declarada para este remito.');
            return;
        }

        setVistaPrevia({
            ...vistaPrevia,
            bolsas: [...vistaPrevia.bolsas, { codigo_barra: codigo }],
        });
        setCodigoBolsa('');
        setErrorBolsa('');
    };

    const guardarRemito = () => {
        if (!vistaPrevia || !modoCarga) return;

        const cantidad = Number(vistaPrevia.remito.cantidad_declarada);

        if (vistaPrevia.bolsas.length !== cantidad) {
            setErrorBolsa('Debes completar la cantidad declarada de bolsas.');
            return;
        }

        setErrorBolsa('');

        // router.post('/remitos-recepcion', { ...vistaPrevia.remito }, {
        //     onError: (errors) => {
        //         setErrorBolsa(Object.values(errors).join(' '));
        //     },
        // });

        router.post(
            '/remitos-recepcion',
            {
                ...vistaPrevia.remito,
                codigos: vistaPrevia.bolsas.map((bolsa) => bolsa.codigo_barra),
            },
            {
                onError: (errors) => {
                    setErrorBolsa(Object.values(errors).join(' '));
                },
            },
        );
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
                                                // <SelectItem key={tipo.id} value={String(tipo.id)}>
                                                //     {tipo.tipo_residuo} ({tipo.color})
                                                // </SelectItem>

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
                            </div>
                        </section>





                        <div className="space-y-2">
                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex justify-end">
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


                        {/* Botones de opciones para cargar bolsas: por lote o individual */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={modoCarga === 'lote' ? 'default' : 'outline'}
                                onClick={cargarPorLote}
                            >
                                Generar bolsas por lote
                            </Button>

                            <Button
                                type="button"
                                variant={modoCarga === 'individual' ? 'default' : 'outline'}
                                onClick={() => {
                                    setErrorBolsa('');
                                    setCodigoBolsa('');
                                    setModoCarga('individual');
                                    setVistaPrevia({ ...vistaPrevia, bolsas: [] });
                                }}
                            >
                                Ingresar las bolsas una por una
                            </Button>
                        </div>






                        {modoCarga && (
                            <section className="space-y-4 rounded-md border p-4">
                                <h2 className="text-lg font-semibold">
                                    Bolsas generadas ({vistaPrevia.bolsas.length})
                                </h2>



                                {/* Si el modo es individual, mostrar el input para agregar bolsas */}
                                {modoCarga === 'individual' && (
                                    <form
                                        className="space-y-2"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            agregarBolsaIndividual();
                                        }}
                                    >
                                        <Label htmlFor="codigo_bolsa_individual">
                                            Código de barras
                                        </Label>

                                        <div className="flex gap-2">
                                            <Input
                                                id="codigo_bolsa_individual"
                                                name="codigo_bolsa_individual"
                                                value={codigoBolsa}
                                                onChange={(e) => setCodigoBolsa(e.target.value)}
                                                placeholder="Escanea o escribe los 13 dígitos"
                                                inputMode="numeric"
                                                maxLength={13}
                                                autoComplete="off"
                                                autoFocus
                                            />

                                            <Button type="submit" disabled={cantidadAlcanzada}>
                                                {cantidadAlcanzada ? 'Cantidad completa' : 'Agregar bolsa'}
                                            </Button>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            Agregadas: {vistaPrevia.bolsas.length} de{' '}
                                            {vistaPrevia.remito.cantidad_declarada}
                                        </p>

                                        {errorBolsa && (
                                            <p className="text-sm text-destructive">{errorBolsa}</p>
                                        )}
                                    </form>
                                )}

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
                                                <TableCell>Recibido</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </section>
                        )}




                        <div className="flex justify-end">
                            {/* <Button type="button" disabled>
                                Guardar
                            </Button> */}


                            <Button
                                type="button"
                                disabled={
                                    !modoCarga ||
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

/*

Ejemplo de código para generar códigos de barras de manera individual


Código inicial: 3-21
Código final: 3-30


0003000000021
0003000000022
0003000000023
0003000000024
0003000000025
0003000000026
0003000000027
0003000000028
0003000000029
0003000000030

*/
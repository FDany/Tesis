import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

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
import type { Servicio } from '@/features/servicios/types/servicio';

interface Props {
    servicios: Servicio[];
}

export default function CreateResiduo({ servicios }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        servicio_id: '',
        retira_nombre: '',
        entregado_cargo: '',
        codigos: [] as string[],
    });

    const [codigoActual, setCodigoActual] = useState('');
    const [errorEscaneo, setErrorEscaneo] = useState('');

    const agregarCodigo = async () => {
        const codigo = codigoActual.trim();

        if (verificacionEnCurso.current) return;

        if (!/^\d{13}$/.test(codigo)) {
            setErrorEscaneo('El código debe tener 13 dígitos.');
            return;
        }

        if (data.codigos.includes(codigo)) {
            setErrorEscaneo('Ese código ya fue agregado.');
            return;
        }

        if (data.codigos.length >= 1000) {
            setErrorEscaneo('No se pueden agregar más de 1000 bolsas.');
            return;
        }

        verificacionEnCurso.current = true;
        setVerificando(true);
        setErrorEscaneo('');

        try {
            const response = await fetch(
                `/api/bolsas/buscar-para-entrega?codigo=${encodeURIComponent(codigo)}`,
                {
                    headers: { Accept: 'application/json' },
                },
            );

            const resultado: unknown = await response.json();

            if (!response.ok) {
                const mensaje =
                    typeof resultado === 'object' &&
                        resultado !== null &&
                        'message' in resultado &&
                        typeof resultado.message === 'string'
                        ? resultado.message
                        : 'No se pudo validar la bolsa.';

                throw new Error(mensaje);
            }

            if (
                typeof resultado !== 'object' ||
                resultado === null ||
                !('codigo_barra' in resultado) ||
                resultado.codigo_barra !== codigo
            ) {
                throw new Error('El servidor devolvió una respuesta inesperada.');
            }

            setData('codigos', [...data.codigos, codigo]);
            setCodigoActual('');
        } catch (error: unknown) {
            setErrorEscaneo(
                error instanceof Error
                    ? error.message
                    : 'No se pudo validar la bolsa.',
            );
        } finally {
            verificacionEnCurso.current = false;
            setVerificando(false);
        }
    };

    const manejarEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            agregarCodigo();
        }
    };

    const quitarCodigo = (codigoAQuitar: string) => {
        setData(
            'codigos',
            data.codigos.filter((codigo) => codigo !== codigoAQuitar),
        );
    };

    const enviarFormulario = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data.codigos.length === 0) {
            setErrorEscaneo('Agrega al menos una bolsa.');
            return;
        }

        post('/residuos', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setCodigoActual('');
                setErrorEscaneo('');
                toast.success('Bolsas entregadas al servicio correctamente.');
            },
        });
    };

    const erroresCodigos = Object.entries(errors)
        .filter(([campo]) => campo === 'codigos' || campo.startsWith('codigos.'))
        .map(([, mensaje]) => mensaje);


    const [verificando, setVerificando] = useState(false);
    const verificacionEnCurso = useRef(false);

    return (
        <>
            <Head title="Entrega de bolsas a servicio" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Entrega de bolsas a servicio
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Escanea las bolsas disponibles que se entregarán al servicio.
                    </p>
                </header>

                <form onSubmit={enviarFormulario} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="servicio_id">Servicio *</Label>
                        <Select
                            value={data.servicio_id}
                            onValueChange={(value) => setData('servicio_id', value)}
                        >
                            <SelectTrigger id="servicio_id">
                                <SelectValue placeholder="Selecciona un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                {servicios.map((servicio) => (
                                    <SelectItem
                                        key={servicio.id}
                                        value={String(servicio.id)}
                                    >
                                        {servicio.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.servicio_id && (
                            <p className="text-sm text-destructive">
                                {errors.servicio_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="retira_nombre">Persona que retira *</Label>
                            <Input
                                id="retira_nombre"
                                value={data.retira_nombre}
                                onChange={(event) =>
                                    setData('retira_nombre', event.target.value)
                                }
                                required
                                maxLength={255}
                            />
                            {errors.retira_nombre && (
                                <p className="text-sm text-destructive">
                                    {errors.retira_nombre}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="entregado_cargo">Cargo *</Label>
                            <Input
                                id="entregado_cargo"
                                value={data.entregado_cargo}
                                onChange={(event) =>
                                    setData('entregado_cargo', event.target.value)
                                }
                                required
                                maxLength={255}
                            />
                            {errors.entregado_cargo && (
                                <p className="text-sm text-destructive">
                                    {errors.entregado_cargo}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="codigo_barra">Código de barras</Label>
                        <div className="flex gap-2">
                            <Input
                                id="codigo_barra"
                                value={codigoActual}
                                onChange={(event) => setCodigoActual(event.target.value)}
                                onKeyDown={manejarEnter}
                                placeholder="Escanea o escribe el código y presiona Enter"
                                inputMode="numeric"
                                autoComplete="off"
                                disabled={verificando}
                            />

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={agregarCodigo}
                                disabled={verificando}
                            >
                                {verificando ? 'Validando…' : 'Agregar'}
                            </Button>
                        </div>

                        {errorEscaneo && (
                            <p className="text-sm text-destructive">{errorEscaneo}</p>
                        )}

                        {erroresCodigos.map((mensaje, index) => (
                            <p key={index} className="text-sm text-destructive">
                                {mensaje}
                            </p>
                        ))}
                    </div>

                    <section className="space-y-2">
                        <h2 className="font-medium">
                            Bolsas agregadas ({data.codigos.length})
                        </h2>

                        {data.codigos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Todavía no agregaste bolsas.
                            </p>
                        ) : (
                            <ul className="divide-y rounded-md border">
                                {data.codigos.map((codigo) => (
                                    <li
                                        key={codigo}
                                        className="flex items-center justify-between p-3"
                                    >
                                        <span className="font-mono">{codigo}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => quitarCodigo(codigo)}
                                        >
                                            Quitar
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <Button type="submit" disabled={processing || verificando}>
                        {processing ? 'Guardando…' : 'Registrar entrega'}
                    </Button>
                </form>
            </div>
        </>
    );
}
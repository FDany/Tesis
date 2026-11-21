import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateRecepcionDeposito() {
    const { data, setData, post, processing, errors, reset } = useForm({
        codigos: [] as string[],
    });

    const [codigoActual, setCodigoActual] = useState('');
    const [errorEscaneo, setErrorEscaneo] = useState('');

    const [verificando, setVerificando] = useState(false);
    const verificacionEnCurso = useRef(false);

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
                `/api/bolsas/buscar-para-recepcion-deposito?codigo=${encodeURIComponent(codigo)}`,
                { headers: { Accept: 'application/json' } },
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
            setErrorEscaneo('Escanea al menos una bolsa.');
            return;
        }

        setErrorEscaneo('');

        post('/recepciones-deposito', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setCodigoActual('');
                toast.success('Bolsas recibidas en depósito correctamente.');
            },
        });
    };

    const erroresCodigos = Object.entries(errors)
        .filter(([campo]) => campo === 'codigos' || campo.startsWith('codigos.'))
        .map(([, mensaje]) => mensaje);



    return (
        <>
            <Head title="Recepción de bolsas en depósito" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Recepción de bolsas en depósito
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Escanea las bolsas que regresan de un servicio.
                    </p>
                </header>

                <form onSubmit={enviarFormulario} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="codigo_barra">Código de barras</Label>
                        <div className="flex gap-2">
                            <Input
                                id="codigo_barra"
                                value={codigoActual}
                                onChange={(event) =>
                                    setCodigoActual(event.target.value)
                                }
                                onKeyDown={manejarEnter}
                                placeholder="Escanea o escribe el código y presiona Enter"
                                inputMode="numeric"
                                autoComplete="off"
                                disabled={processing || verificando}
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={agregarCodigo}
                                disabled={processing || verificando}
                            >
                                Agregar
                            </Button>
                        </div>

                        {errorEscaneo && (
                            <p className="text-sm text-destructive">
                                {errorEscaneo}
                            </p>
                        )}

                        {erroresCodigos.map((mensaje, index) => (
                            <p key={index} className="text-sm text-destructive">
                                {mensaje}
                            </p>
                        ))}
                    </div>

                    <section className="space-y-2">
                        <h2 className="font-medium">
                            Bolsas escaneadas ({data.codigos.length})
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
                                            disabled={processing}
                                        >
                                            Quitar
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <Button
                        type="submit"
                        disabled={processing || verificando || data.codigos.length === 0}
                    >
                        {processing ? 'Registrando…' : 'Registrar recepción'}
                    </Button>
                </form>
            </div>
        </>
    );
}
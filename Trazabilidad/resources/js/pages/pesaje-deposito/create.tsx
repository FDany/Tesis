import { useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreatePesajeDeposito() {
    const codigoRef = useRef<HTMLInputElement>(null);
    const pesoRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        codigo: '',
        peso: '',
    });

    const manejarEnterEnCodigo = (
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            pesoRef.current?.focus();
        }
    };

    const enviarFormulario = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/pesaje-deposito', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                codigoRef.current?.focus();
                toast.success('Pesaje registrado correctamente.');
            },
        });
    };

    return (
        <>
            <Head title="Pesaje en depósito" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Pesaje en depósito
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Escanea una bolsa, ingresa su peso y regístrala.
                    </p>
                </header>

                <form onSubmit={enviarFormulario} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="codigo">Código de barras</Label>
                        <Input
                            ref={codigoRef}
                            id="codigo"
                            value={data.codigo}
                            onChange={(event) =>
                                setData('codigo', event.target.value)
                            }
                            onKeyDown={manejarEnterEnCodigo}
                            placeholder="Escanea o escribe el código"
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={processing}
                            autoFocus
                        />
                        {errors.codigo && (
                            <p className="text-sm text-destructive">
                                {errors.codigo}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="peso">Peso</Label>
                        <Input
                            ref={pesoRef}
                            id="peso"
                            type="number"
                            min="0"
                            step="any"
                            value={data.peso}
                            onChange={(event) =>
                                setData('peso', event.target.value)
                            }
                            placeholder="Ingresa el peso"
                            disabled={processing}
                        />
                        {errors.peso && (
                            <p className="text-sm text-destructive">
                                {errors.peso}
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Registrando…' : 'Registrar pesaje'}
                    </Button>
                </form>
            </div>
        </>
    );
}
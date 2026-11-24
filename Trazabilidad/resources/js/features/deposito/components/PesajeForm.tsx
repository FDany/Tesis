import { useRef, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScannerInput } from '@/features/bolsas/components/ScannerInput';

export default function PesajeForm() {
    const { data, setData, post, processing, errors, setError, clearErrors, reset } =
        useForm({ codigo: '', peso: '' });

    const pesoRef = useRef<HTMLInputElement>(null);

    const escanear = (codigo: string): boolean => {
        if (!/^\d{13}$/.test(codigo)) {
            setError('codigo', 'El código debe tener 13 dígitos.');
            return false;
        }

        setData('codigo', codigo);
        clearErrors('codigo');
        pesoRef.current?.focus();
        return true;
    };

    const enviar = (event: FormEvent) => {
        event.preventDefault();

        post('/pesaje-deposito', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Pesaje registrado correctamente.');
            },
        });
    };

    return (
        <form onSubmit={enviar} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="scan-pesaje">Código de barras</Label>
                <ScannerInput
                    id="scan-pesaje"
                    onScan={escanear}
                    disabled={processing}
                    placeholder="Escanea o escribe el código"
                    buttonLabel="Cargar"
                />

                {data.codigo && (
                    <p className="text-sm">
                        Bolsa: <span className="font-mono">{data.codigo}</span>
                    </p>
                )}

                {errors.codigo && (
                    <p className="text-sm text-destructive">{errors.codigo}</p>
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
                    onChange={(event) => setData('peso', event.target.value)}
                    placeholder="Ingresa el peso"
                    disabled={processing}
                />
                {errors.peso && (
                    <p className="text-sm text-destructive">{errors.peso}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={processing || data.codigo === '' || data.peso === ''}
            >
                {processing ? 'Registrando…' : 'Registrar pesaje'}
            </Button>
        </form>
    );
}  
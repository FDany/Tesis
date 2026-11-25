import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScannerInput } from '@/features/bolsas';
import {
    ResumenControlRecepcion,
    type BolsaEscaneada,
    type RemitoPendienteControl,
    type ResultadoControl,
} from '@/features/control-recepcion';

interface Props {
    remitos: RemitoPendienteControl[];
    remitoSeleccionadoId: number | null;
    resultadoControl: ResultadoControl | null;
}

export default function CreateControlRecepcion({
    remitos,
    remitoSeleccionadoId,
    resultadoControl,
}: Props) {
    // Preselección desde /control-recepcion?remito_id=X (validada en el backend).
    const { data, setData, post, processing, errors, transform } =
        useForm({
            remito_id: remitoSeleccionadoId ? String(remitoSeleccionadoId) : '',
            codigos: [] as string[],
        });

    const [escaneadas, setEscaneadas] = useState<BolsaEscaneada[]>([]);
    const [errorEscaneo, setErrorEscaneo] = useState('');
    const [verificando, setVerificando] = useState(false);
    const verificacionEnCurso = useRef(false);

    const remitoSeleccionado = useMemo(
        () => remitos.find((remito) => String(remito.id) === data.remito_id),
        [remitos, data.remito_id],
    );

    const declaradasEscaneadas = escaneadas.filter(
        (bolsa) => bolsa.resultado === 'DECLARADA',
    ).length;
    const sobrantes = escaneadas.filter(
        (bolsa) => bolsa.resultado === 'SOBRANTE',
    ).length;
    const pendientes = remitoSeleccionado
        ? remitoSeleccionado.bolsas_recibidas_count - declaradasEscaneadas
        : 0;

    const seleccionarRemito = (valor: string) => {
        setData('remito_id', valor);
        setEscaneadas([]);
        setErrorEscaneo('');
    };

    const escanearBolsa = async (codigoIngresado: string): Promise<boolean> => {
        const codigo = codigoIngresado.trim();

        if (verificacionEnCurso.current || !remitoSeleccionado) return false;

        if (!/^\d{13}$/.test(codigo)) {
            setErrorEscaneo('El código debe tener 13 dígitos.');
            return false;
        }

        if (escaneadas.some((bolsa) => bolsa.codigo_barra === codigo)) {
            setErrorEscaneo('Ese código ya fue escaneado.');
            return false;
        }

        if (escaneadas.length >= 1000) {
            setErrorEscaneo('No se pueden escanear más de 1000 bolsas.');
            return false;
        }

        verificacionEnCurso.current = true;
        setVerificando(true);
        setErrorEscaneo('');

        try {
            const params = new URLSearchParams({
                remito_id: String(remitoSeleccionado.id),
                codigo,
            });
            const response = await fetch(
                `/control-recepcion/verificar-bolsa?${params.toString()}`,
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

            const bolsa = resultado as BolsaEscaneada & { message: string };

            if (bolsa.codigo_barra !== codigo) {
                throw new Error('El servidor devolvió una respuesta inesperada.');
            }

            setEscaneadas((anteriores) => [
                {
                    codigo_barra: bolsa.codigo_barra,
                    resultado: bolsa.resultado,
                    mensaje: bolsa.message,
                },
                ...anteriores,
            ]);

            if (bolsa.resultado === 'SOBRANTE') {
                toast.warning(bolsa.message);
            }

            return true;
        } catch (error: unknown) {
            setErrorEscaneo(
                error instanceof Error
                    ? error.message
                    : 'No se pudo validar la bolsa.',
            );
            return false;
        } finally {
            verificacionEnCurso.current = false;
            setVerificando(false);
        }
    };

    const quitarBolsa = (codigo: string) => {
        setEscaneadas((anteriores) =>
            anteriores.filter((bolsa) => bolsa.codigo_barra !== codigo),
        );
    };

    const confirmarControl = (e: FormEvent) => {
        e.preventDefault();

        if (!remitoSeleccionado) {
            setErrorEscaneo('Selecciona un remito de recepción.');
            return;
        }

        if (escaneadas.length === 0) {
            setErrorEscaneo('Escanea al menos una bolsa.');
            return;
        }

        transform((formulario) => ({
            ...formulario,
            codigos: escaneadas.map((bolsa) => bolsa.codigo_barra),
        }));

        post('/control-recepcion', {
            preserveScroll: true,
            onSuccess: (page) => {
                setData({ remito_id: '', codigos: [] });
                setEscaneadas([]);
                setErrorEscaneo('');

                const mensaje = (page.props as { flash?: { success?: string } })
                    .flash?.success;
                if (mensaje) toast.success(mensaje);
            },
        });
    };

    const erroresCodigos = Object.entries(errors)
        .filter(([campo]) => campo === 'codigos' || campo.startsWith('codigos.'))
        .map(([, mensaje]) => mensaje);

    return (
        <>
            <Head title="Control Recepción" />

            <div className="mx-auto max-w-3xl space-y-6 p-6">
                <Heading
                    title="Control Recepción"
                    description="Escanea las bolsas recibidas de un remito para dejarlas disponibles y conciliar el remito."
                />

                {resultadoControl && (
                    <ResumenControlRecepcion resultado={resultadoControl} />
                )}

                <form onSubmit={confirmarControl} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="remito_id">Remito de recepción *</Label>
                        <Select
                            value={data.remito_id}
                            onValueChange={seleccionarRemito}
                            disabled={processing}
                        >
                            <SelectTrigger id="remito_id">
                                <SelectValue
                                    placeholder={
                                        remitos.length === 0
                                            ? 'No hay remitos pendientes de control'
                                            : 'Selecciona un remito'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {remitos.map((remito) => (
                                    <SelectItem
                                        key={remito.id}
                                        value={String(remito.id)}
                                    >
                                        #{remito.id} · {remito.fecha_recepcion} ·{' '}
                                        {remito.codigo_inicio} a {remito.codigo_fin} (
                                        {remito.bolsas_recibidas_count} bolsas)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.remito_id && (
                            <p className="text-sm text-destructive">
                                {errors.remito_id}
                            </p>
                        )}
                    </div>

                    {remitoSeleccionado && (
                        <section className="grid gap-3 rounded-md border border-border bg-card p-4 text-sm sm:grid-cols-2">
                            <Detalle
                                label="Flujo / Color"
                                valor={
                                    remitoSeleccionado.tipo_bolsa
                                        ? `${remitoSeleccionado.tipo_bolsa.tipo_residuo} · ${remitoSeleccionado.tipo_bolsa.color}`
                                        : '—'
                                }
                            />
                            <Detalle
                                label="Tamaño"
                                valor={remitoSeleccionado.tamanio ?? '—'}
                            />
                            <Detalle
                                label="Recibido por"
                                valor={remitoSeleccionado.usuario_recep ?? '—'}
                            />
                            <Detalle
                                label="Cantidad declarada"
                                valor={String(remitoSeleccionado.cantidad_declarada)}
                            />
                            {remitoSeleccionado.observaciones && (
                                <div className="sm:col-span-2">
                                    <Detalle
                                        label="Observaciones"
                                        valor={remitoSeleccionado.observaciones}
                                    />
                                </div>
                            )}
                        </section>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="codigo_barra">Código de barras</Label>
                        <ScannerInput
                            id="codigo_barra"
                            onScan={escanearBolsa}
                            disabled={!remitoSeleccionado || verificando || processing}
                            placeholder={
                                remitoSeleccionado
                                    ? 'Escanea o escribe el código y presiona Enter'
                                    : 'Primero selecciona un remito'
                            }
                            buttonLabel={verificando ? 'Validando…' : 'Escanear'}
                        />

                        {errorEscaneo && (
                            <p className="text-sm text-destructive">{errorEscaneo}</p>
                        )}

                        {erroresCodigos.map((mensaje, index) => (
                            <p key={index} className="text-sm text-destructive">
                                {mensaje}
                            </p>
                        ))}
                    </div>

                    {remitoSeleccionado && (
                        <div className="grid gap-2 sm:grid-cols-3">
                            <Contador label="Controladas" valor={declaradasEscaneadas} />
                            <Contador label="Pendientes" valor={pendientes} />
                            <Contador label="Sobrantes" valor={sobrantes} />
                        </div>
                    )}

                    <section className="space-y-2">
                        <h2 className="font-medium text-foreground">
                            Bolsas escaneadas ({escaneadas.length})
                        </h2>

                        {escaneadas.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Todavía no escaneaste bolsas.
                            </p>
                        ) : (
                            <ul className="divide-y divide-border rounded-md border border-border bg-card">
                                {escaneadas.map((bolsa) => (
                                    <li
                                        key={bolsa.codigo_barra}
                                        className="flex items-center justify-between gap-3 p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-foreground">
                                                {bolsa.codigo_barra}
                                            </span>
                                            <Badge
                                                variant={
                                                    bolsa.resultado === 'DECLARADA'
                                                        ? 'secondary'
                                                        : 'destructive'
                                                }
                                            >
                                                {bolsa.resultado === 'DECLARADA'
                                                    ? 'Declarada'
                                                    : 'Sobrante'}
                                            </Badge>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => quitarBolsa(bolsa.codigo_barra)}
                                            disabled={processing}
                                        >
                                            Quitar
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {remitoSeleccionado && (pendientes > 0 || sobrantes > 0) && escaneadas.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Al confirmar se generarán incidencias por{' '}
                            {pendientes > 0 && `${pendientes} bolsa(s) faltante(s)`}
                            {pendientes > 0 && sobrantes > 0 && ' y '}
                            {sobrantes > 0 && `${sobrantes} bolsa(s) sobrante(s)`}.
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={
                            !remitoSeleccionado ||
                            escaneadas.length === 0 ||
                            processing ||
                            verificando
                        }
                    >
                        {processing ? 'Guardando…' : 'Confirmar control'}
                    </Button>
                </form>
            </div>
        </>
    );
}

function Detalle({ label, valor }: { label: string; valor: string }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-foreground">{valor}</p>
        </div>
    );
}

function Contador({ label, valor }: { label: string; valor: number }) {
    return (
        <div className="rounded-md bg-muted p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold text-foreground">{valor}</p>
        </div>
    );
}

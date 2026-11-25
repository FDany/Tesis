import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EncabezadoOrdenable } from '@/components/EncabezadoOrdenable';
import type { Auditoria } from '../types/auditoria';

export type CampoOrdenAuditoria =
    | 'fecha_hora'
    | 'bolsa_id'
    | 'operacion'
    | 'responsable_usuario_id';

interface AuditoriaTablaProps {
    auditorias: Auditoria[];
    ordenActual: string;
    direccionActual: string;
    onOrdenar: (campo: CampoOrdenAuditoria) => void;
}

function formatearFechaHora(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    if (Number.isNaN(fecha.getTime())) {
        return fechaIso;
    }

    return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(fecha);
}

const ETIQUETAS_CAMPOS: Record<string, string> = {
    estado: 'Estado',
    remitos_serv_id: 'Remito de entrega',
    rem_sal_id: 'Remito de salida',
    remito_recepcion_id: 'Remito de Recepción',
    recep_dep_id: 'Recepcion Deposito N°',
    peso: 'Peso',
    numero_manifiesto: 'Manifiesto N°',
};

const ETIQUETAS_ESTADOS: Record<string, string> = {
    NO_RECIBIDA : 'No Recibida',
    RECIBIDA : 'Recibida',
    DISPONIBLE: 'Disponible',
    ENTREGADA_A_SERVICIO: 'Entregada a servicio',
    // UTILIZADA: 'Utilizada',
    INGRESADA_AL_DEPOSITO: 'Recibida en depósito',
    PESADA: 'Pesada',
    DESPACHADA: 'Despachada',
    RETIRADA_POR_DGM: 'Retirada por DGM',
    TRATADA_DISPOSICION_FINAL: 'Tratada / disposición final',
};

function formatearValorDato(clave: string, val: unknown): string {
    if (val === null || val === undefined || val === '') {
        return 'Sin asignar';
    }

    const texto = String(val);

    if (clave === 'estado' && ETIQUETAS_ESTADOS[texto]) {
        return ETIQUETAS_ESTADOS[texto];
    }

    if (clave === 'peso') {
        return `${texto} kg`;
    }

    return texto;
}

function formatearValor(valor: string | null): string {
    if (!valor) {
        return '—';
    }

    try {
        const parsed = JSON.parse(valor);
        if (typeof parsed === 'object' && parsed !== null) {
            return Object.entries(parsed)
                .map(([clave, val]) => {
                    const etiquetaClave = ETIQUETAS_CAMPOS[clave] ?? clave;
                    const valorLegible = formatearValorDato(clave, val);
                    return `${etiquetaClave}: ${valorLegible}`;
                })
                .join(' · ');
        }
    } catch {
        // Si no es JSON, se muestra el texto plano tal cual
    }

    return valor;
}

export function AuditoriaTabla({
    auditorias,
    ordenActual,
    direccionActual,
    onOrdenar,
}: AuditoriaTablaProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <EncabezadoOrdenable<CampoOrdenAuditoria>
                            campo="fecha_hora"
                            etiqueta="Fecha y hora"
                            ordenActual={ordenActual}
                            direccionActual={direccionActual}
                            onOrdenar={onOrdenar}
                        />
                        <EncabezadoOrdenable<CampoOrdenAuditoria>
                            campo="bolsa_id"
                            etiqueta="Bolsa"
                            ordenActual={ordenActual}
                            direccionActual={direccionActual}
                            onOrdenar={onOrdenar}
                        />
                        <EncabezadoOrdenable<CampoOrdenAuditoria>
                            campo="operacion"
                            etiqueta="Operación"
                            ordenActual={ordenActual}
                            direccionActual={direccionActual}
                            onOrdenar={onOrdenar}
                        />
                        <EncabezadoOrdenable<CampoOrdenAuditoria>
                            campo="responsable_usuario_id"
                            etiqueta="Responsable"
                            ordenActual={ordenActual}
                            direccionActual={direccionActual}
                            onOrdenar={onOrdenar}
                        />
                        <TableHead>Valor anterior</TableHead>
                        <TableHead>Valor nuevo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {auditorias.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No se encontraron registros de auditoría.
                            </TableCell>
                        </TableRow>
                    ) : (
                        auditorias.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="whitespace-nowrap text-sm">
                                    {formatearFechaHora(item.fecha_hora)}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                    {item.bolsa?.codigo_barra ?? `#${item.bolsa_id}`}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.operacion}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {item.responsable
                                        ? `${item.responsable.first_name} ${item.responsable.last_name}`
                                        : `Usuario #${item.responsable_usuario_id}`}
                                </TableCell>
                                <TableCell className="max-w-xs wrap-break-words text-xs text-muted-foreground">
                                    {formatearValor(item.valor_anterior)}
                                </TableCell>
                                <TableCell className="max-w-xs wrap-break-words text-xs">
                                    {formatearValor(item.valor_nuevo)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

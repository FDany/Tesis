import { ESTADO_BOLSA_LABELS, type Bolsa } from '../types/bolsa';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { EncabezadoOrdenable } from '@/components/EncabezadoOrdenable';


interface BolsaTablaProps {
    data: Bolsa[];
    orden: string;
    direccion: string;
    onVer: (id: number) => void;
    onOrdenar: (campo: string) => void;
}

export function BolsaTabla({
    data,
    orden,
    direccion,
    onVer,
    onOrdenar
}: BolsaTablaProps) {

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <EncabezadoOrdenable
                            campo="codigo_barra"
                            etiqueta="Código de Bolsa"
                            ordenActual={orden}
                            direccionActual={direccion}
                            onOrdenar={onOrdenar}
                        />

                        {/* Relación externa: no se ordena directamente */}
                        <TableHead>Tipo de bolsa</TableHead>

                        <EncabezadoOrdenable
                            campo="created_at"
                            etiqueta="Fecha de creación"
                            ordenActual={orden}
                            direccionActual={direccion}
                            onOrdenar={onOrdenar}
                        />

                        <EncabezadoOrdenable
                            campo="estado"
                            etiqueta="Estado"
                            ordenActual={orden}
                            direccionActual={direccion}
                            onOrdenar={onOrdenar}
                        />

                        <TableHead>Trazabilidad</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!data || data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-6 text-center text-muted-foreground"
                            >
                                No hay bolsas registradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((bolsa) => (
                            <TableRow key={bolsa.codigo_barra}>
                                <TableCell className="font-medium">
                                    #{bolsa.codigo_barra}
                                </TableCell>

                                <TableCell>
                                    {bolsa.tipo_bolsa ? (
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="size-3 shrink-0 rounded-full border"
                                                style={{ backgroundColor: bolsa.tipo_bolsa.color }}
                                                aria-label={`Color ${bolsa.tipo_bolsa.color}`}
                                            />
                                            {bolsa.tipo_bolsa.tipo_residuo}
                                        </span>
                                    ) : (
                                        '—'
                                    )}
                                </TableCell>

                                <TableCell>
                                    {bolsa.created_at
                                        ? new Date(
                                            bolsa.created_at.replace(' ', 'T'),
                                        ).toLocaleDateString('es-AR')
                                        : '—'}
                                </TableCell>

                                <TableCell className="font-semibold">
                                    {ESTADO_BOLSA_LABELS[bolsa.estado] ?? bolsa.estado}
                                </TableCell>

                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0"
                                        onClick={() => onVer(bolsa.id)}
                                    >
                                        Detalles
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

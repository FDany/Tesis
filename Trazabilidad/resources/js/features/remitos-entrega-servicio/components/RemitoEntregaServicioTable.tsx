import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { RemitoEntregaServicio } from '../types/remitoEntregaServicio';

interface Props {
    data: RemitoEntregaServicio[];
}

export function RemitoEntregaServicioTable({ data }: Props) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Remito</TableHead>
                        <TableHead>Fecha de entrega</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Retira</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Cantidad de bolsas</TableHead>
                        <TableHead>PDF</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="py-6 text-center text-muted-foreground"
                            >
                                No hay remitos de entrega registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((remito) => (
                            <TableRow key={remito.id}>
                                <TableCell className="font-medium">
                                    #{remito.id}
                                </TableCell>
                                <TableCell>
                                    {new Date(remito.fecha_entrega).toLocaleString(
                                        'es-AR',
                                        {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        },
                                    )}
                                </TableCell>
                                <TableCell>{remito.servicio.nombre}</TableCell>
                                <TableCell>{remito.retira_nombre}</TableCell>
                                <TableCell>{remito.entregado_cargo}</TableCell>
                                <TableCell>{remito.cantidad_bolsas_dadas}</TableCell>
                                <TableCell>
                                    <Button asChild variant="outline" size="sm">
                                        <a
                                            href={`/remitos-entrega-servicio/${remito.id}/pdf`}
                                        >
                                            Descargar
                                        </a>
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
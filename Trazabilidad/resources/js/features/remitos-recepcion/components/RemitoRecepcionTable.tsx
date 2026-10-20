import type { RemitoRecepcion } from '../types/remitoRecepcion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RemitoRecepcionTableProps {
  data: RemitoRecepcion[];
}

export function RemitoRecepcionTable({ data }: RemitoRecepcionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID / Remito</TableHead>
            <TableHead>Fecha Recepción</TableHead>
            <TableHead>Tipo de Bolsa</TableHead>
            <TableHead>Cant. Declarada</TableHead>
            <TableHead>Rango Manuscrito</TableHead>
            <TableHead>Tamaño</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No hay remitos de recepción registrados.
              </TableCell>
            </TableRow>
          ) : (
            data.map((remito) => (
              <TableRow key={remito.id}>
                <TableCell className="font-medium">#{remito.id}</TableCell>
                <TableCell>
                  {new Date(remito.fecha_recepcion.replace(' ', 'T')).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </TableCell>
                <TableCell>
                  {remito.tipo_bolsa ? (
                    <span>
                      {remito.tipo_bolsa.tipo_residuo} ({remito.tipo_bolsa.color})
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{remito.cantidad_declarada}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {remito.codigo_inicio} ➔ {remito.codigo_fin}
                  </code>
                </TableCell>
                <TableCell>
                  {remito.tamanio?(
                    <span>
                        {remito.tamanio.nombre}
                    </span>
                  ):(
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

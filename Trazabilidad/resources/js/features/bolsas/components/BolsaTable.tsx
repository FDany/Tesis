import type { Bolsa } from '../types/bolsa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface BolsaTableProps {
  data: Bolsa[];
}

export function BolsaTable({ data }: BolsaTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Codigo de Bolsa</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Trazabilidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No hay bolsas registradas.
              </TableCell>
            </TableRow>
          ) : (
            data.map((bolsa) => (
              <TableRow key={bolsa.codigo_barra}>
                <TableCell className="font-medium"> #{bolsa.codigo_barra} </TableCell>
                <TableCell className="font-semibold"> {bolsa.estado} </TableCell>
                <TableCell>
                    Detalles
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

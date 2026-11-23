import type { RemitoRecepcion } from '../types/remitoRecepcion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EncabezadoOrdenable } from '@/components/EncabezadoOrdenable';
import { useAuth } from '@/hooks/use-auth'

interface RemitoRecepcionTableProps {
  data: RemitoRecepcion[];
  onVer: (id: number) => void;
  orden: string;
  direccion: string;
  onOrdenar: (campo: 'fecha_recepcion' | 'cantidad_declarada') => void;
}

export function RemitoRecepcionTable({
  data,
  onVer,
  orden,
  direccion,
  onOrdenar
}: RemitoRecepcionTableProps) {
    const { can } = useAuth();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID / Remito</TableHead>
            <EncabezadoOrdenable
              campo="fecha_recepcion"
              etiqueta="Fecha Recepción"
              ordenActual={orden}
              direccionActual={direccion}
              onOrdenar={onOrdenar}
            />
            <TableHead>Tipo de Bolsa</TableHead>
            <EncabezadoOrdenable
              campo="cantidad_declarada"
              etiqueta="Cant. Declarada"
              ordenActual={orden}
              direccionActual={direccion}
              onOrdenar={onOrdenar}
            />
            <TableHead>Rango Manuscrito</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead className="text-right">Ver</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-6 text-center text-muted-foreground"
              >
                No hay remitos de recepción registrados.
              </TableCell>
            </TableRow>
          ) : (
            data.map((remito) => (
              <TableRow key={remito.id}>
                <TableCell className="font-medium">#{remito.id}</TableCell>
                {/* <TableCell>
                  {new Date(remito.fecha_recepcion.replace(' ', 'T')).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </TableCell> */}
                <TableCell suppressHydrationWarning>
                  {new Date(remito.fecha_recepcion.replace(' ', 'T')).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hour12: false,
                  })}
                </TableCell>
                <TableCell>
                  {remito.tipo_bolsa ? (
                    <Badge
                      variant="outline"
                      style={{ borderColor: remito.tipo_bolsa.color }}
                    >
                      {remito.tipo_bolsa.tipo_residuo}
                    </Badge>
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
                  {remito.tamanio ? (
                    <span>
                      {remito.tamanio.nombre}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {(can('verDetalle remitosRecepcion'))&&(
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Ver detalle del remito ${remito.id}`}
                    onClick={() => onVer(remito.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>)}
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

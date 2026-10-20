import React from 'react';
import type { Servicio } from '../types/servicio';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Props {
  servicios: Servicio[];
  onEdit: (servicio: Servicio) => void;
  onDelete: (id: number) => void;
}

export const ServicioTable: React.FC<Props> = ({
  servicios,
  onEdit,
  onDelete,
}) => {
  if (!servicios || servicios.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
        No hay servicios registrados.
      </div>
    );
  }

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Servicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell className="font-semibold">{servicio.nombre}</TableCell>
              <TableCell className="font-semibold">
                {servicio.activo ? 'Activo' : 'Inactivo'}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(servicio)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(servicio.id)}
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

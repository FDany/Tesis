import React from 'react';
import type { TipoBolsa } from '../types/tipoBolsa';
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
  tiposBolsa: TipoBolsa[];
  onEdit: (tipo: TipoBolsa) => void;
  onDelete: (id: number) => void;
}

export function TipoBolsaTable({
  tiposBolsa,
  onEdit,
  onDelete,
}: Props) {
  if (!tiposBolsa || tiposBolsa.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
        No hay tipos de bolsas/residuos registrados.
      </div>
    );
  }

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo / Flujo de Residuo</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiposBolsa.map((tipo) => (
            <TableRow key={tipo.id}>
              <TableCell className="font-semibold">{tipo.tipo_residuo}</TableCell>
              <TableCell>
                <Badge variant="outline">{tipo.color}</Badge>
              </TableCell>
              <TableCell>{tipo.proveedor || '-'}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(tipo)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(tipo.id)}
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

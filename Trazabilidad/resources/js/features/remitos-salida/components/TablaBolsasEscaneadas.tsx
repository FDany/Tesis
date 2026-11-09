import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Package } from 'lucide-react';
import type { Bolsa } from '@/features/bolsas/types/bolsa'; // Ajusta la ruta a tu tipo Bolsa

interface Props {
  bolsas: Bolsa[];
  onRemoveBolsa: (id: number) => void;
  disabled?: boolean;
}

export function TablaBolsasEscaneadas({ bolsas, onRemoveBolsa, disabled = false }: Props) {
  if (bolsas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-muted/40">
        <Package className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-muted-foreground">
          No hay bolsas escaneadas en esta sesión.
        </p>
        <p className="text-xs text-muted-foreground">
          Utilice el escáner para comenzar a agregar bolsas al despacho.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Código de Barras</TableHead>
            <TableHead className="text-right">Peso (kg)</TableHead>
            <TableHead className="text-center w-20">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bolsas.map((bolsa, index) => (
            <TableRow key={bolsa.id}>
              <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="font-mono font-semibold">{bolsa.codigo_barra}</TableCell>
              <TableCell className="text-right font-medium">
                {bolsa.peso != null ? Number(bolsa.peso).toFixed(2) : '0.00'} kg
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveBolsa(bolsa.id)}
                  disabled={disabled}
                  className="text-destructive hover:bg-destructive/10"
                  title="Quitar bolsa"
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
}

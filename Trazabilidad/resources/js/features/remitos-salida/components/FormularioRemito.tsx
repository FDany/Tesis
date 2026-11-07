import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';
import type { CreateRemitoSalidaRetiroDTO } from '../types/remitoSalidaRetiro';

interface Props {
  data: CreateRemitoSalidaRetiroDTO;
  setData: (key: keyof CreateRemitoSalidaRetiroDTO, value: any) => void;
  errors: Partial<Record<keyof CreateRemitoSalidaRetiroDTO, string>>;
  processing: boolean;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormularioRemito({
  data,
  setData,
  errors,
  processing,
  canSubmit,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileCheck className="h-5 w-5 text-primary" />
            Emisión de Remito Interno de Salida
          </CardTitle>
          <CardDescription>
            Confirme el despacho de las bolsas seleccionadas/escaneadas para generar el remito interno institucional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones Internas del Despacho</Label>
            <Textarea
              id="observaciones"
              placeholder="Ingrese aclaraciones sobre el estado del lote, precintos u observaciones del depósito..."
              rows={3}
              value={data.observaciones || ''}
              onChange={(e) => setData('observaciones', e.target.value)}
            />
            {errors.observaciones && (
              <p className="text-xs font-medium text-destructive">{errors.observaciones}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" disabled={processing || !canSubmit}>
              <FileCheck className="mr-2 h-5 w-5" /> Generar Remito Interno
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

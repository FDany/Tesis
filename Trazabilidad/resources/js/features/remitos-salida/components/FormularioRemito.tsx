import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, FileInput } from 'lucide-react';
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
            <FileInput className="h-5 w-5 text-primary" />
            Datos del Remito Oficial de DGM
          </CardTitle>
          <CardDescription>
            Ingrese los datos impresos en el remito físico entregado por la empresa de retiro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_remito">N° / Código Remito DGM *</Label>
              <Input
                id="numero_remito"
                placeholder="Ej: 0001-00045892"
                value={data.numero_remito}
                onChange={(e) => setData('numero_remito', e.target.value)}
                required
              />
              {errors.numero_remito && (
                <p className="text-xs font-medium text-destructive">{errors.numero_remito}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_retiro">Fecha y Hora de Retiro *</Label>
              <Input
                id="fecha_retiro"
                type="datetime-local"
                value={data.fecha_retiro}
                onChange={(e) => setData('fecha_retiro', e.target.value)}
                required
              />
              {errors.fecha_retiro && (
                <p className="text-xs font-medium text-destructive">{errors.fecha_retiro}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad_declarada">Cant. Bolsas Declaradas DGM *</Label>
              <Input
                id="cantidad_declarada"
                type="number"
                min="1"
                placeholder="Ej: 10"
                value={data.cantidad_bolsas_declaradas_Empresa || ''}
                onChange={(e) =>
                  setData('cantidad_bolsas_declaradas_Empresa', Number(e.target.value))
                }
                required
              />
              {errors.cantidad_bolsas_declaradas_Empresa && (
                <p className="text-xs font-medium text-destructive">
                  {errors.cantidad_bolsas_declaradas_Empresa}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsable_empresa">Responsable DGM (Chofer/Retira) *</Label>
              <Input
                id="responsable_empresa"
                placeholder="Nombre y apellido del chofer"
                value={data.responsable_empresa}
                onChange={(e) => setData('responsable_empresa', e.target.value)}
                required
              />
              {errors.responsable_empresa && (
                <p className="text-xs font-medium text-destructive">{errors.responsable_empresa}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="datos_transporte">Datos del Transporte (Patente/Dominio)</Label>
              <Input
                id="datos_transporte"
                placeholder="Ej: AB 123 CD - Transporte San Bernardo"
                value={data.datos_transporte || ''}
                onChange={(e) => setData('datos_transporte', e.target.value)}
              />
              {errors.datos_transporte && (
                <p className="text-xs font-medium text-destructive">{errors.datos_transporte}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Aclaraciones sobre el retiro o motivo de discrepancia..."
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
              <Save className="mr-2 h-5 w-5" /> Confirmar y Registrar Despacho
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { TipoBolsa, CreateTipoBolsaDTO } from '../types/tipoBolsa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TipoBolsa | null;
}

export const TipoBolsaModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const { data, setData, post, put, processing, errors, reset, clearErrors } =
    useForm<CreateTipoBolsaDTO>({
      tipo_residuo: '',
      color: '',
      proveedor: '',
    });

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      if (initialData) {
        setData({
          tipo_residuo: initialData.tipo_residuo,
          color: initialData.color,
          proveedor: initialData.proveedor || '',
        });
      } else {
        reset();
      }
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && initialData?.id) {
      // Ruta escrita directamente para actualización (PUT)
      put(`/tipos-bolsa/${initialData.id}`, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      // Ruta escrita directamente para creación (POST)
      post('/tipos-bolsa', {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? 'Editar Tipo de Bolsa / Residuo'
              : 'Nuevo Tipo de Bolsa / Residuo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="tipo_residuo">Tipo / Flujo de Residuo</Label>
            <Input
              id="tipo_residuo"
              placeholder="Ej: Patogénico, Peligroso, Común"
              value={data.tipo_residuo}
              onChange={(e) => setData('tipo_residuo', e.target.value)}
            />
            {errors.tipo_residuo && (
              <p className="text-sm font-medium text-destructive">
                {errors.tipo_residuo}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              placeholder="Ej: Rojo, Amarillo, Negro"
              value={data.color}
              onChange={(e) => setData('color', e.target.value)}
            />
            {errors.color && (
              <p className="text-sm font-medium text-destructive">
                {errors.color}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor (Opcional)</Label>
            <Input
              id="proveedor"
              placeholder="Ej: Plásticos S.A."
              value={data.proveedor as string}
              onChange={(e) => setData('proveedor', e.target.value)}
            />
            {errors.proveedor && (
              <p className="text-sm font-medium text-destructive">
                {errors.proveedor}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

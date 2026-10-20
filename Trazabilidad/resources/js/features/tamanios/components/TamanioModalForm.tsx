import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Tamanio, CreateTamanioDTO } from '../types/tamanio';
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
  initialData?: Tamanio | null;
}

export const TamanioModalForm: React.FC<Props> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const { data, setData, post, put, processing, errors, reset, clearErrors } =
    useForm<CreateTamanioDTO>({
      nombre: '',
    });

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      if (initialData) {
        setData({
          nombre: initialData.nombre,
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
      put(`/tamanios/${initialData.id}`, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      // Ruta escrita directamente para creación (POST)
      post('/tamanios', {
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
              ? 'Editar Tamaño de Bolsa / Residuo'
              : 'Nuevo Tamaño de Bolsa / Residuo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Ej: Pequeño, Mediano, Grande"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
            />
            {errors.nombre && (
              <p className="text-sm font-medium text-destructive">
                {errors.nombre}
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

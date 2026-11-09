import React, { useEffect, useState } from 'react';
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

import { HexColorInput, HexColorPicker } from 'react-colorful';


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

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const selectedColor = data.color || '#000000';

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
              autoComplete="off"
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

          {/* <div className="space-y-2">
            <Label htmlFor="color">
              Color
              </Label>
            <Input
              id="color"
              type="color"
              value={data.color || '#000000'}
              onChange={(e) => setData('color', e.target.value)}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label="Seleccionar color"
            />
          </div> */}


          {/* <div className="space-y-2">
            <div className="flex items-start gap-4">
              <Label htmlFor="color" className="pt-2">
                Color
              </Label>

              
              <label
                className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full border"
                aria-label="Seleccionar color"
              >
                <span
                  className="size-full rounded-full"
                  style={{ backgroundColor: data.color || '#000000' }}
                />
                <input
                  id="color"
                  type="color"
                  value={data.color || '#000000'}
                  onChange={(e) => setData('color', e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  aria-label="Seleccionar color"
                />
              </label>

            </div>

              {errors.color && (
                <p className="text-sm font-medium text-destructive">
                  {errors.color}
                </p>
              )}
          </div> */}



          <div className="flex items-start gap-4">
            <span className="pt-2 text-sm font-medium">
              Color
            </span>

            <div className="relative flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => setColorPickerOpen((open) => !open)}
                className="size-10 cursor-pointer rounded-full border"
                style={{ backgroundColor: selectedColor }}
                aria-label="Abrir selector de color"
                aria-expanded={colorPickerOpen}
              />


              {colorPickerOpen && (
                <div className="absolute left-full top-1/2 z-[60] ml-2 -translate-y-1/2 rounded-md border bg-background p-3 shadow-lg">
                  <HexColorPicker
                    color={selectedColor}
                    onChange={(color) => setData('color', color)}
                  />

                  <HexColorInput
                    id="color"
                    name="color"
                    autoComplete="off"
                    color={selectedColor}
                    onChange={(color) => setData('color', color.toUpperCase())}
                    prefixed
                    className="mt-2 w-full rounded-md border bg-background px-2 py-1 text-sm uppercase"
                  />
                </div>
              )}
            </div>
          </div>





















          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Input
              id="proveedor"
              required
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

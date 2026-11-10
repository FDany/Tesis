import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Incidencia } from '../types/incidencia';

interface Props {
  incidencia: Incidencia | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResolverIncidenciaModal({ incidencia, open, onOpenChange }: Props) {
  const { data, setData, patch, processing, errors, reset } = useForm({
    accion_adoptada: '',
    estado: 'RESUELTA',
  });

  // Al abrir el modal o cambiar de incidencia, cargar la acción adoptada previa (si existe)
  useEffect(() => {
    if (incidencia) {
      setData({
        accion_adoptada: incidencia.accion_adoptada || '',
        estado: incidencia.estado === 'ABIERTA' ? 'RESUELTA' : incidencia.estado,
      });
    }
  }, [incidencia]);

  if (!incidencia) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/incidencias/${incidencia.id}/resolver`, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Resolver Incidencia #{incidencia.id}</DialogTitle>
          <DialogDescription>
            Registra las acciones correctivas adoptadas para dar resolución o cierre a esta incidencia.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Selección del nuevo estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Nuevo Estado</Label>
            <Select
              value={data.estado}
              onValueChange={(val) => setData('estado', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN_ANALISIS">En Análisis</SelectItem>
                <SelectItem value="RESUELTA">Resuelta</SelectItem>
                <SelectItem value="CERRADA">Cerrada</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado && (
              <p className="text-xs text-destructive">{errors.estado}</p>
            )}
          </div>

          {/* Campo para la acción adoptada */}
          <div className="space-y-2">
            <Label htmlFor="accion_adoptada">Acción Adoptada *</Label>
            <Textarea
              id="accion_adoptada"
              rows={4}
              placeholder="Describa el motivo, procedimiento o resolución aplicada..."
              value={data.accion_adoptada}
              onChange={(e) => setData('accion_adoptada', e.target.value)}
            />
            {errors.accion_adoptada && (
              <p className="text-xs text-destructive">{errors.accion_adoptada}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar Resolución'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

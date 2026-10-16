import { useForm } from '@inertiajs/react';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RemitoRecepcionModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tiposBolsa: TipoBolsa[];
}

export function RemitoRecepcionModalForm({
  open,
  onOpenChange,
  tiposBolsa = [],
}: RemitoRecepcionModalFormProps) {
  // Hook nativo de Inertia
  const { data, setData, post, processing, errors, reset, clearErrors } =
    useForm({
      fecha_recepcion: '',
      tipo_bolsa_id: '',
      tamanio: 'Mediano',
      cantidad_declarada: '',
      codigo_inicio: '',
      codigo_fin: '',
      observaciones: '',
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/remitos-recepcion', {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      clearErrors();
      reset();
    }
    onOpenChange(isOpen);
  };

  const inputStyle =
    'border border-slate-400 bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 shadow-sm transition-all';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150 cursor-default select-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Registrar Nuevo Remito de Recepción
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 cursor-default">
          {/* Fila 1: Fecha de Recepción */}
          <div className="space-y-1">
            <Label htmlFor="fecha_recepcion" className="font-medium cursor-default">
              Fecha de Recepción
            </Label>
            <Input
              id="fecha_recepcion"
              type="datetime-local"
              className={`${inputStyle} cursor-text`}
              value={data.fecha_recepcion}
              onChange={(e) => setData('fecha_recepcion', e.target.value)}
            />
            {errors.fecha_recepcion && (
              <span className="text-xs text-destructive">{errors.fecha_recepcion}</span>
            )}
          </div>

          {/* Fila 2: Tipo de Bolsa y Tamaño */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-medium cursor-default">Tipo de Bolsa</Label>
              <Select
                value={String(data.tipo_bolsa_id)}
                onValueChange={(val) => setData('tipo_bolsa_id', val)}
              >
                <SelectTrigger className={`${inputStyle} cursor-pointer`}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposBolsa.map((tb) => (
                    <SelectItem key={tb.id} value={String(tb.id)}>
                      {tb.tipo_residuo} ({tb.color})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo_bolsa_id && (
                <span className="text-xs text-destructive">{errors.tipo_bolsa_id}</span>
              )}
            </div>

            <div className="space-y-1">
              <Label className="font-medium cursor-default">Tamaño</Label>
              <Select
                value={data.tamanio}
                onValueChange={(val) => setData('tamanio', val)}
              >
                <SelectTrigger className={`${inputStyle} cursor-pointer`}>
                  <SelectValue placeholder="Seleccionar tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chico">Chico</SelectItem>
                  <SelectItem value="Mediano">Mediano</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
              {errors.tamanio && (
                <span className="text-xs text-destructive">{errors.tamanio}</span>
              )}
            </div>
          </div>

          {/* Fila 3: Cantidad Declarada y Rangos Manuscritos */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="cantidad_declarada" className="font-medium cursor-default">
                Cant. Declarada
              </Label>
              <Input
                id="cantidad_declarada"
                type="number"
                min="1"
                placeholder="Ej: 100"
                className={`${inputStyle} cursor-text`}
                value={data.cantidad_declarada}
                onChange={(e) => setData('cantidad_declarada', e.target.value)}
              />
              {errors.cantidad_declarada && (
                <span className="text-xs text-destructive">{errors.cantidad_declarada}</span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="codigo_inicio" className="font-medium cursor-default">
                Código Inicio
              </Label>
              <Input
                id="codigo_inicio"
                placeholder="Ej: 3-39836"
                className={`${inputStyle} cursor-text`}
                value={data.codigo_inicio}
                onChange={(e) => setData('codigo_inicio', e.target.value)}
              />
              {errors.codigo_inicio && (
                <span className="text-xs text-destructive">{errors.codigo_inicio}</span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="codigo_fin" className="font-medium cursor-default">
                Código Fin
              </Label>
              <Input
                id="codigo_fin"
                placeholder="Ej: 3-39935"
                className={`${inputStyle} cursor-text`}
                value={data.codigo_fin}
                onChange={(e) => setData('codigo_fin', e.target.value)}
              />
              {errors.codigo_fin && (
                <span className="text-xs text-destructive">{errors.codigo_fin}</span>
              )}
            </div>
          </div>

          {/* Fila 4: Observaciones */}
          <div className="space-y-1">
            <Label htmlFor="observaciones" className="font-medium cursor-default">
              Observaciones
            </Label>
            <Textarea
              id="observaciones"
              placeholder="Detalles o notas adicionales sobre el remito..."
              rows={3}
              className={`${inputStyle} cursor-text`}
              value={data.observaciones}
              onChange={(e) => setData('observaciones', e.target.value)}
            />
            {errors.observaciones && (
              <span className="text-xs text-destructive">{errors.observaciones}</span>
            )}
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              className="border-2 border-black bg-white hover:bg-zinc-100 text-black font-semibold shadow-sm px-4 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-black hover:bg-zinc-800 text-white font-semibold shadow-sm px-4 cursor-pointer"
            >
              {processing ? 'Guardando...' : 'Guardar y Generar Bolsas'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

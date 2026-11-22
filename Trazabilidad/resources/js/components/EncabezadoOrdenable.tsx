import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface EncabezadoOrdenableProps<T extends string> {
  campo: T;
  etiqueta: string;
  ordenActual: string;
  direccionActual: string;
  onOrdenar: (campo: T) => void;
  className?: string;
}

export function EncabezadoOrdenable<T extends string>({
  campo,
  etiqueta,
  ordenActual,
  direccionActual,
  onOrdenar,
  className,
}: EncabezadoOrdenableProps<T>) {
  const activo = ordenActual === campo;
  const Icono = !activo
    ? ArrowUpDown
    : direccionActual === 'asc'
      ? ArrowUp
      : ArrowDown;

  return (
    <TableHead
      aria-sort={
        !activo
          ? 'none'
          : direccionActual === 'asc'
            ? 'ascending'
            : 'descending'
      }
      className={className}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onOrdenar(campo)}
        className="-ml-3 h-8 gap-1.5 font-medium hover:bg-transparent hover:text-foreground"
      >
        <span>{etiqueta}</span>
        <Icono
          aria-hidden="true"
          className={`size-4 transition-colors ${
            activo ? 'text-foreground' : 'text-muted-foreground/50'
          }`}
        />
      </Button>
    </TableHead>
  );
}
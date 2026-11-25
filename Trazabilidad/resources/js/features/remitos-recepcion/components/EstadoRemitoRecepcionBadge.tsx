import { Badge } from '@/components/ui/badge';

const ETIQUETAS_ESTADO: Record<string, string> = {
  PENDIENTE_CONTROL: 'Pendiente de control',
  CONCILIADO: 'Conciliado',
};

interface Props {
  estado: string;
}

export function EstadoRemitoRecepcionBadge({ estado }: Props) {
  return (
    <Badge variant={estado === 'CONCILIADO' ? 'default' : 'secondary'}>
      {ETIQUETAS_ESTADO[estado] ?? estado}
    </Badge>
  );
}

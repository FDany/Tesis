import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';


interface Props {
  valores: {
    buscar: string;
    estado: string;
  };
  onChange: (key: string, value: string) => void;
}

const etiquetasEstado: Record<string, string> = {
  PENDIENTE_RETIRO: 'Pendiente Retiro',
  CONCILIADO: 'Conciliado',
  CON_INCIDENCIA: 'Con Incidencia',
  FINALIZADO: 'Finalizado',
  ANULADO: 'Anulado',
};

export function RemitoSalidaFiltros({ valores, onChange }: Props) {
  const campos: CampoFiltro[] = [
    {
      key: 'buscar',
      label: 'N° Remito Interno o DGM',
      type: 'text',
      placeholder: 'Buscar por número de remito...',
    },
    {
      key: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'TODOS', label: 'Todos los estados' },
        ...Object.entries(etiquetasEstado).map(([value, label]) => ({
          value,
          label,
        })),
      ],
    },
  ];

  return (
    <FiltroGenerico
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      campos={campos}
      valores={{
        buscar: valores.buscar,
        estado: valores.estado || 'TODOS',
      }}
      onChange={onChange}
    />
  );
}

import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';
import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';
import { useState, type SubmitEvent } from 'react';


interface Props {
  filters: {
    estado?: string;
    tipo_incidencia?: string;
    registrado_por?: string;
  };
  estados: string[];
}

const etiquetasEstado: Record<string, string> = {
  ABIERTA: 'Abierta',
  EN_ANALISIS: 'En Análisis',
  RESUELTA: 'Resuelta',
  CERRADA: 'Cerrada',
};

export function IncidenciaFiltros({ filters, estados }: Props) {

  const [registradoPor, setRegistradoPor] = useState(filters.registrado_por ?? '');

  const valores = {
    estado: filters.estado || 'TODOS',
    tipo_incidencia: filters.tipo_incidencia || 'TODOS',
  };

  const campos: CampoFiltro[] = [
    {
      key: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'TODOS', label: 'Todos los Estados' },
        ...estados.map((estado) => ({
          value: estado,
          label: etiquetasEstado[estado] ?? estado,
        })),
      ],
    },
    {
      key: 'tipo_incidencia',
      label: 'Tipo de Incidencia',
      type: 'select',
      options: [
        { value: 'TODOS', label: 'Todos los Tipos' },
        {
          value: 'DIFERENCIA_CONCILIACION_DGM',
          label: 'Discrepancia Conciliación DGM',
        },
        { value: 'BOLSA_DANADA', label: 'Bolsa Dañada' },
        { value: 'PESO_FUERA_DE_RANGO', label: 'Peso Fuera de Rango' },
        { value: 'OTRA', label: 'Otra' },
      ],
    },
    {
      key: 'registrado_por',
      label: 'Registrado por',
      type: 'text',
      placeholder: 'Buscar por nombre o apellido...',
    },
  ];

  const handleFiltroChange = (key: string, value: string) => {
    if (key === 'registrado_por') {
      setRegistradoPor(value);
      return;
    }

    const nuevosFiltros = {
      ...filters,
      registrado_por: registradoPor.trim() || undefined,
      [key]: value === 'TODOS' ? undefined : value,
    };

    router.get('/incidencias', nuevosFiltros, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleLimpiarFiltros = () => {
    setRegistradoPor('');
    router.get('/incidencias', {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleBuscar = (event: SubmitEvent) => {
    event.preventDefault();

    router.get(
      '/incidencias',
      {
        ...filters,
        registrado_por: registradoPor.trim() || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

  const hayFiltrosActivos = Boolean(
    filters.estado || filters.tipo_incidencia || registradoPor.trim(),
  );


  return (
    <div className="flex flex-wrap items-end gap-3">
      <form onSubmit={handleBuscar} className="min-w-0 flex-1">
        <FiltroGenerico
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          campos={campos}
          valores={{
            ...valores,
            registrado_por: registradoPor,
          }}
          onChange={handleFiltroChange}
        />
        <button type="submit" className="sr-only">
          Buscar por usuario que registró
        </button>
      </form>

      {hayFiltrosActivos && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLimpiarFiltros}
          className="h-9 px-2 text-muted-foreground"
        >
          <FilterX className="mr-1 h-4 w-4" />
          Limpiar Filtros
        </Button>
      )}
    </div>
  );
}

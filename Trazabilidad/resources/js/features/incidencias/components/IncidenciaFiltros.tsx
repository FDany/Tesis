import React from 'react';
import { router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

interface Props {
  filters: {
    estado?: string;
    tipo_incidencia?: string;
  };
}

export function IncidenciaFiltros({ filters }: Props) {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === 'TODOS' ? undefined : value };
    router.get('/incidencias', newFilters, { preserveState: true, replace: true });
  };

  const handleReset = () => {
    router.get('/incidencias', {}, { preserveState: true, replace: true });
  };

  const hasActiveFilters = Boolean(filters.estado || filters.tipo_incidencia);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filtro por Estado */}
      <Select
        value={filters.estado || 'TODOS'}
        onValueChange={(val) => handleFilterChange('estado', val)}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los Estados</SelectItem>
          <SelectItem value="ABIERTA">Abierta</SelectItem>
          <SelectItem value="EN_ANALISIS">En Análisis</SelectItem>
          <SelectItem value="RESUELTA">Resuelta</SelectItem>
          <SelectItem value="CERRADA">Cerrada</SelectItem>
        </SelectContent>
      </Select>

      {/* Filtro por Tipo */}
      <Select
        value={filters.tipo_incidencia || 'TODOS'}
        onValueChange={(val) => handleFilterChange('tipo_incidencia', val)}
      >
        <SelectTrigger className="w-65">
          <SelectValue placeholder="Tipo de Incidencia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los Tipos</SelectItem>
          <SelectItem value="DISCREPANCIA_CONCILIACION_DGM">Discrepancia Conciliación DGM</SelectItem>
          <SelectItem value="BOLSA_DAÑADA">Bolsa Dañada</SelectItem>
          <SelectItem value="PESO_FUERA_DE_RANGO">Peso Fuera de Rango</SelectItem>
          <SelectItem value="OTRO">Otro</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-2 text-muted-foreground">
          <FilterX className="h-4 w-4 mr-1" />
          Limpiar Filtros
        </Button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  TipoBolsaModalForm,
  TipoBolsaTable,
  type TipoBolsa
} from '@/features/tipos-bolsa';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import Paginacion, {
  type PaginacionData,
} from '@/components/Paginador';

import CantFilas from '@/components/CantFilas';


// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
  tiposBolsa: PaginacionData & { data: TipoBolsa[] };
  porPagina: number;
  opcionesPorPagina: number[];
}

export function TiposBolsaPage({
  tiposBolsa,
  porPagina,
  opcionesPorPagina,
}: Props) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoBolsa | null>(null);

  // 2. Eliminación adaptada a Inertia
  const handleDelete = (id: number) => {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este tipo de bolsa?')) {
      router.delete(`/tipos-bolsa/${id}`, {
        onError: () => {
          alert('No se pudo eliminar el tipo de bolsa. Verifica que no tenga bolsas o remitos asociados.');
        },
      });
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTipo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tipo: TipoBolsa) => {
    setSelectedTipo(tipo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTipo(null);
  };

  const handlePorPaginaChange = (cantidad: number) => {
    router.get(
      '/tipos-bolsa',
      { por_pagina: cantidad },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className='p-8'>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Tipos de Bolsa / Residuos
          </h1>
          <p className="text-sm text-muted-foreground">
            Configura los flujos de residuos habilitados en el sistema.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Flujo
        </Button>
      </div>

      {/* Limitador de cantidad de filas */}
      <CantFilas
        value={porPagina}
        options={opcionesPorPagina}
        onChange={handlePorPaginaChange}
      />

      {/* La tabla recibe directamente las props de Inertia */}
      <TipoBolsaTable
        tiposBolsa={tiposBolsa.data}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* Paginacion */}
      <Paginacion pagination={tiposBolsa} />

      {/* El modal maneja sus propias llamadas POST/PUT mediante su useForm de Inertia */}
      <TipoBolsaModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedTipo}
      />
    </div>
  );
}

export default TiposBolsaPage;

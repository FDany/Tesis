import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  TipoBolsaModalForm,
  TipoBolsaTable,
  type TipoBolsa
} from '@/features/tipos-bolsa';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
  tiposBolsa: TipoBolsa[];
}

export const TiposBolsaPage: React.FC<Props> = ({ tiposBolsa }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Tipos de Bolsa / Residuos</h1>
          <p className="text-sm text-muted-foreground">
            Configura los flujos de residuos habilitados en el sistema.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Flujo
        </Button>
      </div>

      {/* La tabla recibe directamente las props de Inertia */}
      <TipoBolsaTable
        tiposBolsa={tiposBolsa}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* El modal maneja sus propias llamadas POST/PUT mediante su useForm de Inertia */}
      <TipoBolsaModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedTipo}
      />
    </div>
  );
};

export default TiposBolsaPage;

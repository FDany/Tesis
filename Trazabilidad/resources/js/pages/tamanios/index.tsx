import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  TamanioModalForm,
  TamanioTable,
  type Tamanio
} from '@/features/tamanios';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
  tamanios: Tamanio[];
}

export const TamaniosPage: React.FC<Props> = ({ tamanios }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTamanio, setSelectedTamanio] = useState<Tamanio | null>(null);

  // 2. Eliminación adaptada a Inertia
  const handleDelete = (id: number) => {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este tamaño de bolsa?')) {
      router.delete(`/tamanios/${id}`, {
        onError: () => {
          alert('No se pudo eliminar el tamaño de bolsa. Verifica que no tenga bolsas o remitos asociados.');
        },
      });
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTamanio(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tamanio: Tamanio) => {
    setSelectedTamanio(tamanio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTamanio(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Tamaños de Bolsa</h1>
          <p className="text-sm text-muted-foreground">
            Configura los tamaños de bolsa habilitados en el sistema.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Tamaño
        </Button>
      </div>

      {/* La tabla recibe directamente las props de Inertia */}
      <TamanioTable
        tamanios={tamanios}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* El modal maneja sus propias llamadas POST/PUT mediante su useForm de Inertia */}
      <TamanioModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedTamanio}
      />
    </div>
  );
};

export default TamaniosPage;

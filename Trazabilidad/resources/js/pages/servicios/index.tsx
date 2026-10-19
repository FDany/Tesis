import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  ServicioModalForm,
  ServicioTable,
  type Servicio
} from '@/features/servicios';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
  servicios: Servicio[];
}

export const ServiciosPage: React.FC<Props> = ({ servicios }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);

  // 2. Eliminación adaptada a Inertia
  const handleDelete = (id: number) => {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      router.delete(`/servicios/${id}`, {
        onError: () => {
          alert('No se pudo eliminar el servicio. Verifica que no tenga bolsas o remitos asociados.');
        },
      });
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedServicio(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedServicio(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Servicios</h1>
          <p className="text-sm text-muted-foreground">
            Configura los servicios habilitados en el sistema.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Servicio
        </Button>
      </div>

      {/* La tabla recibe directamente las props de Inertia */}
      <ServicioTable
        servicios={servicios}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* El modal maneja sus propias llamadas POST/PUT mediante su useForm de Inertia */}
      <ServicioModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedServicio}
      />
    </div>
  );
};

export default ServiciosPage;

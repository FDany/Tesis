import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  ServicioModalForm,
  ServicioTable,
  type Servicio
} from '@/features/servicios';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
  servicios: Servicio[];
}

export const ServiciosPage: React.FC<Props> = ({ servicios }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);

  // Estados para el diálogo de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 2. Eliminación adaptada a Inertia con ConfirmDeleteDialog
  const handleDelete = (id: number) => {
    if (!id) return;
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const ejecutarEliminacion = () => {
    if (!idToDelete) return;

    setIsDeleting(true);
    router.delete(`/servicios/${idToDelete}`, {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setIdToDelete(null);
      },
      onError: () => {
        setIsDeleteModalOpen(false);
        setIdToDelete(null);
      },
      onFinish: () => setIsDeleting(false),
    });
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
      <FlashMessage />

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

      <ConfirmDeleteDialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setIdToDelete(null);
        }}
        title="¿Eliminar servicio?"
        description="Estás a punto de borrar este servicio permanentemente. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar servicio"
        onConfirm={ejecutarEliminacion}
        processing={isDeleting}
      />
    </div>
  );
};

export default ServiciosPage;

import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    TamanioModalForm,
    TamanioTable,
    type Tamanio
} from '@/features/tamanios';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';

// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
    tamanios: Tamanio[];
}

export const TamaniosPage: React.FC<Props> = ({ tamanios }) => {
    const { can } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTamanio, setSelectedTamanio] = useState<Tamanio | null>(null);

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
        router.delete(`/tamanios/${idToDelete}`, {
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
            <FlashMessage />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Tamaños de Bolsa</h1>
                    <p className="text-sm text-muted-foreground">
                        Configura los tamaños de bolsa habilitados en el sistema.
                    </p>
                </div>
                {can('crear tamBolsas') && (
                    <Button onClick={handleOpenCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Tamaño
                    </Button>
                )}
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

            <ConfirmDeleteDialog
                open={isDeleteModalOpen}
                onOpenChange={(open) => {
                    setIsDeleteModalOpen(open);
                    if (!open) setIdToDelete(null);
                }}
                title="¿Eliminar tamaño de bolsa?"
                description="Estás a punto de borrar este tamaño de bolsa permanentemente. Esta acción no se puede deshacer."
                confirmLabel="Sí, eliminar tamaño"
                onConfirm={ejecutarEliminacion}
                processing={isDeleting}
            />
        </div>
    );
};

export default TamaniosPage;

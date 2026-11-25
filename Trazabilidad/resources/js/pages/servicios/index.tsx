import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import {
    ServicioModalForm,
    ServicioTable,
    type Servicio
} from '@/features/servicios';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import Paginacion, {
    type PaginacionData,
} from '@/components/Paginador';

import CantFilas from '@/components/CantFilas';
import { useAuth } from '@/hooks/use-auth';

// 1. Los datos vienen directamente como props desde el controlador de Laravel
interface Props {
    servicios: PaginacionData & { data: Servicio[] };
    porPagina: number;
    opcionesPorPagina: number[];
}

export const ServiciosPage: React.FC<Props> = ({ servicios, porPagina, opcionesPorPagina }) => {
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

    const handlePorPaginaChange = (cantidad: number) => {
        router.get(
            '/servicios',
            { por_pagina: cantidad },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const { can } = useAuth();

    return (
        <div className="p-6 space-y-6">
            <Head title="Servicios" />
            <FlashMessage />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Servicios</h1>
                    <p className="text-sm text-muted-foreground">
                        Configura los servicios habilitados en el sistema.
                    </p>
                </div>
                {(can('crear servicios')) && (
                    <Button onClick={handleOpenCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Servicio
                    </Button>)}
            </div>

            {/* Limitador de cantidad de filas */}
            <CantFilas
                value={porPagina}
                options={opcionesPorPagina}
                onChange={handlePorPaginaChange}
                total={servicios.total}
            />

            {/* La tabla recibe directamente las props de Inertia */}
            <ServicioTable
                servicios={servicios.data}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
            />

            {/* Paginacion */}
            <Paginacion pagination={servicios} />

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

import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'; // ajusta la ruta según donde lo guardes
import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { RoleTable } from '@/features/roles-y-permisos/components/RoleTable';
import type {
    Role,
    RolesIndexProps,
} from '@/features/roles-y-permisos/types/rolYPermiso';
import { useAuth } from '@/hooks/use-auth';

export default function RolesIndex({ roles }: RolesIndexProps) {
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDeleteRole() {
        if (!roleToDelete) return;

        router.delete(`/roles/${roleToDelete.id}`, {
            preserveScroll: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                setRoleToDelete(null);
            },
        });
    }

    const { can } = useAuth();

    return (
        <>
            <Head title="Roles" />
            <FlashMessage />

            <div className="space-y-6 p-4">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Gestión de roles
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Administra los roles y permisos que se asignan a los
                            usuarios.
                        </p>
                    </div>

                    {(can('crear roles')) && (
                        <Button asChild>
                            <Link href="/roles/create">
                                <Plus className="size-4" />
                                Nuevo rol
                            </Link>
                        </Button>)}
                </header>

                <RoleTable
                    roles={roles}
                    onDelete={(role) => setRoleToDelete(role)}
                />
            </div>

            <ConfirmDeleteDialog
                open={Boolean(roleToDelete)}
                onOpenChange={(open) => !open && setRoleToDelete(null)}
                title={`¿Eliminar rol "${roleToDelete?.name}"?`}
                description="Estás a punto de borrar este rol permanentemente. Esta acción no se puede deshacer."
                confirmLabel="Sí, eliminar rol"
                onConfirm={confirmDeleteRole}
                processing={deleting}
            />
        </>
    );
}

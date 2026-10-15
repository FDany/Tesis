import { Link, router } from '@inertiajs/react';
import type { User as AuthUser } from '@/types/auth';
import { useState, type ComponentProps } from 'react';
import type { User } from '@/types/auth';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

interface UserTableProps {
    users: Pick<
        AuthUser,
        'id' | 'first_name' | 'last_name' | 'dni' | 'roles'
    >[];
}

export function UserTable({ users }: UserTableProps) {
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | undefined>();

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setDeleteError(undefined);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (idSeleccionado === null) return;

        setIsDeleting(true);
        setDeleteError(undefined);
        router.delete(`/users/${idSeleccionado}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setIdSeleccionado(null);
            },
            onError: (errors) => {
                setDeleteError(
                    errors.user ?? 'No se pudo eliminar el usuario.',
                );
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-t-0">
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellido</TableHead>
                            <TableHead>DNI</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No se encontraron usuarios registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const rolesList =
                                    user.roles
                                        ?.map((role) => role.name)
                                        .join(', ') || 'Sin rol';

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.first_name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user.last_name}
                                        </TableCell>
                                        <TableCell>{user.dni}</TableCell>
                                        <TableCell className="capitalize">
                                            <Badge variant="secondary">
                                                {rolesList}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Link
                                                        href={`/users/${user.id}/edit`}
                                                        aria-label={`Editar usuario ${user.first_name} ${user.last_name}`}
                                                        title="Editar"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    aria-label={`Eliminar usuario ${user.first_name} ${user.last_name}`}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    if (!isDeleting) setIsModalOpen(open);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar usuario?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el
                            usuario seleccionado.
                        </DialogDescription>
                    </DialogHeader>
                    <InputError message={deleteError} />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isDeleting}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={ejecutarEliminacion}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

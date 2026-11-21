import { Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { User as AuthUser } from '@/types/auth';

type UserTableItem = Pick<
    AuthUser,
    'id' | 'first_name' | 'last_name' | 'dni' | 'roles'
>;

interface UserTableProps {
    users: UserTableItem[];
}

export function UserTable({ users }: UserTableProps) {
    const [userToDelete, setUserToDelete] = useState<UserTableItem | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (user: UserTableItem) => {
        setUserToDelete(user);
    };

    const ejecutarEliminacion = () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        router.delete(`/users/${userToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setUserToDelete(null);
            },
            onError: () => {
                setUserToDelete(null);
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
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.first_name}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.last_name}
                                    </TableCell>
                                    <TableCell>{user.dni}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.roles &&
                                            user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        variant="secondary"
                                                        className="capitalize"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="outline">
                                                    Sin rol
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="icon"
                                            >
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    aria-label={`Editar usuario ${user.first_name} ${user.last_name}`}
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                aria-label={`Eliminar usuario ${user.first_name} ${user.last_name}`}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDeleteDialog
                open={Boolean(userToDelete)}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setUserToDelete(null);
                }}
                title={`¿Eliminar usuario "${userToDelete?.first_name} ${userToDelete?.last_name}"?`}
                description="Estás a punto de borrar este usuario permanentemente. Esta acción no se puede deshacer."
                confirmLabel="Sí, eliminar usuario"
                onConfirm={ejecutarEliminacion}
                processing={isDeleting}
            />
        </>
    );
}

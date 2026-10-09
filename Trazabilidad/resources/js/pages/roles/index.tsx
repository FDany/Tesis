import { Head, router, useForm, usePage } from '@inertiajs/react';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Role = {
    id: number;
    name: string;
    users_count: number;
};

type PageProps = {
    roles: Role[];
    flash: {
        success: string | null;
        error: string | null;
    };
};

export default function RolesIndex({ roles }: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const form = useForm({
        name: '',
    });

    function openCreateDialog() {
        setEditingRole(null);
        form.reset();
        form.clearErrors();
        setDialogOpen(true);
    }

    function openEditDialog(role: Role) {
        setEditingRole(role);
        form.setData('name', role.name);
        form.clearErrors();
        setDialogOpen(true);
    }

    function submitRole(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const options = {
            onSuccess: () => {
                setDialogOpen(false);
                form.reset();
            },
        };

        if (editingRole) {
            form.put(`/roles/${editingRole.id}`, options);
            return;
        }

        form.post('/roles', options);
    }

    function deleteRole(role: Role) {
        if (
            !window.confirm(
                `¿Seguro que deseas eliminar el rol "${role.name}"?`,
            )
        ) {
            return;
        }

        router.delete(`/roles/${role.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Gestión de roles" />

            <div className="space-y-6 p-4">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Gestión de roles
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Administra los roles que se pueden asignar a los
                            usuarios.
                        </p>
                    </div>

                    <Button onClick={openCreateDialog}>
                        <Plus />
                        Nuevo rol
                    </Button>
                </header>

                {flash.success && (
                    <p className="rounded-md bg-green-100 p-3 text-sm text-green-800">
                        {flash.success}
                    </p>
                )}

                {flash.error && (
                    <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {flash.error}
                    </p>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3">Rol</th>
                                <th className="p-3">Usuarios asignados</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id} className="border-t">
                                    <td className="p-3 font-medium">
                                        {role.name}
                                    </td>
                                    <td className="p-3">{role.users_count}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-foreground"
                                                disabled={role.name === 'admin'}
                                                onClick={() =>
                                                    openEditDialog(role)
                                                }
                                                aria-label={`Editar rol ${role.name}`}
                                                title="Editar"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                disabled={
                                                    role.name === 'admin' ||
                                                    role.users_count > 0
                                                }
                                                title={
                                                    role.users_count > 0
                                                        ? 'Primero quita el rol a todos sus usuarios.'
                                                        : 'Eliminar'
                                                }
                                                aria-label={`Eliminar rol ${role.name}`}
                                                onClick={() => deleteRole(role)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {roles.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        No hay roles registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingRole ? 'Editar rol' : 'Nuevo rol'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingRole
                                ? 'Modifica el nombre del rol.'
                                : 'Ingresa el nombre del nuevo rol.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitRole} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role-name">Nombre</Label>
                            <Input
                                id="role-name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                autoFocus
                                required
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={form.processing}
                            >
                                Cancelar
                            </Button>

                            <Button type="submit" disabled={form.processing}>
                                {form.processing
                                    ? 'Guardando...'
                                    : editingRole
                                      ? 'Guardar cambios'
                                      : 'Crear rol'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

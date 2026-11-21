import { Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Permission, RoleFormValues } from '../types/rolYPermiso';

type RoleFormProps = {
    permissions: Permission[];
    initialValues?: Required<RoleFormValues>;
};

function groupPermissionsByModule(permissions: Permission[]) {
    const groups: Record<string, Permission[]> = {};

    for (const permission of permissions) {
        const parts = permission.name.trim().split(/[\s.:_-]+/);
        const rawGroup =
            parts.length > 1 ? parts[parts.length - 1] : 'General';

        const groupLabel =
            rawGroup.charAt(0).toUpperCase() + rawGroup.slice(1);

        if (!groups[groupLabel]) {
            groups[groupLabel] = [];
        }

        groups[groupLabel].push(permission);
    }

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export function RoleForm({ permissions, initialValues }: RoleFormProps) {
    const isEditing = Boolean(initialValues?.id);

    const form = useForm<RoleFormValues>({
        name: initialValues?.name ?? '',
        permissions: initialValues?.permissions ?? [],
    });

    const groupedPermissions = useMemo(
        () => groupPermissionsByModule(permissions),
        [permissions],
    );

    const allSelected =
        permissions.length > 0 &&
        form.data.permissions.length === permissions.length;

    function togglePermission(permissionName: string, checked: boolean) {
        if (checked) {
            form.setData(
                'permissions',
                Array.from(new Set([...form.data.permissions, permissionName])),
            );
            return;
        }

        form.setData(
            'permissions',
            form.data.permissions.filter((name) => name !== permissionName),
        );
    }

    function toggleAllPermissions() {
        if (allSelected) {
            form.setData('permissions', []);
            return;
        }

        form.setData(
            'permissions',
            permissions.map((permission) => permission.name),
        );
    }

    function toggleGroupPermissions(groupPermissions: Permission[]) {
        const groupNames = groupPermissions.map((p) => p.name);
        const allGroupSelected = groupNames.every((name) =>
            form.data.permissions.includes(name),
        );

        if (allGroupSelected) {
            form.setData(
                'permissions',
                form.data.permissions.filter(
                    (name) => !groupNames.includes(name),
                ),
            );
            return;
        }

        form.setData(
            'permissions',
            Array.from(new Set([...form.data.permissions, ...groupNames])),
        );
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isEditing && initialValues?.id) {
            form.put(`/roles/${initialValues.id}`);
            return;
        }

        form.post('/roles');
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="max-w-md space-y-2">
                <Label htmlFor="role-name">Nombre del rol</Label>
                <Input
                    id="role-name"
                    value={form.data.name}
                    onChange={(event) =>
                        form.setData('name', event.target.value)
                    }
                    placeholder="Ej. supervisor_deposito"
                    autoFocus
                    required
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 className="text-base font-semibold">Permisos</h2>
                        <p className="text-sm text-muted-foreground">
                            Selecciona los permisos que tendrá este rol (
                            {form.data.permissions.length} de{' '}
                            {permissions.length} seleccionados).
                        </p>
                    </div>

                    {permissions.length > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAllPermissions}
                        >
                            {allSelected
                                ? 'Quitar todos'
                                : 'Seleccionar todos'}
                        </Button>
                    )}
                </div>

                <InputError message={form.errors.permissions} />

                {groupedPermissions.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {groupedPermissions.map(
                            ([groupName, groupPermissions]) => {
                                const allGroupChecked = groupPermissions.every(
                                    (p) =>
                                        form.data.permissions.includes(p.name),
                                );

                                return (
                                    <div
                                        key={groupName}
                                        className="space-y-3 rounded-lg border p-4"
                                    >
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <span className="text-sm font-semibold">
                                                {groupName}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleGroupPermissions(
                                                        groupPermissions,
                                                    )
                                                }
                                                className="text-xs text-primary hover:underline"
                                            >
                                                {allGroupChecked
                                                    ? 'Quitar grupo'
                                                    : 'Marcar grupo'}
                                            </button>
                                        </div>

                                        <div className="space-y-2.5">
                                            {groupPermissions.map(
                                                (permission) => {
                                                    const checkboxId = `permission-${permission.id}`;
                                                    const isChecked =
                                                        form.data.permissions.includes(
                                                            permission.name,
                                                        );

                                                    return (
                                                        <div
                                                            key={permission.id}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                id={checkboxId}
                                                                checked={
                                                                    isChecked
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    togglePermission(
                                                                        permission.name,
                                                                        checked ===
                                                                            true,
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={
                                                                    checkboxId
                                                                }
                                                                className="cursor-pointer text-sm font-normal"
                                                            >
                                                                {
                                                                    permission.name
                                                                }
                                                            </Label>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                ) : (
                    <p className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                        No hay permisos disponibles para asignar.
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={form.processing}
                    asChild
                >
                    <Link href="/roles">Cancelar</Link>
                </Button>

                <Button type="submit" disabled={form.processing}>
                    {form.processing
                        ? 'Guardando...'
                        : isEditing
                          ? 'Guardar cambios'
                          : 'Crear rol'}
                </Button>
            </div>
        </form>
    );
}

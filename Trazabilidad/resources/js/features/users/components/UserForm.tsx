import { Link, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type UserRoleOption = {
    id: number;
    name: string;
};

export type UserFormRecord = {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    roles: UserRoleOption[];
};

type UserFormData = {
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    reset_password: boolean;
    roles: number[];
};

interface UserFormProps {
    user?: UserFormRecord | null;
    roles: UserRoleOption[];
}

export function UserForm({ user, roles }: UserFormProps) {
    const isEditing = Boolean(user?.id);

    const form = useForm<UserFormData>({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        dni: user?.dni ?? '',
        email: user?.email ?? '',
        reset_password: false,
        roles: user?.roles?.map((role) => role.id) ?? [],
    });

    function toggleRole(roleId: number, checked: boolean) {
        if (checked) {
            form.setData(
                'roles',
                Array.from(new Set([...form.data.roles, roleId])),
            );
            return;
        }

        form.setData(
            'roles',
            form.data.roles.filter((id) => id !== roleId),
        );
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isEditing && user?.id) {
            form.put(`/users/${user.id}`, {
                preserveScroll: true,
            });
            return;
        }

        form.post('/users', {
            preserveScroll: true,
        });
    }

    const roleItemError = Object.entries(form.errors).find(([key]) =>
        key.startsWith('roles.'),
    )?.[1];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                        id="first_name"
                        type="text"
                        value={form.data.first_name}
                        onChange={(e) =>
                            form.setData('first_name', e.target.value)
                        }
                        placeholder="Ej: Juan"
                        autoComplete="given-name"
                        required
                    />
                    <InputError message={form.errors.first_name} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                        id="last_name"
                        type="text"
                        value={form.data.last_name}
                        onChange={(e) =>
                            form.setData('last_name', e.target.value)
                        }
                        placeholder="Ej: Pérez"
                        autoComplete="family-name"
                        required
                    />
                    <InputError message={form.errors.last_name} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                        id="dni"
                        type="text"
                        value={form.data.dni}
                        onChange={(e) => form.setData('dni', e.target.value)}
                        placeholder="Ej: 12345678"
                        autoComplete="username"
                        required
                    />
                    <InputError message={form.errors.dni} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        autoComplete="email"
                        required
                    />
                    <InputError message={form.errors.email} />
                </div>
            </div>

            {isEditing ? (
                <div className="flex items-start space-x-3 rounded-lg border p-4">
                    <Checkbox
                        id="reset_password"
                        checked={form.data.reset_password}
                        onCheckedChange={(checked) =>
                            form.setData('reset_password', checked === true)
                        }
                    />
                    <div className="space-y-1 leading-none">
                        <Label
                            htmlFor="reset_password"
                            className="cursor-pointer text-sm font-medium"
                        >
                            Restablecer contraseña y enviar nueva clave por correo
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Se generará una nueva contraseña temporal aleatoria y
                            el usuario deberá cambiarla en su próximo inicio de
                            sesión.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                        Se generará una contraseña temporal automáticamente y se
                        enviará al correo electrónico registrado.
                    </p>
                </div>
            )}

            <fieldset className="space-y-3 rounded-lg border p-4">
                <legend className="px-1 text-sm font-medium">
                    Roles asignados ({form.data.roles.length})
                </legend>

                {roles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No hay roles disponibles.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {roles.map((role) => {
                            const checkboxId = `user-role-${role.id}`;
                            const isChecked = form.data.roles.includes(role.id);

                            return (
                                <div
                                    key={role.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={checkboxId}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            toggleRole(
                                                role.id,
                                                checked === true,
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor={checkboxId}
                                        className="cursor-pointer text-sm font-normal capitalize"
                                    >
                                        {role.name}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                )}

                <InputError message={form.errors.roles ?? roleItemError} />
            </fieldset>

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={form.processing}
                    asChild
                >
                    <Link href="/users">Cancelar</Link>
                </Button>

                <Button type="submit" disabled={form.processing}>
                    {form.processing
                        ? isEditing
                            ? 'Guardando...'
                            : 'Creando y enviando correo...'
                        : isEditing
                          ? 'Guardar cambios'
                          : 'Crear usuario'}
                </Button>
            </div>
        </form>
    );
}

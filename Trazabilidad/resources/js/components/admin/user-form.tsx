import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RoleOption = {
    id: number;
    name: string;
};

type UserRecord = {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    roles: RoleOption[];
};

export default function UserForm({
    user,
    roles,
}: {
    user?: UserRecord;
    roles: RoleOption[];
}) {
    const action = user ? `/users/${user.id}` : '/users';

    return (
        <Form
            action={action}
            method={user ? 'put' : 'post'}
            options={{ preserveScroll: true }}
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">Nombre</Label>
                        <Input
                            id="first_name"
                            name="first_name"
                            defaultValue={user?.first_name}
                            required
                            autoComplete="given-name"
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Apellido</Label>
                        <Input
                            id="last_name"
                            name="last_name"
                            defaultValue={user?.last_name}
                            required
                            autoComplete="family-name"
                        />
                        <InputError message={errors.last_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            name="dni"
                            defaultValue={user?.dni}
                            required
                            autoComplete="username"
                        />
                        <InputError message={errors.dni} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            defaultValue={user?.email}
                            required
                            autoComplete="email"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            {user
                                ? 'Nueva contraseña (opcional)'
                                : 'Contraseña'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required={!user}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">Roles</legend>
                        {roles.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No hay roles disponibles.
                            </p>
                        ) : (
                            roles.map((role) => (
                                <label
                                    key={role.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        name="roles[]"
                                        value={role.id}
                                        defaultChecked={user?.roles.some(
                                            (userRole) =>
                                                userRole.id === role.id,
                                        )}
                                    />
                                    {role.name}
                                </label>
                            ))
                        )}
                        <InputError message={errors.roles} />
                    </fieldset>

                    <div className="flex gap-3">
                        <Button disabled={processing}>
                            {user ? 'Guardar cambios' : 'Crear usuario'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

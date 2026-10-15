import { Form } from '@inertiajs/react';
import type { User, UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface UserFormProps {
    initialData?: User | null;
    roles: UserRole[];
    onCancel: () => void;
}

export function UserForm({
    initialData,
    roles,
    onCancel,
}: UserFormProps) {
    const action = initialData ? `/users/${initialData.id}` : '/users';
    const selectedRoleId =
        initialData?.roles?.[0]?.id ?? roles[0]?.id;

    const inputStyles =
        'w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700';

    return (
        <Form
            action={action}
            method={initialData ? 'put' : 'post'}
            options={{ preserveScroll: true }}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="first_name"
                                className="mb-1.5 block text-sm font-medium text-foreground"
                            >
                                Nombre
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                required
                                autoComplete="given-name"
                                className={inputStyles}
                                placeholder="Ej: Juan"
                                defaultValue={initialData?.first_name ?? ''}
                            />
                            <InputError message={errors.first_name} />
                        </div>

                        <div>
                            <label
                                htmlFor="last_name"
                                className="mb-1.5 block text-sm font-medium text-foreground"
                            >
                                Apellido
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                required
                                autoComplete="family-name"
                                className={inputStyles}
                                placeholder="Ej: Pérez"
                                defaultValue={initialData?.last_name ?? ''}
                            />
                            <InputError message={errors.last_name} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="dni"
                                className="mb-1.5 block text-sm font-medium text-foreground"
                            >
                                DNI
                            </label>
                            <input
                                id="dni"
                                name="dni"
                                type="text"
                                required
                                autoComplete="username"
                                className={inputStyles}
                                placeholder="12345678"
                                defaultValue={initialData?.dni ?? ''}
                            />
                            <InputError message={errors.dni} />
                        </div>

                        <div>
                            <label
                                htmlFor="roles"
                                className="mb-1.5 block text-sm font-medium text-foreground"
                            >
                                Rol
                            </label>
                            <select
                                id="roles"
                                name="roles[]"
                                className={`${inputStyles} cursor-pointer capitalize`}
                                defaultValue={selectedRoleId ?? ''}
                                disabled={roles.length === 0}
                            >
                                {roles.length === 0 ? (
                                    <option value="">No hay roles disponibles</option>
                                ) : (
                                    roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <InputError
                                message={errors.roles ?? errors['roles.0']}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className={inputStyles}
                            placeholder="correo@ejemplo.com"
                            defaultValue={initialData?.email ?? ''}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            {initialData
                                ? 'Contraseña (dejar en blanco para no cambiar)'
                                : 'Contraseña'}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required={!initialData}
                            autoComplete="new-password"
                            className={inputStyles}
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Guardando...'
                                : initialData
                                ? 'Actualizar Usuario'
                                : 'Crear Usuario'}
                    </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

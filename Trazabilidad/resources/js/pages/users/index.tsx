import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';

type Role = {
    id: number;
    name: string;
};

type UserRecord = {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    roles: Role[];
};

type PageProps = {
    users: {
        data: UserRecord[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    flash: { success: string | null; error: string | null };
};

export default function UsersIndex({ users }: PageProps) {
    const { flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Usuarios" />
            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Usuarios</h1>
                        <p className="text-sm text-muted-foreground">
                            Administra las cuentas y sus roles.
                        </p>
                    </div>
                    <Link
                        href="/users/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                        Crear usuario
                    </Link>
                </div>

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
                                <th className="p-3">Nombre</th>
                                <th className="p-3">DNI</th>
                                <th className="p-3">Correo</th>
                                <th className="p-3">Roles</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-3">
                                        {user.first_name} {user.last_name}
                                    </td>
                                    <td className="p-3">{user.dni}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        {user.roles
                                            .map((role) => role.name)
                                            .join(', ') || '—'}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    aria-label={`Editar usuario ${user.first_name} ${user.last_name}`}
                                                    title="Editar"
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            <Form
                                                action={`/users/${user.id}`}
                                                method="delete"
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                            >
                                                {({ processing, errors }) => (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="submit"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            disabled={
                                                                processing
                                                            }
                                                            aria-label={`Eliminar usuario ${user.first_name} ${user.last_name}`}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                        <InputError
                                                            message={
                                                                errors.user
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </Form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <nav className="flex flex-wrap gap-2" aria-label="Paginación">
                    {users.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                {link.label
                                    .replaceAll('&laquo;', '«')
                                    .replaceAll('&raquo;', '»')}
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="rounded border px-3 py-1 text-sm text-muted-foreground"
                            >
                                {link.label
                                    .replaceAll('&laquo;', '«')
                                    .replaceAll('&raquo;', '»')}
                            </span>
                        ),
                    )}
                </nav>
            </div>
        </>
    );
}

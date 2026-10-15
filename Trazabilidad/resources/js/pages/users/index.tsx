import { Head, Link } from '@inertiajs/react';
import { UserTable } from '@/pages/users/components/userTable';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    roles: Role[];
}

interface IndexProps {
    users: {
        data: User[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    flash: { success: string | null; error: string | null };
}

export default function UsersIndex({ users, flash }: IndexProps) {
    // const { flash } = usePage<IndexProps>().props;

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

                <UserTable users={users.data} />

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
    )
}

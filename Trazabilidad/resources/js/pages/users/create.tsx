import { Head, Link } from '@inertiajs/react';
import UserForm from '@/components/admin/user-form';

type Role = {
    id: number;
    name: string;
};

export default function UsersCreate({ roles }: { roles: Role[] }) {
    return (
        <>
            <Head title="Crear usuario" />
            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div>
                    <Link
                        href="/users"
                        className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                        Volver a usuarios
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold">
                        Crear usuario
                    </h1>
                </div>
                <UserForm roles={roles} />
            </div>
        </>
    );
}

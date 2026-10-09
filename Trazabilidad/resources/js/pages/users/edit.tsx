import { Head, Link } from '@inertiajs/react';
import UserForm from '@/components/admin/user-form';

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

export default function UsersEdit({
    user,
    roles,
}: {
    user: UserRecord;
    roles: Role[];
}) {
    return (
        <>
            <Head title={`Editar ${user.first_name} ${user.last_name}`} />
            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <div>
                    <Link
                        href="/users"
                        className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                        Volver a usuarios
                    </Link>
                    <h1 className="mt-2 text-2xl font-semibold">
                        Editar usuario
                    </h1>
                </div>
                <UserForm user={user} roles={roles} />
            </div>
        </>
    );
}

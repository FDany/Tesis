import { Head, Link } from '@inertiajs/react';

import {
    UserForm,
    type UserFormRecord,
    type UserRoleOption,
} from '@/features/users/components/UserForm';

export default function UsersEdit({
    user,
    roles,
}: {
    user: UserFormRecord;
    roles: UserRoleOption[];
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

import { Head } from '@inertiajs/react';

import { RoleForm } from '@/features/roles-y-permisos/components/RoleForm';
import type { RoleEditProps } from '@/features/roles-y-permisos/types/rolYPermiso';

export default function RolesEdit({ role, permissions }: RoleEditProps) {
    return (
        <>
            <Head title={`Editar rol: ${role.name}`} />

            <div className="space-y-6 p-4">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Editar rol: {role.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Modifica el nombre del rol o actualiza sus permisos
                        asignados.
                    </p>
                </header>

                <RoleForm permissions={permissions} initialValues={role} />
            </div>
        </>
    );
}

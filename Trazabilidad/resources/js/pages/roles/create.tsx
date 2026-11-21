import { Head } from '@inertiajs/react';

import { RoleForm } from '@/features/roles-y-permisos/components/RoleForm';
import type { RoleCreateProps } from '@/features/roles-y-permisos/types/rolYPermiso';

export default function RolesCreate({ permissions }: RoleCreateProps) {
    return (
        <>
            <Head title="Nuevo rol" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Nuevo rol
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Define el nombre del rol y selecciona los permisos
                        habilitados.
                    </p>
                </header>

                <RoleForm permissions={permissions} />
            </div>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { RoleForm } from '@/features/roles-y-permisos/components/RoleForm';
import type { RoleCreateProps } from '@/features/roles-y-permisos/types/rolYPermiso';

import { ArrowLeft } from 'lucide-react';

export default function RolesCreate({ permissions }: RoleCreateProps) {
    return (
        <>
            <Head title="Nuevo Rol" />

            <div className="y-6 p-6">

                <Link href="/roles">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>

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

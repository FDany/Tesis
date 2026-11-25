import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import FlashMessage from '@/components/FlashMessage';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/features/users/components/UserTable';
import CantFilas from '@/components/CantFilas';

import Paginacion, {
    type PaginacionData,
} from '@/components/Paginador';
import { useAuth } from '@/hooks/use-auth';

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
    users: PaginacionData & { data: User[] };
    porPagina: number;
    opcionesPorPagina: number[];
}

export default function UsersIndex({ users, porPagina, opcionesPorPagina }: IndexProps) {
    const handlePorPaginaChange = (cantidad: number) => {
        router.get(
            '/users',
            { por_pagina: cantidad },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const { can } = useAuth();

    return (
        <>
            <Head title="Usuarios" />
            <FlashMessage />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Usuarios</h1>
                        <p className="text-sm text-muted-foreground">
                            Administra las cuentas y sus roles.
                        </p>
                    </div>
                    {(can('crear usuarios')) && (
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="size-4" />
                                Nuevo usuario
                            </Link>
                        </Button>)}
                </div>

                {/* Limitador de cantidad de filas */}
                <CantFilas
                    value={porPagina}
                    options={opcionesPorPagina}
                    onChange={handlePorPaginaChange}
                    total={users.total}
                />
                <UserTable users={users.data} />

                {/* Paginacion */}
                <Paginacion pagination={users} />
            </div>
        </>
    );
}

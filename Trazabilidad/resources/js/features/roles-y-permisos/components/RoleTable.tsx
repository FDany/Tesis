import { Link } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Role } from '../types/rolYPermiso';
import { useAuth } from '@/hooks/use-auth';

type RoleTableProps = {
    roles: Role[];
    onDelete: (role: Role) => void;
};

export function RoleTable({ roles, onDelete }: RoleTableProps) {

    const { can } = useAuth();

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="p-3">Rol</th>
                        <th className="p-3">Permisos asignados</th>
                        <th className="p-3">Usuarios asignados</th>
                        <th className="p-3">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id} className="border-t">
                            <td className="p-3 font-medium">{role.name}</td>

                            <td className="p-3">
                                {role.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions
                                            .slice(0, 4)
                                            .map((permission) => (
                                                <span
                                                    key={permission.id}
                                                    className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                                                >
                                                    {permission.name}
                                                </span>
                                            ))}

                                        {role.permissions.length > 4 && (
                                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                +{role.permissions.length - 4}{' '}
                                                más
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        Sin permisos
                                    </span>
                                )}
                            </td>

                            <td className="p-3">{role.users_count}</td>

                            <td className="p-3">
                                <div className="flex gap-2">
                                    {(can('editar roles'))&&(
                                        <Button
                                        variant="outline"
                                        size="icon"
                                        asChild
                                    >
                                        <Link
                                            href={`/roles/${role.id}/edit`}
                                            aria-label={`Editar rol ${role.name}`}
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>)}

                                    {(can('eliminar roles'))&&(
                                        <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        disabled={role.users_count > 0}
                                        title={
                                            role.users_count > 0
                                                ? 'Primero quita el rol a todos sus usuarios.'
                                                : 'Eliminar'
                                        }
                                        aria-label={`Eliminar rol ${role.name}`}
                                        onClick={() => onDelete(role)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>)}
                                </div>
                            </td>
                        </tr>
                    ))}

                    {roles.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="p-6 text-center text-muted-foreground"
                            >
                                No hay roles registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

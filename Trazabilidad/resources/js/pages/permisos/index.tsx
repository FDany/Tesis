import { useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from 'lucide-react';
import FlashMessage from '@/components/FlashMessage';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useAuth } from '@/hooks/use-auth'

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
}

interface IndexProps {
    permissions: Permission[];
}

export default function Index({ permissions }: IndexProps) {

    // Estados para los filtros reactivos
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    // Estado para controlar si estamos editando en línea
    const [editingId, setEditingId] = useState<number | null>(null);

    // Formulario de Inertia para Crear / Editar rápidamente
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
    });

    // Cambiar al modo edición precargando el string
    const startEdit = (permission: Permission) => {
        setEditingId(permission.id);
        setData('name', permission.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    // Envío del formulario (Sabe si es actualización o inserción)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/permisos/${editingId}`, {
                onSuccess: () => setEditingId(null)
            });
        } else {
            post('/permisos', {
                onSuccess: () => reset()
            });
        }
    };

    // Estados para el Modal de Confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/permisos/${idSeleccionado}`, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIdSeleccionado(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    // ==========================================
    // LÓGICA DE FILTRADO INTERACTIVO (CLIENT-SIDE)
    // ==========================================
    const filteredPermissions = permissions.filter((perm) => {
        const matchesSearch = perm.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (actionFilter === 'all') return matchesSearch;

        // Filtra de acuerdo al prefijo clásico de Spatie (ej: "view-", "create-")
        return matchesSearch && perm.name.toLowerCase().startsWith(actionFilter);
    });

    const { can } = useAuth();

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <Head title="Permisos" />

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Permisos Atómicos del Sistema</h1>
                <p className="text-sm text-muted-foreground">
                    Lista de capacidades del sistema utilizadas para la protección de controladores y vistas.
                </p>
            </div>

            <FlashMessage />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* COLUMNA IZQUIERDA: Formulario dinámico de Alta/Edición */}

                {(can('editar permisos')) && (can('crear permisos')) && (
                    <div className="border rounded-xl p-5 bg-card shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold">
                            {editingId ? '📝 Modificar Permiso' : '🛡️ Registrar Permiso'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Nombre Clave</label>
                                <Input
                                    placeholder="Ej: listar usuarios"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1" disabled={processing}>
                                    {editingId ? 'Actualizar' : 'Guardar'}
                                </Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={cancelEdit}>
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>)}

                {/* COLUMNA DERECHA: Tabla con Buscadores Avanzados */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Barra de Filtros Interactivos */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-full sm:flex-1">
                            <Input
                                placeholder="Filtrar por nombre o módulo..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="h-10"
                            />
                        </div>

                        <div className="w-full sm:w-45">
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Acción" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las acciones</SelectItem>
                                    <SelectItem value="listar">📋 Listar (index)</SelectItem>
                                    <SelectItem value="ver">👀 Lectura (show)</SelectItem>
                                    <SelectItem value="crear">➕ Inserción (create)</SelectItem>
                                    <SelectItem value="editar">✏️ Modificación (edit)</SelectItem>
                                    <SelectItem value="eliminar">🗑️ Eliminación (delete)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabla Shadcn */}
                    <div className="border rounded-md bg-card shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">ID</TableHead>
                                    <TableHead>Identificador Interno</TableHead>
                                    <TableHead>Guard</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPermissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Ningún permiso coincide con los filtros aplicados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPermissions.map((perm) => (
                                        <TableRow key={perm.id} className="hover:bg-muted/40 transition-colors">
                                            <TableCell className="text-muted-foreground font-mono">#{perm.id}</TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded border border-indigo-100/60">
                                                    {perm.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {perm.guard_name}
                                            </TableCell>
                                            <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                                                {can('editar permisos') && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Editar"
                                                        aria-label="Editar"
                                                        onClick={() => startEdit(perm)}
                                                        disabled={editingId === perm.id}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>)}

                                                {(can('eliminar permisos')) && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        title="Eliminar"
                                                        aria-label="Eliminar"
                                                        onClick={() => handleDelete(perm.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="text-xs text-muted-foreground text-right">
                        Resultados encontrados: <strong>{filteredPermissions.length}</strong> de {permissions.length}
                    </div>
                </div>
            </div>

            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) setIdSeleccionado(null);
                }}
                title="¿Eliminar permiso?"
                description="Estás a punto de borrar este permiso permanentemente. Esta acción no se puede deshacer."
                confirmLabel="Sí, eliminar permiso"
                onConfirm={ejecutarEliminacion}
                processing={isDeleting}
            />
        </div>
    );
}

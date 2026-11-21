import React from 'react';
import type { Tamanio } from '../types/tamanio';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface Props {
    tamanios: Tamanio[];
    onEdit: (tamanio: Tamanio) => void;
    onDelete: (id: number) => void;
}

export const TamanioTable: React.FC<Props> = ({
    tamanios,
    onEdit,
    onDelete,
}) => {
    const { can } = useAuth();
    if (!tamanios || tamanios.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
                No hay tamaños registrados.
            </div>
        );
    }

    return (
        <div className="border rounded-md bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tamaño de Bolsa</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tamanios.map((tamanio) => (
                        <TableRow key={tamanio.id}>
                            <TableCell className="font-semibold">{tamanio.nombre}</TableCell>
                            <TableCell className="text-right space-x-2">
                                {can('editar tamBolsas') && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onEdit(tamanio)}
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>)}
                                {can('eliminar tamBolsas') && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => onDelete(tamanio.id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Servicio, CreateServicioDTO } from '../types/servicio';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Servicio | null;
}

export const ServicioModalForm: React.FC<Props> = ({
    isOpen,
    onClose,
    initialData,
}) => {
    const isEditing = Boolean(initialData);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<CreateServicioDTO>({
            nombre: '',
            activo: true,
        });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (initialData) {
                setData({
                    nombre: initialData.nombre,
                    activo: initialData.activo,
                });
            } else {
                reset();
            }
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && initialData?.id) {
            // Ruta escrita directamente para actualización (PUT)
            put(`/servicios/${initialData.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            // Ruta escrita directamente para creación (POST)
            post('/servicios', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const inputStyle =
        'border border-slate-400 bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 shadow-sm transition-all';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Editar Servicio'
                            : 'Nuevo Servicio'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre del Servicio</Label>
                        <Input
                            id="nombre"
                            placeholder="Ej: Terapia Intensiva, Cirugía, Consulta General"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="activo">Estado del Servicio</Label>
                        <Select
                            value={data.activo ? 'true' : 'false'}
                            onValueChange={(value) => setData('activo', value === 'true')}
                        >
                            <SelectTrigger className={`${inputStyle} cursor-pointer`}>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Activo</SelectItem>
                                <SelectItem value="false">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.activo && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.activo}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

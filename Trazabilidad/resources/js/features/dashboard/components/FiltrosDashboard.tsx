import React from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import type { FiltrosDashboard as FiltrosDashboardType } from '../types/dashboard';
import type { Servicio } from '@/features/servicios/types/servicio';

interface Props {
    filtros: FiltrosDashboardType;
    servicios?: Servicio[];
}

export function FiltrosDashboard({ filtros, servicios = [] }: Props) {
    const handleFechaChange = (key: keyof FiltrosDashboardType, value: string) => {
        router.get(
            '/dashboard',
            { ...filtros, [key]: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleLimpiarFiltros = () => {
        router.get('/dashboard', {}, { preserveState: true, replace: true });
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Filtros del Panel</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 max-w-3xl">
                        {/* Fecha Inicio */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fecha_inicio" className="text-xs font-medium flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                Fecha Desde
                            </Label>
                            <Input
                                id="fecha_inicio"
                                type="date"
                                value={filtros.fecha_inicio || ''}
                                onChange={(e) => handleFechaChange('fecha_inicio', e.target.value)}
                                className="h-9"
                            />
                        </div>

                        {/* Fecha Fin */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fecha_fin" className="text-xs font-medium flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                Fecha Hasta
                            </Label>
                            <Input
                                id="fecha_fin"
                                type="date"
                                value={filtros.fecha_fin || ''}
                                onChange={(e) => handleFechaChange('fecha_fin', e.target.value)}
                                className="h-9"
                            />
                        </div>

                        {/* Selector Opcional de Servicio */}
                        {servicios.length > 0 && (
                            <div className="space-y-1.5">
                                <Label htmlFor="servicio_id" className="text-xs font-medium">
                                    Servicio Origen
                                </Label>
                                <select
                                    id="servicio_id"
                                    value={filtros.servicio_id || ''}
                                    onChange={(e) =>
                                        handleFechaChange(
                                            'servicio_id',
                                            e.target.value ? (e.target.value as any) : ''
                                        )
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">Todos los Servicios</option>
                                    {servicios.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Botón Restablecer */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLimpiarFiltros}
                        className="h-9 gap-1.5 self-end"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Limpiar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

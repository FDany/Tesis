import { RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AuditoriaFiltros as FiltrosTipo } from '../types/auditoria';

interface ResponsableOption {
    id: number;
    first_name: string;
    last_name: string;
}

interface AuditoriaFiltrosProps {
    filtros: FiltrosTipo;
    operacionesDisponibles: string[];
    responsables: ResponsableOption[];
    onChange: (filtros: FiltrosTipo) => void;
    onSubmit: (e: React.FormEvent) => void;
    onLimpiar: () => void;
}

export function AuditoriaFiltros({
    filtros,
    operacionesDisponibles,
    responsables,
    onChange,
    onSubmit,
    onLimpiar,
}: AuditoriaFiltrosProps) {
    const actualizarCampo = <K extends keyof FiltrosTipo>(campo: K, valor: FiltrosTipo[K]) => {
        onChange({
            ...filtros,
            [campo]: valor,
        });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5"
        >
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="codigo_barra">Código de bolsa</Label>
                <Input
                    id="codigo_barra"
                    type="text"
                    placeholder="Ej. 0001000000001"
                    value={filtros.codigo_barra}
                    onChange={(e) => actualizarCampo('codigo_barra', e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="operacion">Operación</Label>
                <select
                    id="operacion"
                    value={filtros.operacion}
                    onChange={(e) => actualizarCampo('operacion', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                    <option value="">Todas</option>
                    {operacionesDisponibles.map((op) => (
                        <option key={op} value={op}>
                            {op}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="responsable_id">Responsable</Label>
                <select
                    id="responsable_id"
                    value={filtros.responsable_id}
                    onChange={(e) => actualizarCampo('responsable_id', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                    <option value="">Todos</option>
                    {responsables.map((resp) => (
                        <option key={resp.id} value={String(resp.id)}>
                            {resp.first_name} {resp.last_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha_desde">Desde</Label>
                <Input
                    id="fecha_desde"
                    type="date"
                    value={filtros.fecha_desde}
                    onChange={(e) => actualizarCampo('fecha_desde', e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha_hasta">Hasta</Label>
                <Input
                    id="fecha_hasta"
                    type="date"
                    value={filtros.fecha_hasta}
                    onChange={(e) => actualizarCampo('fecha_hasta', e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-5 lg:justify-end">
                <Button type="button" variant="outline" onClick={onLimpiar}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Limpiar
                </Button>
                <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                </Button>
            </div>
        </form>
    );
}

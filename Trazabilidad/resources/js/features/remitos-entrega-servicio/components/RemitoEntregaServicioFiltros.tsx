import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';
import type { Servicio } from '@/features/servicios';

interface Props {
    valores: {
        buscar: string;
        retira_nombre: string;
        servicio_id: string;
    };
    servicios: Array<Pick<Servicio, 'id' | 'nombre'>>;
    onChange: (key: string, value: string) => void;
}

export function RemitoEntregaServicioFiltros({
    valores,
    servicios,
    onChange,
}: Props) {
    const campos: CampoFiltro[] = [
        {
            key: 'buscar',
            label: 'Nro. de remito',
            type: 'text',
            placeholder: 'Buscar por ID...',
        },
        {
            key: 'retira_nombre',
            label: 'Retira',
            type: 'text',
            placeholder: 'Buscar por nombre...',
        },
        {
            key: 'servicio_id',
            label: 'Servicio',
            type: 'select',
            options: [
                { value: 'TODOS', label: 'Todos los servicios' },
                ...servicios.map((servicio) => ({
                    value: String(servicio.id),
                    label: servicio.nombre,
                })),
            ],
        },
    ];

    return (
        <FiltroGenerico
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            campos={campos}
            valores={{
                buscar: valores.buscar,
                retira_nombre: valores.retira_nombre,
                servicio_id: valores.servicio_id || 'TODOS',
            }}
            onChange={onChange}
        />
    );
}
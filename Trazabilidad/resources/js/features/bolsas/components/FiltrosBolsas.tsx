import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';
import { ESTADO_BOLSA_LABELS, type EstadoBolsa } from '../types/bolsa';

interface Props {
    valores: {
        buscar: string;
        estado: string;
    };
    estados: string[];
    onChange: (key: string, value: string) => void;
}

export function FiltrosBolsas({ valores, estados, onChange }: Props) {
    const campos: CampoFiltro[] = [
        {
            key: 'buscar',
            label: 'Código de barras',
            type: 'text',
            placeholder: 'Buscar por código de barras...',
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'todos', label: 'Todos los estados' },
                ...estados.map((estado) => ({
                    value: estado,
                    label: ESTADO_BOLSA_LABELS[estado as EstadoBolsa] ?? estado,
                })),
            ],
        },
    ];

    return (
        <FiltroGenerico
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            campos={campos}
            valores={{
                buscar: valores.buscar,
                estado: valores.estado || 'todos',
            }}
            onChange={onChange}
        />
    );
}

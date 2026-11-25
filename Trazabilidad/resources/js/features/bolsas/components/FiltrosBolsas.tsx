import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';
import { ESTADO_BOLSA_LABELS, type EstadoBolsa } from '../types/bolsa';

interface Props {
    valores: {
        buscar: string;
        estado: string;
        tipo_bolsa_id: string;
    };
    estados: string[];
    tiposBolsa: { id: number; tipo_residuo: string; color: string }[];
    onChange: (key: string, value: string) => void;
}

export function FiltrosBolsas({ valores, estados, tiposBolsa, onChange }: Props) {
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
        {
            key: 'tipo_bolsa_id',
            label: 'Tipo de bolsa',
            type: 'select',
            options: [
                { value: 'todos', label: 'Todos los tipos' },
                ...tiposBolsa.map((tipo) => ({
                    value: String(tipo.id),
                    label: tipo.tipo_residuo,
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
                estado: valores.estado || 'todos',
                tipo_bolsa_id: valores.tipo_bolsa_id || 'todos', 
            }}
            onChange={onChange}
        />
    );
}

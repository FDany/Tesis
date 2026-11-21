import { FiltroGenerico } from '@/components/filtros/FiltroGenerico';
import type { CampoFiltro } from '@/components/filtros/FiltroGenerico';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import type { Tamanio } from '@/features/tamanios';

interface Props {
    valores: {
        buscar: string;
        tipo_bolsa_id: string;
        tamanio_id: string;
    };
    tiposBolsa: TipoBolsa[];
    tamanios: Tamanio[];
    onChange: (key: string, value: string) => void;
}

export function RemitoRecepcionFiltros({
    valores,
    tiposBolsa,
    tamanios,
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
            key: 'tipo_bolsa_id',
            label: 'Tipo de bolsa',
            type: 'select',
            options: [
                { value: 'TODOS', label: 'Todos los tipos' },
                ...tiposBolsa.map((tipo) => ({
                    value: String(tipo.id),
                    label: (
                        <span className="flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="h-3 w-3 shrink-0 rounded-full border border-border"
                                style={{ backgroundColor: tipo.color }}
                            />
                            <span>{tipo.tipo_residuo} - {tipo.proveedor}</span>
                        </span>
                    ),
                })),
            ],
        },
        {
            key: 'tamanio_id',
            label: 'Tamaño',
            type: 'select',
            options: [
                { value: 'TODOS', label: 'Todos los tamaños' },
                ...tamanios.map((tamanio) => ({
                    value: String(tamanio.id),
                    label: tamanio.nombre,
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
                tipo_bolsa_id: valores.tipo_bolsa_id || 'TODOS',
                tamanio_id: valores.tamanio_id || 'TODOS',
            }}
            onChange={onChange}
        />
    );
}
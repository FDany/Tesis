export type EstadoBolsa =
    | 'NO_RECIBIDA'
    | 'RECIBIDA'
    | 'DISPONIBLE'
    | 'ENTREGADA_A_SERVICIO'
    | 'UTILIZADA'
    | 'INGRESADA_AL_DEPOSITO'
    | 'PESADA'
    | 'DESPACHADA'
    | 'RETIRADA_POR_DGM'
    | 'TRATADA_DISPOSICION_FINAL';

export const ESTADO_BOLSA_LABELS: Record<EstadoBolsa, string> = {
    NO_RECIBIDA: 'No Recibida',
    RECIBIDA: 'Recibida',
    DISPONIBLE: 'Disponible',
    ENTREGADA_A_SERVICIO: 'Entregada a Servicio',
    UTILIZADA: 'Utilizada',
    INGRESADA_AL_DEPOSITO: 'Ingresada al Depósito',
    PESADA: 'Pesada',
    DESPACHADA: 'Despachada',
    RETIRADA_POR_DGM: 'Retirada por DGM',
    TRATADA_DISPOSICION_FINAL: 'Tratada / Disposición Final',
};

export interface Bolsa {
    id: number;
    codigo_barra: string;
    tipo_bolsa_id: number;
    tipo_bolsa?: {
        tipo_residuo: string;
        color: string;
    } | null;
    tamanio_id?: number | null;
    estado: EstadoBolsa;
    peso?: number | null;
    remitos_serv_id?: number | null;
    rem_rep_id: number;
    recep_dep_id?: number | null;
    rem_sal_id?: number | null;
    remito_entrega_servicio?: {
        id: number;
        fecha_entrega?: string | null;
        servicio?: {
            id: number;
            nombre: string;
        } | null;
    } | null;
    created_at?: string;
    updated_at?: string;
}

export type CreateBolsaDTO = Omit<Bolsa, 'id' | 'created_at' | 'updated_at'>;

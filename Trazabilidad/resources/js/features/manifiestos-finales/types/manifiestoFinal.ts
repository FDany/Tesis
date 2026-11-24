import type { DocumentoAdjunto } from '@/types/documentoAdjunto';
import type { RemitoSalidaRetiro } from '@/features/remitos-salida/types/remitoSalidaRetiro';

export interface ManifiestoFinal {
    id: number;
    numero_manifiesto: string;
    fecha: string;
    fecha_tratamiento: string;
    rem_sal_id: number;
    cantidad_bolsas: number;
    peso_informado: number | string;
    documento_digital?: number | null;
    observaciones?: string | null;

    // Relaciones cargadas desde Eloquent
    documento_oficial?: DocumentoAdjunto | null;
    remito_salida_retiro?: RemitoSalidaRetiro;

    created_at?: string;
    updated_at?: string;
}

export interface CreateManifiestoFinalDTO {
    numero_manifiesto: string;
    fecha: string;
    fecha_tratamiento: string;
    cantidad_bolsas: number;
    peso_informado: number | string;
    observaciones: string;
    documento: File | null;
}

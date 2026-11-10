import type { TipoBolsa } from '@/features/tipos-bolsa/types/tipoBolsa';
import type { Servicio } from '@/features/servicios/types/servicio';
import type { Tamanio } from '@/features/tamanios/types/tamanio';

// Ciclo de vida de la bolsa en el sistema
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

export interface FiltrosDashboard {
    fecha_inicio: string;
    fecha_fin: string;
    servicio_id?: number | null;
}

// Conteo agrupado por color (dinámico según tipos_bolsa)
export interface BolsasPorColor {
    color: string;
    nombre_tipo?: string;
    cantidad: number;
}

// 1. Indicadores Generales
export interface IndicadoresGenerales {
    bolsas_recibidas: number;
    bolsas_utilizadas: number;
    bolsas_retiradas: number;
    kilogramos_generados: number;
    peso_promedio_bolsa: number;
    bolsas_por_color: BolsasPorColor[];
}

// 2. Indicadores por Corriente / Tipo de Residuo (Dinámico)
export interface DesgloseTamanio {
    tamanio_id?: number | null;
    tamanio?: Tamanio | null;
    nombre_tamanio: string;
    cantidad: number;
    peso_total: number;
}

export interface CorrienteResiduo {
    tipo_bolsa_id: number;
    tipo_residuo: string;
    color: string;
    cantidad_total: number;
    peso_total: number;
    por_tamanio?: DesgloseTamanio[];
}

// 3. Stock de Bolsas Vacías (Reutiliza TipoBolsa y Tamanio)
export interface ItemStockVacias {
    tipo_bolsa_id: number;
    tipo_bolsa?: TipoBolsa | null;
    tamanio_id?: number | null;
    tamanio?: Tamanio | null;
    nombre: string;
    color: string;
    nombre_tamanio?: string;
    cantidad: number;
}

// 4. Tablero Operativo de Pendientes (Dinámico por tipo_residuo / color)
export interface PendientePorCorriente {
    tipo_residuo: string;
    color: string;
    cantidad: number;
}

export interface EstadoPendientes {
    pesaje: PendientePorCorriente[];
    retiro: PendientePorCorriente[];
    documentacion: {
        remitos_dgm: number;
        manifiestos: number;
    };
}

// 5. Desglose por Servicio Hospitalario (Usa la interface Servicio)
export interface MetricaServicio {
    servicio_id: number;
    servicio?: Servicio | null;
    nombre_servicio: string;
    cantidad_bolsas: number;
    kilogramos: number;
}

// Interface principal enviada por Laravel a Inertia React
export interface TableroControlData {
    generales: IndicadoresGenerales;
    corrientes: CorrienteResiduo[];
    stock_vacias: ItemStockVacias[];
    pendientes: EstadoPendientes;
    metricas_servicio: MetricaServicio[];
}

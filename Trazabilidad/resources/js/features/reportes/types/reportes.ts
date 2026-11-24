import type { Servicio } from '@/features/servicios/types/servicio';
import type { Tamanio } from '@/features/tamanios/types/tamanio';

export interface FiltrosReportes {
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

// 1. Indicadores Generales (Punto 21)
export interface IndicadoresGenerales {
    bolsas_recibidas: number;
    bolsas_utilizadas: number;
    bolsas_retiradas: number;
    kilogramos_generados: number;
    peso_promedio_bolsa: number;
    bolsas_por_color: BolsasPorColor[];
}

// 2. Indicadores por Corriente / Tipo de Residuo (Biocontaminados y Químicos)
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

// 3. Kilogramos por Período (Punto 21)
export interface KilogramosPorPeriodo {
    periodo: string; // Ej: '2026-11-01' o '2026-11'
    etiqueta: string; // Ej: '01/11' o 'Nov 2026'
    kilogramos: number;
    cantidad_bolsas: number;
}

// 4. Desglose por Servicio Hospitalario (Punto 21)
export interface MetricaServicio {
    servicio_id: number;
    servicio?: Servicio | null;
    nombre_servicio: string;
    cantidad_bolsas: number;
    kilogramos: number;
}

// Interface principal enviada por ReporteController a Inertia React (Punto 21)
export interface ReportesData {
    generales: IndicadoresGenerales;
    corrientes: CorrienteResiduo[];
    kilogramos_por_periodo: KilogramosPorPeriodo[];
    metricas_servicio: MetricaServicio[];
}

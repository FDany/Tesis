import type { TipoBolsa } from '@/features/tipos-bolsa/types/tipoBolsa';
import type { Tamanio } from '@/features/tamanios/types/tamanio';

// Conteo agrupado por corriente / tipo_residuo y color (usado en Residuos en Depósito y Pendientes)
export interface ConteoPorCorriente {
    tipo_bolsa_id?: number;
    tipo_residuo: string;
    color: string;
    cantidad: number;
    peso_total?: number;
}

// 1. Stock de Bolsas Vacías (dinámico por tipo_bolsa y tamaño)
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

// 2. Tablero Operativo de Pendientes (Pesaje, Retiro y Documentación)
export interface EstadoPendientes {
    pesaje: ConteoPorCorriente[];
    retiro: ConteoPorCorriente[];
    documentacion: {
        remitos_dgm: number;
        manifiestos: number;
    };
}

// Resumen rápido del mes en curso (KPIs superiores)
export interface ResumenMesDashboard {
    bolsas_recibidas: number;
    bolsas_utilizadas: number;
    bolsas_retiradas: number;
    kilogramos_generados: number;
}

// Interface principal enviada por DashboardController a Inertia React (Punto 22)
export interface TableroControlData {
    stock_vacias: ItemStockVacias[];
    residuos_deposito: ConteoPorCorriente[];
    pendientes: EstadoPendientes;
}

export interface DashboardPageProps {
    resumen_mes: ResumenMesDashboard;
    tablero: TableroControlData;
}

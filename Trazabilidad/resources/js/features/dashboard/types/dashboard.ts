import type { TipoBolsa } from '@/features/tipos-bolsa/types/tipoBolsa';
import type { Tamanio } from '@/features/tamanios/types/tamanio';

// Conteo agrupado por corriente / tipo_residuo y color (usado en Residuos en Depósito y Pendientes)
export interface ConteoPorCorriente {
    tipo_residuo: string;
    color: string;
    cantidad: number;
}

// 1. Stock de Bolsas Vacías (Rojas pequeñas, Rojas grandes, Amarillas)
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

// Interface principal enviada por DashboardController a Inertia React (Punto 22)
export interface TableroControlData {
    stock_vacias: ItemStockVacias[];
    residuos_deposito: ConteoPorCorriente[];
    pendientes: EstadoPendientes;
}

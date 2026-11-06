import type { User } from '@/types/auth';
import type { Bolsa } from '@/features/bolsas/types/bolsa';

// Definición opcional para el remito cargado desde Eloquent
export interface RemitoSalidaRetiroRef {
  id: number;
  numero_remito: string;
  fecha_retiro?: string;
}

export interface Incidencia {
  id: number;
  fecha_hora: string;
  usuario_registra: number | User;

  // Relaciones opcionales
  bolsa_id?: number | null;
  rem_sal_id?: number | null;
  codigo_no_registrado?: number | string | null;
  tipo_bolsa_id?: number | null;
  servicio_id?: number | null;

  // Detalle de la incidencia (respetando los nombres exactos de la migración)
  tipo_incidencia: string;
  descripcion: string;
  accion_adoptada?: string | null;

  // Cierre y resolución
  usuario_cierra?: number | null;
  fecha_resolucion?: string | null;
  estado: 'ABIERTA' | 'EN_ANALISIS' | 'RESUELTA' | 'CERRADA' | string;

  // Relaciones cargadas desde Eloquent
  usuario_registra_user?: User;
  usuario_cierra_user?: User;
  bolsa?: Bolsa;
  remito_salida_retiro?: RemitoSalidaRetiroRef | null;

  created_at?: string;
  updated_at?: string;
}

export interface CreateIncidenciaDTO {
  fecha_hora: string;
  tipo_incidencia: string;
  descripcion: string;
  accion_adoptada?: string;
  bolsa_id?: number;
  rem_sal_id?: number;
  codigo_no_registrado?: number;
  tipo_bolsa_id?: number;
  servicio_id?: number;
  estado?: string;
}

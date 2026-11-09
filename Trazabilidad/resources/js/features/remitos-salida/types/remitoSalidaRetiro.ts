import type { User } from '@/types/auth';
import type { Bolsa } from '@/features/bolsas/types/bolsa';
import type { Incidencia } from '@/features/incidencias/types/incidencia';

// Estados válidos del remito de salida
export type EstadoRemitoSalida = 'PENDIENTE_RETIRO' | 'CONCILIADO' | 'CON_INCIDENCIA' | 'ANULADO';

// Entidad principal del Remito de Salida
export interface RemitoSalidaRetiro {
  id: number;

  // --- Datos del Remito Interno (Hospital San Bernardo) ---
  numero_remito_interno: string;
  fecha_emision: string;
  cantidad_bolsas_sistema: number;
  usuario_despacha_id: number;
  estado: EstadoRemitoSalida;

  // --- Datos del Remito Oficial DGM (Conciliación / Retiro) ---
  numero_remito?: string | null;
  fecha_retiro?: string | null;
  cantidad_bolsas_declaradas_Empresa?: number | null;
  responsable_empresa?: string | null;
  datos_transporte?: string | null;

  // --- Observaciones ---
  observaciones?: string | null;

  // Relaciones cargadas desde Eloquent
  usuario_despacha?: User;
  bolsas?: Bolsa[];
  incidencia?: Incidencia | null;

  // Métricas agregadas opcionales (vía withCount / withSum)
  bolsas_count?: number;
  peso_total_sistema?: number;

  created_at?: string;
  updated_at?: string;
}

// DTO para la creación del Despacho Interno (Generación de PDF)
export interface CreateRemitoSalidaRetiroDTO {
  bolsas_ids: number[];
  observaciones?: string;
}

// DTO para la Conciliación con el Remito Oficial DGM
export interface ConciliarRemitoSalidaRetiroDTO {
  numero_remito: string;
  fecha_retiro: string;
  cantidad_bolsas_declaradas_Empresa: number;
  responsable_empresa: string;
  datos_transporte?: string;
  observaciones?: string;
}

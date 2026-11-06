import type { User } from '@/types/auth';
import type { Bolsa } from '@/features/bolsas/types/bolsa';
import type { Incidencia } from '@/features/incidencias/types/incidencia';

// Entidad principal del Remito de Salida
export interface RemitoSalidaRetiro {
  id: number;
  numero_remito: string;
  fecha_retiro: string;
  cantidad_bolsas_declaradas_Empresa: number;
  responsable_empresa: string;
  usuario_despacha_id: number;
  datos_transporte: string | null;
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

// DTO para el formulario de creación con useForm() de Inertia.js
export interface CreateRemitoSalidaRetiroDTO {
  numero_remito: string;
  fecha_retiro: string;
  cantidad_bolsas_declaradas_Empresa: number;
  responsable_empresa: string;
  datos_transporte?: string;
  observaciones?: string;
  bolsas_ids: number[];
}

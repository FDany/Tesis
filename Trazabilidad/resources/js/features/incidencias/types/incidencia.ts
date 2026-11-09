import type { User } from '@/types/auth';
import type { Bolsa } from '@/features/bolsas/types/bolsa';
import type { Servicio } from '@/features/servicios/types/servicio';
import type { TipoBolsa } from '@/features/tipos-bolsa/types/tipoBolsa';

// Documento adjunto polimórfico (fotografías / evidencias)
export interface DocumentoAdjunto {
  id: number;
  documentable_type?: string;
  documentable_id?: number;
  tipo_documento: string;
  nombre_archivo: string;
  url_archivo: string;
  fecha_hora?: string;
  created_at?: string;
  updated_at?: string;
}

// Definición para el remito de salida cargado desde Eloquent
export interface RemitoSalidaRetiroRef {
  id: number;
  numero_remito: string;
  fecha_retiro?: string;
}

export interface Incidencia {
  id: number;
  fecha_hora: string;
  usuario_registra: number | User;

  // Relaciones opcionales (IDs)
  bolsa_id?: number | null;
  rem_sal_id?: number | null;
  codigo_no_registrado?: string | null;
  tipo_bolsa_id?: number | null;
  servicio_id?: number | null;

  // Detalle de la incidencia
  tipo_incidencia: string;
  descripcion: string;
  accion_adoptada?: string | null;

  // Cierre y resolución
  usuario_cierra?: number | null;
  fecha_resolucion?: string | null;
  estado: 'ABIERTA' | 'EN_ANALISIS' | 'RESUELTA' | 'CERRADA' | string;

  // Relaciones cargadas desde Eloquent
  usuario_cierra_user?: User;
  bolsa?: Bolsa | null;
  remito_salida_retiro?: RemitoSalidaRetiroRef | null;
  servicio?: Servicio | null;
  tipo_bolsa?: TipoBolsa | null;
  documentos?: DocumentoAdjunto[];

  created_at?: string;
  updated_at?: string;
}

export interface CreateIncidenciaDTO {
  tipo_incidencia: string;
  descripcion: string;
  bolsa_id?: string | number | null;
  rem_sal_id?: string | number | null;
  codigo_no_registrado?: string | null;
  tipo_bolsa_id?: string | number | null;
  servicio_id?: string | number | null;
  documentos?: File[];
}

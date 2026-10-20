import type { User } from '@/types/auth';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import type { Tamanio } from '@/features/tamanios';
export interface Bolsa {
  id: number;
  codigo_barra: string;
  tipo_bolsa_id: number;
  tamanio_id?: number | null;
  estado: string;
  peso?: number | null;
  remitos_serv_id?: number | null;
  rem_rep_id: number;
  recep_dep_id?: number | null;
  rem_sal_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface RemitoRecepcion {
  id: number;
  fecha_recepcion: string;
  recep_usuario_id: number;
  observaciones?: string | null;
  codigo_inicio: string;
  codigo_fin: string;
  tipo_bolsa_id: number;
  cantidad_declarada: number;
  tamanio_id: number;
  created_at?: string;
  updated_at?: string;
  usuario_recep?: User;
  tipo_bolsa?: TipoBolsa;
  tamanio?: Tamanio;
  bolsas?: Bolsa[];
}

export interface CreateRemitoRecepcionDTO {
  fecha_recepcion: string;
  observaciones?: string;
  codigo_inicio: string;
  codigo_fin: string;
  tipo_bolsa_id: number;
  cantidad_declarada: number;
  tamanio_id: number;
}

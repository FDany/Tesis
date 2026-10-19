import type { User } from '@/types/auth';
import type { TipoBolsa } from '@/features/tipos-bolsa';

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
  bolsas?: Bolsa[];
}

export interface CreateRemitoDTO {
  fecha_recepcion: string;
  observaciones?: string;
  codigo_inicio: string;
  codigo_fin: string;
  tipo_bolsa_id: number;
  cantidad_declarada: number;
  tamanio_id: number;
}

// Estructura para Links de paginación de Laravel
export interface PageLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Paginador estándar de Laravel/Inertia (LengthAwarePaginator)
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PageLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface Servicio {
  id: number;
  nombre: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateServicioDTO = Omit<Servicio, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export interface Tamanio {
  id: number;
  nombre: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateTamanioDTO = Omit<Tamanio, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

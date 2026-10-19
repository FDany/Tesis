export interface TipoBolsa {
  id: number;
  tipo_residuo: string;
  color: string;
  proveedor?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateTipoBolsaDTO = Omit<TipoBolsa, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

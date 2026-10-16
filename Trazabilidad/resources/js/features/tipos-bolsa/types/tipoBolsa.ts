export interface TipoBolsa {
  id: number;
  tipo_residuo: string;
  color: string;
  proveedor?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateTipoBolsaDTO = Omit<TipoBolsa, 'id' | 'created_at' | 'updated_at'>;

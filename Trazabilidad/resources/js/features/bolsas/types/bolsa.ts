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

export type CreateBolsaDTO = Omit<Bolsa, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

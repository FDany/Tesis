
export interface Bolsa {
  id: number;
  codigo_barra: string;
  tipo_bolsa_id: number;
  tipo_bolsa?: {
    tipo_residuo: string;
    color: string;
  } | null;
  tamanio_id?: number | null;
  estado: string;
  peso?: number | null;
  remitos_serv_id?: number | null;
  rem_rep_id: number;
  recep_dep_id?: number | null;
  rem_sal_id?: number | null;
  remito_entrega_servicio?: {  
    id: number;  
    fecha_entrega?: string | null;  
    servicio?: {  
      id: number;  
      nombre: string;  
    } | null;  
  } | null;  
  created_at?: string;
  updated_at?: string;
}

export type CreateBolsaDTO = Omit<Bolsa, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

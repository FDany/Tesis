export interface RemitoPendienteControl {
  id: number;
  fecha_recepcion: string | null;
  codigo_inicio: string;
  codigo_fin: string;
  cantidad_declarada: number;
  bolsas_recibidas_count: number;
  observaciones?: string | null;
  tipo_bolsa: {
    tipo_residuo: string;
    color: string;
  } | null;
  tamanio: string | null;
  usuario_recep: string | null;
}

export type ResultadoEscaneo = 'DECLARADA' | 'FUERA_DE_RANGO' | 'INEXISTENTE' ;

export interface BolsaEscaneada {
  codigo_barra: string;
  resultado: ResultadoEscaneo;
  mensaje: string;
}

export interface ResultadoControl {
  remito_id: number;
  cantidad_declarada: number;
  controladas: string[];
  faltantes: string[];
  sobrantes: string[];
  responsable: string;
  fecha_control: string;
}

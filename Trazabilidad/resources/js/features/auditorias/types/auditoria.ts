import type { User } from '@/types/auth';
import type { TipoBolsa } from '@/features/tipos-bolsa/types/tipoBolsa';

export interface AuditoriaBolsa {
    id: number;
    codigo_barra: string;
    tipo_bolsa?: TipoBolsa | null;
}

export interface Auditoria {
    id: number;
    responsable_usuario_id: number;
    fecha_hora: string;
    operacion: string;
    bolsa_id: number;
    valor_anterior: string | null;
    valor_nuevo: string | null;
    bolsa?: AuditoriaBolsa | null;
    responsable?: Pick<User, 'id' | 'first_name' | 'last_name' | 'dni'> | null;
}

export interface AuditoriaFiltros {
    codigo_barra: string;
    operacion: string;
    responsable_id: string;
    fecha_desde: string;
    fecha_hasta: string;
}

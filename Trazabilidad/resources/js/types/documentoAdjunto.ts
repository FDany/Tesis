export interface DocumentoAdjunto {
    id: number;
    documentable_type?: string | null;
    documentable_id?: number | null;
    tipo_documento: string;
    nombre_archivo: string;
    url_archivo: string;
    fecha_hora?: string | null;
    created_at?: string;
    updated_at?: string;
}

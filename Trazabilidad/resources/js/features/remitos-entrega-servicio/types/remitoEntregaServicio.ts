export interface RemitoEntregaServicio {
    id: number;
    fecha_entrega: string;
    retira_nombre: string;
    entregado_cargo: string;
    cantidad_bolsas_dadas: number;
    servicio: {
        id: number;
        nombre: string;
    };
}
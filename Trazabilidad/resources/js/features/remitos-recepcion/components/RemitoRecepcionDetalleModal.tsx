import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export type RemitoDetalle = {
    id: number;
    fecha_recepcion: string;
    tipo_bolsa: {
        tipo_residuo: string;
        color: string;
        proveedor: string;
    } | null;
    cantidad_declarada: number;
    cantidad_bolsas: number;
    codigo_inicio: string;
    codigo_fin: string;
    observaciones: string | null;
    usuario_recep: {
        first_name: string;
        last_name: string;
    } | null;
    tamanio: {
        nombre: string;
    } | null;
    bolsas: string[];
};

interface RemitoRecepcionDetalleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    remitoId: number | null;
    cargando: boolean;
    detalle?: RemitoDetalle;
}

export function RemitoRecepcionDetalleModal({
    open,
    onOpenChange,
    remitoId,
    cargando,
    detalle,
}: RemitoRecepcionDetalleModalProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden">
                <div className="min-h-0 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain pr-2">
                <DialogHeader className="items-start pr-10 text-left">
                    <DialogTitle >
                        Detalle del remito {remitoId !== null ? `#${remitoId}` : ''}
                    </DialogTitle >

                    {detalle && detalle.id === remitoId && (
                        <Button asChild variant="outline" className="w-auto self-start">
                            <a href={`/remitos-recepcion/${detalle.id}/pdf`}>
                                <Download />
                                Descargar PDF
                            </a>
                        </Button>
                    )}
                </DialogHeader>

                {cargando ? (
                    <p role="status">Cargando detalle del remito...</p>
                ) : !detalle || detalle.id !== remitoId ? (
                    <p role="alert">No se pudo cargar el detalle del remito.</p>
                ) : (
                    <div className="space-y-4">

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Fecha de recepción</p>
                                <p>
                                    {new Date(
                                        detalle.fecha_recepcion.replace(' ', 'T'),
                                    ).toLocaleString('es-AR', {
                                        dateStyle: 'short',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Tipo de bolsa</p>
                                <div>
                                    {detalle.tipo_bolsa ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                aria-label={`Color ${detalle.tipo_bolsa.color}`}
                                                title={detalle.tipo_bolsa.color}
                                                className="h-3 w-3 rounded-full border border-black/20"
                                                style={{ backgroundColor: detalle.tipo_bolsa.color }}
                                            />
                                            <span>{detalle.tipo_bolsa.tipo_residuo}</span>
                                        </div>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Cantidad declarada</p>
                                <p>{detalle.cantidad_declarada}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Tamaño</p>
                                <p>{detalle.tamanio?.nombre ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Rango de códigos</p>
                                <p>
                                    <code>
                                        {detalle.codigo_inicio} – {detalle.codigo_fin}
                                    </code>
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Bolsas asociadas</p>
                                <p>
                                    {detalle.cantidad_bolsas} / {detalle.cantidad_declarada}
                                    {detalle.cantidad_bolsas !== detalle.cantidad_declarada && (
                                        <span className="ml-2 text-destructive">
                                            No coincide con lo declarado
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Proveedor</p>
                                <p>{detalle.tipo_bolsa?.proveedor ?? '-'}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Registrado por</p>
                                <p>
                                    {detalle.usuario_recep
                                        ? `${detalle.usuario_recep.first_name} ${detalle.usuario_recep.last_name}`
                                        : '-'}
                                </p>
                            </div>

                            <div className="col-span-2">
                                <p className="text-muted-foreground">Observaciones</p>
                                <p className="whitespace-pre-wrap">{detalle.observaciones || '-'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-2 font-medium">Códigos de barra</h3>

                            {detalle.bolsas.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Este remito no tiene bolsas asociadas.
                                </p>
                            ) : (
                                // <ul className="max-h-80 space-y-2 overflow-y-auto">
                                <ul className="space-y-2">
                                    {detalle.bolsas.map((codigo) => (
                                        <li key={codigo} className="rounded border px-3 py-2">
                                            {codigo}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface RemitoEntregaServicioPreview {
    id: number;
    fecha_entrega: string;
    servicio: string;
    retira_nombre: string;
    entregado_cargo: string;
    cantidad_bolsas_dadas: number;
    codigos: string[];
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    remito: RemitoEntregaServicioPreview | null;
}

export function RemitoEntregaServicioPreviewModal({
    open,
    onOpenChange,
    remito,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Vista previa del remito
                        {remito ? ` #${remito.id}` : ''}
                    </DialogTitle>
                    <DialogDescription>
                        Datos de la entrega registrada al servicio.
                    </DialogDescription>
                </DialogHeader>

                {remito && (
                    <>
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                            <p>
                                <strong>Fecha:</strong> {remito.fecha_entrega}
                            </p>
                            <p>
                                <strong>Servicio:</strong> {remito.servicio}
                            </p>
                            <p>
                                <strong>Retira:</strong> {remito.retira_nombre}
                            </p>
                            <p>
                                <strong>Cargo:</strong> {remito.entregado_cargo}
                            </p>
                            <p>
                                <strong>Cantidad de bolsas:</strong>{' '}
                                {remito.cantidad_bolsas_dadas}
                            </p>
                        </div>

                        <section className="space-y-2">
                            <h3 className="font-medium">Códigos de las bolsas</h3>
                            <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-3">
                                {remito.codigos.map((codigo) => (
                                    <li key={codigo} className="font-mono text-sm">
                                        {codigo}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}

                <DialogFooter>
                    {remito && (
                        <Button asChild>
                            <a href={`/remitos-entrega-servicio/${remito.id}/pdf`}>
                                Descargar PDF
                            </a>
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
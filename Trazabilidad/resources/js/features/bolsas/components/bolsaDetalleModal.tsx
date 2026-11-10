import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BolsaEvento {
  nombre: string;
  servicio?: string | null;
  fecha: string;
}

export interface BolsaDetalle {
  id: number;
  codigo_barra: string;
  estado: string;
  tipo_bolsa: {
    tipo_residuo: string;
    color: string;
  } | null;
  eventos: BolsaEvento[];
}

interface BolsaDetalleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bolsaId: number | null;
  cargando: boolean;
  detalle?: BolsaDetalle;
}

export function BolsaDetalleModal({
  open,
  onOpenChange,
  bolsaId,
  cargando,
  detalle,
}: BolsaDetalleModalProps) {
  const fechaLegible = (fecha: string) =>
    new Date(fecha).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden">
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain pr-2">
          <DialogHeader className="pr-10 text-left">
            <DialogTitle>
              Detalle de bolsa {bolsaId !== null ? `#${bolsaId}` : ''}
            </DialogTitle>
          </DialogHeader>

          {cargando ? (
            <p role="status" className="py-4">
              Cargando detalle de la bolsa...
            </p>
          ) : !detalle || detalle.id !== bolsaId ? (
            <p role="alert" className="py-4">
              No se pudo cargar el detalle de la bolsa.
            </p>
          ) : (
            <div className="mt-4 space-y-5">
              <section className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Código:</span>{' '}
                  {detalle.codigo_barra}
                </p>

                <div>
                  <span className="font-medium">Tipo de bolsa:</span>{' '}
                  {detalle.tipo_bolsa ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="size-3 rounded-full border"
                        style={{
                          backgroundColor: detalle.tipo_bolsa.color,
                        }}
                        aria-label={`Color ${detalle.tipo_bolsa.color}`}
                      />
                      {detalle.tipo_bolsa.tipo_residuo}
                    </span>
                  ) : (
                    '—'
                  )}
                </div>

                <p>
                  <span className="font-medium">Estado actual:</span>{' '}
                  {detalle.estado}
                </p>
              </section>

              <section>
                <h3 className="mb-2 font-medium">Trazabilidad</h3>

                {detalle.eventos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay eventos de trazabilidad registrados.
                  </p>
                ) : (
                  <ol className="space-y-3">
                    {detalle.eventos.map((evento, indice) => (
                      <li
                        key={`${evento.nombre}-${indice}`}
                        className="border-l-2 pl-4"
                      >
                        <p className="font-medium">{evento.nombre}</p>
                        {evento.servicio && (
                          <p className="text-sm">
                            Servicio: {evento.servicio}
                          </p>
                        )}
                        <time
                          dateTime={evento.fecha}
                          className="text-sm text-muted-foreground"
                        >
                          {fechaLegible(evento.fecha)}
                        </time>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
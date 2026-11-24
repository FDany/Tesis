import {  
  Dialog,  
  DialogContent,  
  DialogHeader,  
  DialogTitle,  
} from '@/components/ui/dialog';  
import {  
  Table,  
  TableBody,  
  TableCell,  
  TableHead,  
  TableHeader,  
  TableRow,  
} from '@/components/ui/table';  
  
interface BolsaEvento {  
  etapa: string;  
  fecha: string;  
  sector?: string | null;  
  responsable?: string | null;  
  documento?: string | null;  
  informacion?: string | null; 
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
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden sm:max-w-3xl">  
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain pr-2">  
          <DialogHeader className="pr-10 text-left">  
            <DialogTitle>  
              Detalle de bolsa{' '}  
              {detalle ? detalle.codigo_barra : bolsaId !== null ? `#${bolsaId}` : ''}  
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
                  <Table>  
                    <TableHeader>  
                      <TableRow>  
                        <TableHead>Fecha</TableHead>  
                        <TableHead>Etapa</TableHead>  
                        <TableHead>Sector/Lugar</TableHead>  
                        <TableHead>Responsable</TableHead>  
                        <TableHead>Documento</TableHead>
                        <TableHead>Información</TableHead>
                      </TableRow>  
                    </TableHeader>  
                    <TableBody>  
                      {detalle.eventos.map((evento, indice) => (  
                        <TableRow key={`${evento.etapa}-${indice}`}>  
                          <TableCell className="whitespace-nowrap">  
                            <time dateTime={evento.fecha}>  
                              {fechaLegible(evento.fecha)}  
                            </time>  
                          </TableCell>  
                          <TableCell className="font-medium">  
                            {evento.etapa}  
                          </TableCell>  
                          <TableCell>{evento.sector ?? '—'}</TableCell>  
                          <TableCell>{evento.responsable ?? '—'}</TableCell>  
                          <TableCell>{evento.documento ?? '—'}</TableCell> 
                          <TableCell>{evento.informacion ?? '—'}</TableCell>
                        </TableRow>  
                      ))}  
                    </TableBody>  
                  </Table>  
                )}  
              </section>  
            </div>  
          )}  
        </div>  
      </DialogContent>  
    </Dialog>  
  );  
}  
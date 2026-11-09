import React from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, FileText, AlertTriangle, CheckCircle2, Printer, Clock, XCircle } from 'lucide-react';
import type { RemitoSalidaRetiro, EstadoRemitoSalida } from '@/features/remitos-salida/types/remitoSalidaRetiro';

interface PaginatedRemitos {
  data: RemitoSalidaRetiro[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
  current_page: number;
  last_page: number;
}

interface Props {
  remitos: PaginatedRemitos;
}

export default function IndexRemitosSalida({ remitos }: Props) {

  /**
   * Renderiza la insignia visual según el estado del remito.
   */
  const renderBadgeEstado = (estado: EstadoRemitoSalida) => {
    switch (estado) {
      case 'PENDIENTE_RETIRO':
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 flex items-center justify-center gap-1 w-fit mx-auto">
            <Clock className="h-3 w-3" /> Pendiente Retiro
          </Badge>
        );
      case 'CONCILIADO':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1 w-fit mx-auto">
            <CheckCircle2 className="h-3 w-3" /> Conciliado
          </Badge>
        );
      case 'CON_INCIDENCIA':
        return (
          <Badge variant="destructive" className="flex items-center justify-center gap-1 w-fit mx-auto">
            <AlertTriangle className="h-3 w-3" /> Con Incidencia
          </Badge>
        );
      case 'ANULADO':
        return (
          <Badge variant="secondary" className="flex items-center justify-center gap-1 w-fit mx-auto">
            <XCircle className="h-3 w-3" /> Anulado
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Remitos de Salida</h1>
          <p className="text-muted-foreground">
            Gestión de despachos internos (PDF) y trazabilidad de conciliación con retiros DGM.
          </p>
        </div>
        <Button onClick={() => router.get('/remitos-salida/create')} size="lg">
          <Plus className="mr-2 h-5 w-5" /> Nuevo Despacho Interno
        </Button>
      </div>

      {/* Tabla de Remitos */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Despachos Registrados
          </CardTitle>
          <CardDescription>
            Listado general de remitos internos emitidos y su estado de retiro con DGM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {remitos.data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base font-medium">No hay remitos de salida registrados.</p>
              <p className="text-sm">Haga clic en "Nuevo Despacho Interno" para emitir una salida.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Remito Interno</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>N° Remito DGM</TableHead>
                    <TableHead className="text-center">Bolsas Sistema</TableHead>
                    <TableHead className="text-center">Bolsas DGM</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remitos.data.map((remito) => {
                    const cantSistema = remito.cantidad_bolsas_sistema || remito.bolsas_count || 0;
                    const cantDgm = remito.cantidad_bolsas_declaradas_Empresa ?? '-';

                    return (
                      <TableRow key={remito.id}>
                        <TableCell className="font-mono font-bold text-primary">
                          {remito.numero_remito_interno}
                        </TableCell>
                        <TableCell>
                          {new Date(remito.fecha_emision).toLocaleString('es-AR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </TableCell>
                        <TableCell className="font-mono">
                          {remito.numero_remito ? (
                            <span className="font-semibold text-foreground">{remito.numero_remito}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Pendiente DGM</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-semibold">{cantSistema}</TableCell>
                        <TableCell className="text-center font-semibold">{cantDgm}</TableCell>
                        <TableCell className="text-center">
                          {renderBadgeEstado(remito.estado)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Botón Imprimir PDF Interno */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`/remitos-salida/${remito.id}/pdf`, '_blank')}
                              title="Imprimir PDF Interno"
                            >
                              <Printer className="h-4 w-4 text-primary" />
                            </Button>

                            {/* Botón Ver Detalle / Conciliar */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.get(`/remitos-salida/${remito.id}`)}
                              title="Ver Detalle y Conciliar"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginación */}
          {remitos.last_page > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              {remitos.links.map((link, idx) => (
                <Button
                  key={idx}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

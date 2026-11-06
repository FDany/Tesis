import React from 'react';
import { router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { RemitoSalidaRetiro } from '@/features/remitos-salida';

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
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Remitos de Salida (DGM)</h1>
          <p className="text-muted-foreground">
            Histórico de despachos de residuos peligrosos y trazabilidad de retiros.
          </p>
        </div>
        <Button onClick={() => router.get('/remitos-salida/create')} size="lg">
          <Plus className="mr-2 h-5 w-5" /> Nuevo Despacho
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
            Listado general de salidas hacia el transporte DGM con su estado de conciliación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {remitos.data.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base font-medium">No hay remitos de salida registrados.</p>
              <p className="text-sm">Haga clic en "Nuevo Despacho" para iniciar una salida a DGM.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Remito DGM</TableHead>
                    <TableHead>Fecha de Retiro</TableHead>
                    <TableHead>Responsable DGM</TableHead>
                    <TableHead className="text-center">Cant. Sistema</TableHead>
                    <TableHead className="text-center">Cant. DGM</TableHead>
                    <TableHead className="text-center">Estado Conciliación</TableHead>
                    <TableHead className="text-center w-25">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remitos.data.map((remito) => {
                    const tieneIncidencia = !!remito.incidencia;
                    const cantSistema = remito.bolsas_count ?? 0;
                    const cantDgm = remito.cantidad_bolsas_declaradas_Empresa;

                    return (
                      <TableRow key={remito.id}>
                        <TableCell className="font-mono font-bold text-primary">
                          {remito.numero_remito}
                        </TableCell>
                        <TableCell>
                          {new Date(remito.fecha_retiro).toLocaleString('es-AR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </TableCell>
                        <TableCell>{remito.responsable_empresa}</TableCell>
                        <TableCell className="text-center font-semibold">{cantSistema}</TableCell>
                        <TableCell className="text-center font-semibold">{cantDgm}</TableCell>
                        <TableCell className="text-center">
                          {tieneIncidencia ? (
                            <Badge variant="destructive" className="flex items-center justify-center gap-1 w-fit mx-auto">
                              <AlertTriangle className="h-3 w-3" /> Incidencia Pendiente
                            </Badge>
                          ) : (
                            <Badge className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1 w-fit mx-auto">
                              <CheckCircle2 className="h-3 w-3" /> Conciliado
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.get(`/remitos-salida/${remito.id}`)}
                            title="Ver Detalle"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginación simple */}
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

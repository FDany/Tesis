// resources/js/pages/remitos-salida/show.tsx

import React from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, FileText, PackageCheck, AlertTriangle, CheckCircle2, User, Truck, Calendar } from 'lucide-react';
import type { RemitoSalidaRetiro } from '@/features/remitos-salida';

interface Props {
  remito: RemitoSalidaRetiro;
}

export default function ShowRemitoSalida({ remito }: Props) {
  const tieneIncidencia = !!remito.incidencia;
  const cantSistema = remito.bolsas_count ?? remito.bolsas?.length ?? 0;
  const pesoTotal = remito.peso_total_sistema ?? remito.bolsas?.reduce((acc, b) => acc + (b.peso ? Number(b.peso) : 0), 0) ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header y Acciones */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Remito N° {remito.numero_remito}</h1>
            {tieneIncidencia ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Incidencia Registrada
              </Badge>
            ) : (
              <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Conciliado
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Detalle del despacho de residuos peligrosos a DGM.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.get('/remitos-salida')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Historial
        </Button>
      </div>

      {/* Alerta si tiene Incidencia asociada */}
      {tieneIncidencia && (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold text-base">Discrepancia en Conciliación de Retiro</AlertTitle>
          <AlertDescription className="text-sm mt-1 space-y-1">
            <p>{remito.incidencia?.descripcion}</p>
            <p className="text-xs opacity-90">
              Estado de la Incidencia: <strong>{remito.incidencia?.estado}</strong>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Datos del Remito y Transporte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center text-muted-foreground text-xs font-medium uppercase gap-1">
              <Calendar className="h-4 w-4" /> Fecha y Hora de Retiro
            </div>
            <p className="text-lg font-semibold">
              {new Date(remito.fecha_retiro).toLocaleString('es-AR', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center text-muted-foreground text-xs font-medium uppercase gap-1">
              <Truck className="h-4 w-4" /> Responsable / Transporte
            </div>
            <p className="text-lg font-semibold">{remito.responsable_empresa}</p>
            {remito.datos_transporte && (
              <p className="text-xs text-muted-foreground">{remito.datos_transporte}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center text-muted-foreground text-xs font-medium uppercase gap-1">
              <User className="h-4 w-4" /> Despachado por (Hospital)
            </div>
            <p className="text-lg font-semibold">
              {remito.usuario_despacha
                ? `${remito.usuario_despacha.first_name} ${remito.usuario_despacha.last_name}`
                : 'Usuario Sistema'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Cantidades */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-primary" />
            Resumen de Conciliación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border p-4 rounded-lg bg-muted/20">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Bolsas Según Sistema</p>
              <p className="text-2xl font-bold">{cantSistema}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Bolsas Declaradas DGM</p>
              <p className="text-2xl font-bold">{remito.cantidad_bolsas_declaradas_Empresa}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Peso Total Despachado</p>
              <p className="text-2xl font-bold text-primary">{pesoTotal.toFixed(2)} kg</p>
            </div>
          </div>

          {remito.observaciones && (
            <div className="mt-4 p-3 bg-card border rounded-md">
              <p className="text-xs font-medium text-muted-foreground uppercase">Observaciones:</p>
              <p className="text-sm mt-1">{remito.observaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Bolsas Incluidas */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Bolsas Asociadas al Remito ({cantSistema})
          </CardTitle>
          <CardDescription>
            Listado individual de bolsas retiradas por el transporte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!remito.bolsas || remito.bolsas.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No hay detalle individual de bolsas disponible.
            </p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Código de Barras</TableHead>
                    <TableHead className="text-right">Peso Registrado (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {remito.bolsas.map((bolsa, index) => (
                    <TableRow key={bolsa.id}>
                      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-mono font-bold text-primary">{bolsa.codigo_barra}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {bolsa.peso != null ? Number(bolsa.peso).toFixed(2) : '0.00'} kg
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { CheckCircle2, AlertTriangle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ResultadoControl } from '../types/controlRecepcion';

interface Props {
  resultado: ResultadoControl;
}

function ListaCodigos({ titulo, codigos }: { titulo: string; codigos: string[] }) {
  if (codigos.length === 0) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">
        {titulo} ({codigos.length})
      </p>
      <div className="flex flex-wrap gap-1">
        {codigos.map((codigo) => (
          <Badge key={codigo} variant="outline" className="font-mono">
            {codigo}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ResumenControlRecepcion({ resultado }: Props) {
  const hayDiferencias =
    resultado.faltantes.length > 0 || resultado.sobrantes.length > 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          {hayDiferencias ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          )}
          Remito #{resultado.remito_id} conciliado
        </CardTitle>
        <CardDescription>
          Controlado por {resultado.responsable} el {resultado.fecha_control}.
          {hayDiferencias
            ? ' Se generaron incidencias pendientes por las diferencias encontradas.'
            : ' Sin diferencias con lo declarado.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-4">
          <Dato label="Declaradas" valor={resultado.cantidad_declarada} />
          <Dato label="Controladas" valor={resultado.controladas.length} />
          <Dato label="Faltantes" valor={resultado.faltantes.length} />
          <Dato label="Sobrantes" valor={resultado.sobrantes.length} />
        </div>

        <ListaCodigos titulo="Faltantes" codigos={resultado.faltantes} />
        <ListaCodigos titulo="Sobrantes" codigos={resultado.sobrantes} />
      </CardContent>
    </Card>
  );
}

function Dato({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{valor}</p>
    </div>
  );
}

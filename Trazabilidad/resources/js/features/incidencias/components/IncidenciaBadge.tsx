import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Props {
  estado: string;
}

export function IncidenciaBadge({ estado }: Props) {
  switch (estado) {
    case 'ABIERTA':
      return (
        <Badge variant="destructive" className="font-semibold">
          Abierta
        </Badge>
      );
    case 'EN_ANALISIS':
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
          En Análisis
        </Badge>
      );
    case 'RESUELTA':
      return (
        <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold">
          Resuelta
        </Badge>
      );
    case 'CERRADA':
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
          Cerrada
        </Badge>
      );
    default:
      return <Badge variant="secondary">{estado}</Badge>;
  }
}

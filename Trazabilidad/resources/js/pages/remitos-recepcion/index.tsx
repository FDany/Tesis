import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    PaginatedResponse,
  RemitoRecepcionModalForm,
  RemitoRecepcionTable,
  type RemitoRecepcion,
} from '@/features/remitos-recepcion';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface IndexProps {
  remitos: PaginatedResponse<RemitoRecepcion> | RemitoRecepcion[];// Puede ser un array simple o una respuesta paginada de Laravel
  tiposBolsa: TipoBolsa[];
}

export default function Index({ remitos, tiposBolsa }: IndexProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Si remitos viene paginado desde Laravel ($remitos->paginate()), extraemos el array de data
  const remitosList = Array.isArray(remitos) ? remitos : remitos.data;

  return (
    <>
      <Head title="Remitos de Recepción" />

      <div className="p-6 space-y-6">
        {/* Encabezado con título y botón de acción */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Remitos de Recepción
            </h1>
            <p className="text-muted-foreground text-sm">
              Gestión e ingreso de remitos y generación masiva de bolsas trazables.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Remito
          </Button>
        </div>

        {/* Tabla con la lista de registros */}
        <RemitoRecepcionTable data={remitosList} />

        {/* Modal con el formulario de creación */}
        <RemitoRecepcionModalForm
          open={modalOpen}
          onOpenChange={setModalOpen}
          tiposBolsa={tiposBolsa}
        />
      </div>
    </>
  );
}

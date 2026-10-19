import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  RemitoRecepcionModalForm,
  RemitoRecepcionTable,
  type RemitoRecepcion,
} from '@/features/remitos-recepcion';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import Paginacion, {
  type PaginacionData,
} from '@/components/Paginador';
import CantFilas from '@/components/cantFilas';

interface IndexProps {
  remitos: PaginacionData & { data: RemitoRecepcion[] };  //requiere una respuesta paginada cuyos elementos son remitos. 
  tiposBolsa: TipoBolsa[];                      //arreglo de tipos de bolsa
  porPagina: number;                            //requiere un número con la cantidad de remitos que se muestran por página.
  opcionesPorPagina: number[];                  //requiere un arreglo de números con las cantidades que el selector puede ofrecer
}

export default function Index({ 
  remitos, 
  tiposBolsa,
  porPagina,
  opcionesPorPagina,
}: IndexProps) {
  const [modalOpen, setModalOpen] = useState(false);


  const handlePorPaginaChange = (cantidad: number) => {
    router.get(
      '/remitos-recepcion',
      { por_pagina: cantidad },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

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

        {/* Limitador de cantidad de filas */}
        <CantFilas
          value={porPagina}
          options={opcionesPorPagina}
          onChange={handlePorPaginaChange}
        />

        {/* Tabla con la lista de registros */}
        <RemitoRecepcionTable data={remitos.data} />

        {/* Paginacion */}
        <Paginacion pagination={remitos} />

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

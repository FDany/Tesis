import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  BolsaTable,
  type Bolsa,
} from '@/features/bolsas';

import Paginacion, {
  type PaginacionData,
} from '@/components/Paginador';
import CantFilas from '@/components/CantFilas';

interface IndexProps {
  bolsas: PaginacionData & { data: Bolsa[] };  //requiere una respuesta paginada cuyos elementos son remitos.
  porPagina: number;                            //requiere un número con la cantidad de remitos que se muestran por página.
  opcionesPorPagina: number[];                  //requiere un arreglo de números con las cantidades que el selector puede ofrecer
}

export default function Index({
  bolsas,
  porPagina,
  opcionesPorPagina,
}: IndexProps) {
  const [modalOpen, setModalOpen] = useState(false);


  const handlePorPaginaChange = (cantidad: number) => {
    router.get(
      '/bolsas',
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
      <Head title="Bolsas" />

      <div className="p-6 space-y-6">
        {/* Encabezado con título y botón de acción */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bolsas
            </h1>
            <p className="text-muted-foreground text-sm">
              Trazabilidad de bolsas.
            </p>
          </div>
        </div>

        {/* Limitador de cantidad de filas */}
        <CantFilas
          value={porPagina}
          options={opcionesPorPagina}
          onChange={handlePorPaginaChange}
        />

        {/* Tabla con la lista de registros */}
        <BolsaTable data={bolsas.data} />

        {/* Paginacion */}
        <Paginacion pagination={bolsas} />

      </div>
    </>
  );
}

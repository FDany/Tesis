import { useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  RemitoRecepcionFiltros,
  RemitoRecepcionDetalleModal,
  RemitoRecepcionModalForm,
  RemitoRecepcionTable,
  type RemitoDetalle,
  type RemitoRecepcion,
} from '@/features/remitos-recepcion';
import type { TipoBolsa } from '@/features/tipos-bolsa';
import type { Tamanio } from '@/features/tamanios';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import Paginacion, {
  type PaginacionData,
} from '@/components/Paginador';
import CantFilas from '@/components/CantFilas';
import { useAuth } from '@/hooks/use-auth';

type ParametrosListado = {
  buscar: string;
  tipo_bolsa_id: string;
  tamanio_id: string;
  orden: string;
  direccion: string;
  por_pagina: number;
};

interface IndexProps {
  remitos: PaginacionData & { data: RemitoRecepcion[] };  //requiere una respuesta paginada cuyos elementos son remitos.
  tiposBolsa: TipoBolsa[];                      //arreglo de tipos de bolsa
  porPagina: number;                            //requiere un número con la cantidad de remitos que se muestran por página.
  opcionesPorPagina: number[];                  //requiere un arreglo de números con las cantidades que el selector puede ofrecer
  tamanios: Tamanio[];
  filtros: {
    buscar: string;
    tipo_bolsa_id: string;
    tamanio_id: string;
    orden: string;
    direccion: string;
  };
  remitoDetalle?: RemitoDetalle;
}

export default function Index({
  remitos,
  tiposBolsa,
  porPagina,
  opcionesPorPagina,
  tamanios,
  filtros,
  remitoDetalle,
}: IndexProps) {
  const { can } = useAuth();

  const [buscar, setBuscar] = useState(filtros.buscar ?? '');
  const [tipoBolsaId, setTipoBolsaId] = useState(filtros.tipo_bolsa_id ?? '');
  const [tamanioId, setTamanioId] = useState(filtros.tamanio_id ?? '');
  const [orden, setOrden] = useState(filtros.orden ?? 'fecha_recepcion');
  const [direccion, setDireccion] = useState(filtros.direccion ?? 'asc');


  const [modalOpen, setModalOpen] = useState(false);

  // Filtro, Busqueda y Ordenamiento
  const visitarListado = (
    cambios: Partial<ParametrosListado> = {},
  ) => {
    router.get(
      '/remitos-recepcion',
      {
        buscar,
        tipo_bolsa_id: tipoBolsaId,
        tamanio_id: tamanioId,
        orden,
        direccion,
        por_pagina: porPagina,
        ...cambios,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

  const aplicarBusqueda = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    visitarListado();
  };

  const cambiarFiltro = (key: string, value: string) => {
    if (key === 'buscar') {
      setBuscar(value);
      return;
    }

    if (key === 'tipo_bolsa_id') {
      const nuevoValor = value === 'TODOS' ? '' : value;
      setTipoBolsaId(nuevoValor);
      visitarListado({ tipo_bolsa_id: nuevoValor });
      return;
    }

    if (key === 'tamanio_id') {
      const nuevoValor = value === 'TODOS' ? '' : value;
      setTamanioId(nuevoValor);
      visitarListado({ tamanio_id: nuevoValor });
    }
  };


  const handlePorPaginaChange = (cantidad: number) => {
    visitarListado({ por_pagina: cantidad });
  };

  const ordenarPor = (
    campo: 'fecha_recepcion' | 'cantidad_declarada',
  ) => {
    const nuevaDireccion =
      orden === campo && direccion === 'asc' ? 'desc' : 'asc';

    setOrden(campo);
    setDireccion(nuevaDireccion);
    visitarListado({ orden: campo, direccion: nuevaDireccion });
  };
  // *****************************************************

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [remitoSeleccionadoId, setRemitoSeleccionadoId] = useState<number | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const verDetalle = (id: number) => {
    setRemitoSeleccionadoId(id);
    setDetalleOpen(true);
    setCargandoDetalle(true);

    router.get(`/remitos-recepcion/${id}`, {}, {
      only: ['remitoDetalle'],
      preserveState: true,
      preserveScroll: true,
      preserveUrl: true,
      onFinish: () => setCargandoDetalle(false),
    });
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
          {can('crear remitosRecepcion') && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Remito
            </Button>
          )}
        </div>

        {/* Modal con el detalle del remito */}
        <RemitoRecepcionDetalleModal
          open={detalleOpen}
          onOpenChange={(open) => {
            setDetalleOpen(open);

            if (!open) {
              setRemitoSeleccionadoId(null);
              setCargandoDetalle(false);
            }
          }}
          remitoId={remitoSeleccionadoId}
          cargando={cargandoDetalle}
          detalle={remitoDetalle}
        />



        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <form onSubmit={aplicarBusqueda} className="min-w-0 flex-1">
            <RemitoRecepcionFiltros
              valores={{
                buscar,
                tipo_bolsa_id: tipoBolsaId,
                tamanio_id: tamanioId,
              }}
              tiposBolsa={tiposBolsa}
              tamanios={tamanios}
              onChange={cambiarFiltro}
            />
            <button type="submit" className="sr-only">
              Buscar remito
            </button>
          </form>

          <div className="flex justify-start lg:justify-end lg:-translate-y-1.5">
            {/* Limitador de cantidad de filas */}
            <CantFilas
              value={porPagina}
              options={opcionesPorPagina}
              onChange={handlePorPaginaChange}
            />
          </div>
        </div>

        {/* Tabla con la lista de registros */}
        <RemitoRecepcionTable
          data={remitos.data}
          onVer={verDetalle}
          orden={orden}
          direccion={direccion}
          onOrdenar={ordenarPor}
        />

        {/* Paginacion */}
        <Paginacion pagination={remitos} />

        {/* Modal con el formulario de creación */}
        <RemitoRecepcionModalForm
          open={modalOpen}
          onOpenChange={setModalOpen}
          tiposBolsa={tiposBolsa}
          tamanios={tamanios}
        />
      </div>
    </>
  );
}

import { useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  BolsaDetalleModal,
  BolsaTable,
  type Bolsa,
  type BolsaDetalle,
} from '@/features/bolsas';

import Paginacion, {
  type PaginacionData,
} from '@/components/Paginador';
import CantFilas from '@/components/CantFilas';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Label } from '@/components/ui/label';


interface Filtros {
  buscar: string;
  estado: string;
}

interface IndexProps {
  bolsas: PaginacionData & { data: Bolsa[] };  //requiere una respuesta paginada cuyos elementos son remitos.
  porPagina: number;                            //requiere un número con la cantidad de remitos que se muestran por página.
  opcionesPorPagina: number[];                 //requiere un arreglo de números con las cantidades que el selector puede ofrecer
  filtros: Filtros;
  bolsaDetalle?: BolsaDetalle;
}

export default function Index({
  bolsas,
  porPagina,
  opcionesPorPagina,
  filtros,
  bolsaDetalle
}: IndexProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Inicializamos los estados con los valores provenientes
  const [buscar, setBuscar] = useState(filtros?.buscar ?? '');
  const [estado, setEstado] = useState(filtros?.estado ?? '');


  // Para procesar el formulario de búsqueda
  const aplicarFiltros = (e: FormEvent) => {
    e.preventDefault();
    router.get(
      '/bolsas',
      {
        buscar,
        estado,
        por_pagina: porPagina // Conservo la cantidad de filas seleccionada
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      }
    );
  };


  const handlePorPaginaChange = (cantidad: number) => {
    router.get(
      '/bolsas',
      {
        por_pagina: cantidad,
        buscar, // Conservo la búsqueda actual
        estado  // Conservo el filtro de estado actual
      },
      {
        preserveState: true,
        replace: true,
      },
    );
  };


  const [detalleOpen, setDetalleOpen] = useState(false);
  const [bolsaSeleccionadaId, setBolsaSeleccionadaId] = useState<number | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);



  const verDetalle = (id: number) => {
    setBolsaSeleccionadaId(id);
    setDetalleOpen(true);
    setCargandoDetalle(true);
    router.get(`/bolsas/${id}`, {}, {
      only: ['bolsaDetalle'],   //pide a Inertia que actualice solo la propiedad bolsaDetalle de la página.
      preserveState: true,      //conserva el estado existente de React, como los valores de búsqueda y filtros.
      preserveScroll: true,     //conserva la posición de desplazamiento actual de la página.
      preserveUrl: true,        //conserva la URL actual en la barra de direcciones del navegador.
      onFinish: () => setCargandoDetalle(false),  //una vez que la solicitud se completa, se actualiza el estado para indicar que la carga ha finalizado.
    });
  };

  // Modal de detalle de bolsa



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

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Formulario de búsqueda y filtros[cite: 7] */}
          <form
            onSubmit={aplicarFiltros}
            className="flex min-w-0 flex-1 flex-col items-center gap-4 rounded-md border bg-white p-4 sm:flex-row"
          >
            <Label htmlFor="buscar-bolsa" className="sr-only">
              Código de barras
            </Label>

            <Input
              id="buscar-bolsa"
              name="buscar"
              type="text"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar por código de barras..."
              autoComplete="off"
              className="pl-9"
            />

            <Select
              name="estado"
              autoComplete="off"
              value={estado || 'todos'}
              onValueChange={(value) => setEstado(value === 'todos' ? '' : value)}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="no_recibido">No recibido</SelectItem>
                <SelectItem value="Recibido">Recibido</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">
              <Search aria-hidden="true" className="mr-2 size-4" />
              Buscar
            </Button>
          </form>



          {/* Limitador de cantidad de filas */}
          <div className="flex justify-start lg:justify-end">
            <CantFilas
              value={porPagina}
              options={opcionesPorPagina}
              onChange={handlePorPaginaChange}
            />
          </div>

        </div>

        {/* Modal de detalle de bolsa */}
        <BolsaDetalleModal
          open={detalleOpen}
          onOpenChange={(open) => {
            setDetalleOpen(open);

            if (!open) {
              setBolsaSeleccionadaId(null);
              setCargandoDetalle(false);
            }
          }}
          bolsaId={bolsaSeleccionadaId}
          cargando={cargandoDetalle}
          detalle={bolsaDetalle}
        />

        {/* Tabla con la lista de registros */}
        <BolsaTable data={bolsas.data} onVer={verDetalle} />

        {/* Paginacion */}
        <Paginacion pagination={bolsas} />

      </div>
    </>
  );
}

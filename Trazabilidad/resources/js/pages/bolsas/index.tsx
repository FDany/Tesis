import { useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    BolsaDetalleModal,
    BolsaTabla,
    type Bolsa,
    type BolsaDetalle,
    FiltrosBolsas,
} from '@/features/bolsas';
import Paginacion, {
    type PaginacionData,
} from '@/components/Paginador';
import CantFilas from '@/components/CantFilas';
import { FileSpreadsheet } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';


interface Filtros {
    buscar: string;
    estado: string;
    orden: string;
    direccion: string;
}

interface IndexProps {
    bolsas: PaginacionData & { data: Bolsa[] };  //requiere una respuesta paginada cuyos elementos son remitos.
    porPagina: number;                            //requiere un número con la cantidad de remitos que se muestran por página.
    opcionesPorPagina: number[];                 //requiere un arreglo de números con las cantidades que el selector puede ofrecer
    filtros: Filtros;
    estados: string[];
    bolsaDetalle?: BolsaDetalle;
}

export default function Index({
    bolsas,
    porPagina,
    opcionesPorPagina,
    filtros,
    estados,
    bolsaDetalle
}: IndexProps) {

    const { can } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    // Inicializamos los estados con los valores provenientes
    const [buscar, setBuscar] = useState(filtros?.buscar ?? '');
    const [estado, setEstado] = useState(filtros?.estado ?? '');

    // Estados para el ordenamiento
    const [orden, setOrden] = useState(filtros?.orden ?? 'created_at');
    const [direccion, setDireccion] = useState(filtros?.direccion ?? 'desc');

    // Función que alterna el orden y dispara Inertia
    const ordenarPor = (campo: string) => {
        let nuevaDireccion = 'asc';
        if (orden === campo && direccion === 'asc') {
            nuevaDireccion = 'desc';
        }

        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get(
            '/bolsas',
            {
                buscar,
                estado,
                orden: campo,
                direccion: nuevaDireccion,
                por_pagina: porPagina,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };


    const cambiarFiltro = (key: string, value: string) => {
        if (key === 'buscar') {
            setBuscar(value);
            return;
        }

        if (key === 'estado') {
            const nuevoEstado = value === 'todos' ? '' : value;
            setEstado(nuevoEstado);

            router.get(
                '/bolsas',
                {
                    buscar,
                    estado: nuevoEstado,
                    orden,
                    direccion,
                    por_pagina: porPagina,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    };


    // Para procesar el formulario de búsqueda
    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/bolsas',
            {
                buscar,
                estado,
                orden,
                direccion,
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
                estado,  // Conservo el filtro de estado actual
                orden,
                direccion,
            },
            {
                preserveState: true,
                preserveScroll: true,
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

    // Excel
    const handleExportExcel = () => {
        const params = new URLSearchParams({
            buscar: buscar || '',
            estado: estado || '',
            orden: orden || 'created_at',
            direccion: direccion || 'desc',
        }).toString();

        window.location.href = `/bolsas/export?${params}`;
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

                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                    {/* Formulario de búsqueda y filtros */}
                    <form
                        onSubmit={aplicarFiltros}
                        className="min-w-0 flex-1"
                    >
                        <FiltrosBolsas
                            valores={{ buscar, estado }}
                            estados={estados}
                            onChange={cambiarFiltro}
                        />
                        <button type="submit" className="sr-only">
                            Buscar por código de barras
                        </button>
                    </form>

                    {/* Excel */}
                    <div className="flex justify-start lg:justify-end lg:-translate-y-1.5">
                        {(can('descargarExcel bolsas')) && (
                            <button
                                type="button"
                                onClick={handleExportExcel}
                                aria-label="Exportar a Excel"
                                title="Exportar a Excel"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow transition-colors hover:bg-emerald-500"
                            >
                                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                            </button>)}
                    </div>

                    {/* Limitador de cantidad de filas */}
                    <div className="flex justify-start lg:justify-end lg:-translate-y-1.5">
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
                <BolsaTabla
                    data={bolsas.data}
                    orden={orden}
                    direccion={direccion}
                    onVer={verDetalle}
                    onOrdenar={ordenarPor}
                />

                {/* Paginacion */}
                <Paginacion pagination={bolsas} />

            </div >
        </>
    );
}

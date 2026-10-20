import React from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button'; 
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// Esta interfaz refleja la estructura exacta que Laravel envía desde el backend
export interface PaginacionData {
    from: number | null;    //número del primer elemento mostrado en la página actual
    to: number | null;      //número del último elemento mostrado
    total: number;          //cantidad total de elementos disponibles
    current_page: number;   //número de la página actual
    last_page: number;      //número de la última página
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface PaginacionProps {
    pagination: PaginacionData;
    //itemName?: string; // Ej: "carreras", "usuarios", "registros"
}

export default function Paginacion({ 
    pagination, 
    //itemName = "registros"
}: PaginacionProps) {
    // Si no hay datos, no renderizamos el paginador
    if (!pagination.total) 
        return null;

    return (
        <div className={`bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4`}> 
            {/* Información de Registros */} 
            {/* <p className="text-sm text-muted-foreground text-center sm:text-left"> 
                Mostrando{' '}
                <span className="font-semibold text-foreground">
                    {pagination.from ?? 0}
                </span> 
                {' '}a{' '} 
                <span className="font-semibold text-foreground">
                    {pagination.to ?? 0}
                </span> 
                {' '}de{' '} 
                <span className="font-semibold text-foreground">
                    {pagination.total}
                </span> */}
                {/* {' '}{itemName}  */}
            {/* </p>  */}


            <p className="text-sm text-muted-foreground text-center sm:text-left">
                Mostrando{' '}
                <span className="font-semibold text-foreground">
                    {pagination.from ?? 0}
                </span>
                {'–'}
                <span className="font-semibold text-foreground">
                    {pagination.to ?? 0}
                </span>
                {' de '}
                <span className="font-semibold text-foreground">
                    {pagination.total}
                </span>
                {' registros'}
            </p>

            {/* Botones de Navegación */} 
            <div className="flex items-center gap-4"> 
                {/* Botón Anterior */} 
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    disabled={!pagination.prev_page_url} 
                    onClick={() => router.get(pagination.prev_page_url!)} 
                    className="bg-white text-gray-700 hover:bg-gray-50 shadow-xs disabled:opacity-50" 
                > 
                    <ChevronLeft className="w-4 h-4 mr-1" /> 
                    Anterior 
                </Button>

                {/* Indicador de Página Actual */} 
                <span className="text-sm text-muted-foreground bg-gray-100/80 border border-gray-200/60 px-3 py-1.5 rounded-lg font-medium"> 
                    Página{' '}
                    <span className="text-foreground font-semibold">
                        {pagination.current_page}
                    </span> 
                    {' '}de{' '} 
                    <span className="text-foreground font-semibold">
                        {pagination.last_page}
                    </span>
                </span>

                {/* Botón Siguiente */} 
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    disabled={!pagination.next_page_url} 
                    onClick={() => router.get(pagination.next_page_url!)} 
                    className="bg-white text-gray-700 hover:bg-gray-50 shadow-xs disabled:opacity-50" 
                > 
                    Siguiente 
                    <ChevronRight className="w-4 h-4 ml-1" /> 
                </Button> 
            </div> 
        </div>
    );
}
import React from 'react';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';

interface cantFilasSelectorProps {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
    className?: string;
    total?: number;
}

export default function CantFilas({
    value,
    onChange,
    options = [5, 10, 20],
    className = "inline-flex w-fit",
    total,
}: cantFilasSelectorProps) {
    if (total !== undefined && total <= Math.min(...options)) {
        return null;
    }

    return (

        <div className={`${className} flex flex-row flex-nowrap items-center gap-2`}>
            <label htmlFor="cantidad-filas" className="shrink-0 whitespace-nowrap text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Mostrar
            </label>

            <Select
                name="por_pagina"
                autoComplete="off"
                value={String(value)}
                onValueChange={(val) => onChange(Number(val))}
            >
                <SelectTrigger id="cantidad-filas" className="w-32 shrink-0 bg-muted border-border text-foreground">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                            {option} filas
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
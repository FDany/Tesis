import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ReactNode } from 'react';


export interface OpcionFiltro {
    value: string;
    label: ReactNode;
}

export type CampoFiltro =
    | {
        key: string;
        label: string;
        type: 'text' | 'date';
        placeholder?: string;
    }
    | {
        key: string;
        label: string;
        type: 'select';
        options: OpcionFiltro[];
    };

interface Props {
    campos: CampoFiltro[];
    valores: Record<string, string>;
    onChange: (key: string, value: string) => void;
    className?: string;
}

export function FiltroGenerico({
    campos,
    valores,
    onChange,
    className = 'flex flex-wrap items-end gap-4',
}: Props) {
    return (
        <div className={className}>
            {campos.map((campo) => {
                const id = `filtro-${campo.key}`;
                const value = valores[campo.key] ?? '';

                return (
                    <div
                        key={campo.key}
                        className="min-w-45 flex-1 space-y-1.5"
                    >
                        <Label htmlFor={id} className="min-h-5">
                            {campo.label}
                        </Label>

                        {campo.type === 'select' ? (
                            <Select
                                value={value || campo.options[0]?.value}
                                onValueChange={(nextValue) => onChange(campo.key, nextValue)}
                            >
                                <SelectTrigger id={id} className="h-9 w-full">
                                    <SelectValue placeholder={campo.label} />
                                </SelectTrigger>

                                <SelectContent>
                                    {campo.options.map((opcion) => (
                                        <SelectItem key={opcion.value} value={opcion.value}>
                                            {opcion.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                id={id}
                                type={campo.type}
                                value={value}
                                placeholder={campo.placeholder}
                                onChange={(event) =>
                                    onChange(campo.key, event.target.value)
                                }
                                className="h-9"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
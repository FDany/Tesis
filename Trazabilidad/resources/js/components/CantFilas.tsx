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
}

export default function CantFilas({ 
    value, 
    onChange, 
    options = [5, 10, 20], 
    className = "inline-flex w-fit" 
}:cantFilasSelectorProps) {
    return (
        <div className={`${className} flex flex-row flex-nowrap items-center gap-2`}>
            <label className="shrink-0 whitespace-nowrap text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mostrar
            </label>
            
            <Select 
                value={String(value)}
                onValueChange={(val) => onChange(Number(val))} 
            > 
                <SelectTrigger className="w-32 shrink-0 bg-gray-50 border-gray-300 text-gray-900">
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
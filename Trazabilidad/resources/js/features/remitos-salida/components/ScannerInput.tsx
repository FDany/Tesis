import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, Scan } from 'lucide-react';

interface ScannerInputProps {
  onScan: (codigo: string) => Promise<void> | void;
  disabled?: boolean;
}

export function ScannerInput({ onScan, disabled = false }: ScannerInputProps) {
  const [codigo, setCodigo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantiene el foco en el input para lecturas seguidas con el escáner
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigoLimpio = codigo.trim();

    if (!codigoLimpio || disabled) return;

    await onScan(codigoLimpio);

    // Limpia el input y reenfoca para la siguiente bolsa
    setCodigo('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Escanear o ingresar código de barras de la bolsa..."
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="pl-10 text-lg py-6"
          disabled={disabled}
          autoFocus
        />
      </div>
      <Button type="submit" size="lg" disabled={disabled || !codigo.trim()}>
        <Scan className="mr-2 h-5 w-5" /> Escanear
      </Button>
    </form>
  );
}

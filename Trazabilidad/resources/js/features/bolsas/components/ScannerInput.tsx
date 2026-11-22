import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, Scan } from 'lucide-react';

interface ScannerInputProps {
  onScan: (codigo: string) => Promise<boolean | void> | boolean | void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  buttonLabel?: string;
}

export function ScannerInput({
  onScan,
  disabled = false,
  id,
  placeholder = 'Escanear o ingresar código de barras de la bolsa...',
  buttonLabel = 'Escanear',
}: ScannerInputProps) {
  const [codigo, setCodigo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantiene el foco en el input para lecturas seguidas con el escáner
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async () => {
    const codigoLimpio = codigo.trim();

    if (!codigoLimpio || disabled) return;

    const resultado = await onScan(codigoLimpio);

    if (resultado === false) {
      inputRef.current?.focus();
      return;
    }

    setCodigo('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleScan();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id={id}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={codigo}
          onChange={(event) => setCodigo(event.target.value)}
          onKeyDown={handleKeyDown}
          className="h-12 pl-10 text-lg"
          disabled={disabled}
          autoFocus
        />
      </div>
      <Button
        type="button"
        size="lg"
        className="h-12"
        disabled={disabled || !codigo.trim()}
        onClick={() => void handleScan()}
      >
        <Scan className="mr-2 h-5 w-5" />
        {buttonLabel}
      </Button>
    </div>
  );
}

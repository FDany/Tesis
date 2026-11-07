import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  ScannerInput,
  TablaBolsasEscaneadas,
  FormularioRemito,
  type CreateRemitoSalidaRetiroDTO,
} from '@/features/remitos-salida';
import type { Bolsa } from '@/features/bolsas/types/bolsa';

export default function CreateRemitoSalida() {
  const [bolsas, setBolsas] = useState<Bolsa[]>([]);
  const [scannedError, setScannedError] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm<CreateRemitoSalidaRetiroDTO>({
    bolsas_ids: [],
    observaciones: '',
  });

  // Escaneo en vivo con validación por API
  const handleScanBolsa = async (codigo: string) => {
    setScannedError(null);

    // Limpia espacios y guiones para obtener los 13 dígitos continuos
    const codigoLimpio = codigo.replace(/[-\s]/g, '').trim();

    try {
      const res = await fetch(`/api/bolsas/buscar-para-despacho?codigo=${encodeURIComponent(codigoLimpio)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Bolsa no encontrada o no disponible para despacho');
      }

      const bolsa: Bolsa = await res.json();

      if (bolsas.some((b) => b.id === bolsa.id)) {
        setScannedError(`La bolsa con código ${bolsa.codigo_barra} ya fue escaneada.`);
        return;
      }

      const nuevasBolsas = [...bolsas, bolsa];
      setBolsas(nuevasBolsas);
      setData('bolsas_ids', nuevasBolsas.map((b) => b.id));
    } catch (err: any) {
      setScannedError(err.message);
    }
  };

  const handleRemoveBolsa = (id: number) => {
    const nuevasBolsas = bolsas.filter((b) => b.id !== id);
    setBolsas(nuevasBolsas);
    setData('bolsas_ids', nuevasBolsas.map((b) => b.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/remitos-salida');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Despacho Interno</h1>
          <p className="text-muted-foreground">
            Escaneo de bolsas pesadas y generación de remito interno (PDF) del Hospital San Bernardo.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.get('/remitos-salida')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Historial
        </Button>
      </div>

      {/* 1. Lectura de Bolsas */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Lectura e Identificación de Bolsas (Sistema)</CardTitle>
          <CardDescription>
            Pase el lector sobre cada bolsa pesada disponible para salida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScannerInput onScan={handleScanBolsa} disabled={processing} />

          {scannedError && (
            <p className="text-sm font-medium text-destructive">{scannedError}</p>
          )}

          <TablaBolsasEscaneadas
            bolsas={bolsas}
            onRemoveBolsa={handleRemoveBolsa}
            disabled={processing}
          />
        </CardContent>
      </Card>

      {/* 2. Formulario de Emisión Interna */}
      <FormularioRemito
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        canSubmit={bolsas.length > 0}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

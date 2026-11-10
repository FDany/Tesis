<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Remito Interno de Salida - {{ $remito->numero_remito_interno }}</title>
    <style>
        @page {
            margin: 1.2cm 1.5cm;
        }

        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.4;
        }

        .header {
            width: 100%;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }

        .header table {
            width: 100%;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            color: #0369a1;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 10px;
            color: #64748b;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: bold;
            border-radius: 4px;
            background-color: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
            background-color: #f1f5f9;
            padding: 4px 8px;
            margin-top: 12px;
            margin-bottom: 6px;
            border-left: 3px solid #0284c7;
        }

        .grid-table {
            width: 100%;
            margin-bottom: 8px;
        }

        .grid-table td {
            padding: 3px 0;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            color: #475569;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }

        .data-table th {
            background-color: #0284c7;
            color: #ffffff;
            font-size: 10px;
            text-align: left;
            padding: 6px;
            text-transform: uppercase;
        }

        .data-table td {
            border-bottom: 1px solid #e2e8f0;
            padding: 5px 6px;
            font-size: 10px;
        }

        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .totals-table {
            width: 100%;
            margin-top: 8px;
        }

        .totals-card {
            float: right;
            width: 220px;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 6px 10px;
        }

        .totals-card table {
            width: 100%;
        }

        .totals-card td {
            padding: 2px 0;
        }

        .clear {
            clear: both;
        }

        .signatures {
            margin-top: 35px;
            /* Reducido de 60px a 35px para no cortar firmas abajo */
            width: 100%;
        }

        .signatures td {
            width: 50%;
            text-align: center;
            vertical-align: bottom;
        }

        .line {
            width: 70%;
            margin: 0 auto 4px auto;
            border-top: 1px solid #94a3b8;
        }

        .footer {
            position: fixed;
            bottom: -20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 4px;
        }
    </style>
</head>

<body>

    <!-- Cabecera Institucional -->
    <div class="header">
        <table>
            <tr>
                <td style="width: 65%;">
                    <div class="title">Hospital San Bernardo</div>
                    <div class="subtitle">Sistema EcoGestión - Control de Residuos Hospitalarios</div>
                    <div class="subtitle">Salta, Argentina</div>
                </td>
                <td style="width: 35%; text-align: right;">
                    <div style="font-size: 14px; font-weight: bold; color: #0f172a;">REMITO INTERNO DE SALIDA</div>
                    <div style="margin-top: 4px;">
                        <span class="badge">{{ $remito->numero_remito_interno }}</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información General del Despacho -->
    <div class="section-title">Datos del Despacho Interno</div>
    <table class="grid-table">
        <tr>
            <td style="width: 50%;">
                <span class="label">Fecha y Hora de Emisión:</span>
                {{ \Carbon\Carbon::parse($remito->fecha_emision)->format('d/m/Y H:i') }} hs
            </td>
            <td style="width: 50%;">
                <span class="label">Emitido por (Hospital):</span>
                {{ $remito->usuarioDespacha?->full_name ?? 'N/A' }}
            </td>
        </tr>
        <tr>
            <td>
                <span class="label">Estado Actual:</span>
                <strong>{{ $remito->estado }}</strong>
            </td>
            <td>
                <span class="label">Vínculo DGM:</span>
                {{ $remito->numero_remito ?? 'PENDIENTE DE RETIRO (Sin conciliar)' }}
            </td>
        </tr>
        @if ($remito->observaciones)
            <tr>
                <td colspan="2">
                    <span class="label">Observaciones:</span> {{ $remito->observaciones }}
                </td>
            </tr>
        @endif
    </table>

    <!-- Detalle de Bolsas Cargadas -->
    <div class="section-title">Detalle de Residuos Despachados</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 25%;">Código de Barras</th>
                <th style="width: 30%;">Tipo de Residuo</th>
                <th style="width: 25%;">Origen / Servicio</th>
                <th style="width: 15%; text-align: right;">Peso (kg)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($remito->bolsas as $index => $bolsa)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td><strong>{{ $bolsa->codigo_barra }}</strong></td>
                    <td>{{ $bolsa->tipoBolsa->tipo_residuo ?? 'Residuo Patogénico' }}</td>
                    {{-- Acceso anidado a través del remito de entrega al servicio --}}
                    <td>{{ $bolsa->remitoEntregaServicio->servicio->nombre ?? 'Depósito Central' }}</td>
                    <td style="text-align: right;">{{ number_format($bolsa->peso, 2, ',', '.') }} kg</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: #94a3b8; padding: 10px;">
                        No hay bolsas vinculadas a este remito.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Tarjeta de Resumen / Totales -->
    <div class="totals-table">
        <div class="totals-card">
            <table>
                <tr>
                    <td class="label">Total Bolsas:</td>
                    <td style="text-align: right; font-weight: bold;">{{ $remito->cantidad_bolsas_sistema }} u.</td>
                </tr>
                <tr>
                    <td class="label">Peso Total Acumulado:</td>
                    <td style="text-align: right; font-weight: bold; font-size: 12px; color: #0369a1;">
                        {{ number_format($remito->peso_total_sistema ?? $remito->bolsas->sum('peso'), 2, ',', '.') }}
                        kg
                    </td>
                </tr>
            </table>
        </div>
        <div class="clear"></div>
    </div>

    <!-- Firmas de Conformidad -->
    <table class="signatures">
        <tr>
            <td>
                <div class="line"></div>
                <div class="label">Entregó (Hospital San Bernardo)</div>
                <div style="font-size: 9px; color: #64748b;">Firma, Aclaración y DNI</div>
            </td>
            <td>
                <div class="line"></div>
                <div class="label">Recibió (Transporte / DGM)</div>
                <div style="font-size: 9px; color: #64748b;">Firma, Aclaración y DNI Chofer</div>
            </td>
        </tr>
    </table>

    <!-- Pie de página -->
    <div class="footer">
        Hospital San Bernardo — Documento de Control Interno — Impreso el {{ date('d/m/Y H:i') }} hs
    </div>

</body>

</html>

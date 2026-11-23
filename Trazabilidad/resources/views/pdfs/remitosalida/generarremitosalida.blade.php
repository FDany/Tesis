<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Remito Interno de Salida - {{ $remito->numero_remito_interno }} | EcoGestión</title>
    <style>
        @page {
            /* Margen inferior de 50mm reservado para firmas y pie de página fijo */
            margin: 18mm 15mm 50mm 15mm;
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.4;
            margin: 0;
        }

        /* Encabezado Institucional con línea continua */
        .header-wrapper {
            border-bottom: 2px solid #296b8b;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-logo {
            width: 110px;
            vertical-align: middle;
        }
        .header-logo img {
            height: 58px;
            width: auto;
        }
        .header-title {
            vertical-align: middle;
            padding-left: 10px;
        }
        .header-title .system-name {
            font-size: 14px;
            font-weight: bold;
            color: #296b8b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .header-title .hospital-name {
            font-size: 11px;
            color: #4b5563;
            margin-top: 2px;
        }
        .header-meta {
            text-align: right;
            vertical-align: middle;
            width: 220px;
        }
        .doc-badge {
            display: inline-block;
            background-color: #296b8b;
            color: #ffffff;
            font-size: 10.5px;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 4px;
        }
        .doc-date {
            font-size: 9.5px;
            color: #6b7280;
            margin-top: 5px;
        }

        /* Títulos de Sección */
        .section-title {
            font-size: 11.5px;
            font-weight: bold;
            color: #296b8b;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            border-left: 3px solid #2e7bb8;
            padding-left: 8px;
            margin: 16px 0 8px 0;
        }

        /* Tabla de Detalles (2 columnas de pares etiqueta-valor) */
        .details-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            border: 1px solid #d1d5db;
        }
        .details-grid td {
            padding: 7px 10px;
            border: 1px solid #e5e7eb;
            vertical-align: middle;
        }
        .details-grid td.label {
            width: 20%;
            background-color: #f8fafc;
            font-weight: bold;
            color: #374151;
            font-size: 10px;
        }
        .details-grid td.value {
            width: 30%;
            color: #111827;
        }
        .mono {
            font-family: DejaVu Sans Mono, monospace;
            font-size: 10.5px;
        }
        .status-pill {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 3px;
            font-size: 9.5px;
            font-weight: bold;
            background-color: #e0f2fe;
            color: #296b8b;
            border: 1px solid #bae6fd;
            text-transform: uppercase;
        }

        /* Tabla de Bolsas Despachadas */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }
        .data-table th {
            background-color: #296b8b;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            padding: 6px 8px;
            border: 1px solid #296b8b;
            text-align: left;
        }
        .data-table td {
            padding: 6px 8px;
            border: 1px solid #d1d5db;
            font-size: 10px;
        }
        .data-table tr:nth-child(even) td {
            background-color: #f9fafb;
        }

        /* Tarjeta de Totales */
        .totals-wrapper {
            width: 100%;
            margin-top: 10px;
            page-break-inside: avoid;
        }
        .totals-table {
            width: 250px;
            float: right;
            border-collapse: collapse;
            border: 1px solid #cbd5e1;
        }
        .totals-table td {
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            font-size: 10.5px;
        }
        .totals-table td.tot-label {
            background-color: #f8fafc;
            font-weight: bold;
            color: #374151;
        }
        .totals-table td.tot-value {
            text-align: right;
            font-weight: bold;
            color: #111827;
        }
        .totals-table tr.highlight td {
            background-color: #f0f7fb;
            color: #296b8b;
            font-size: 11.5px;
        }
        .clear {
            clear: both;
        }

        /* Bloque de Firmas anclado al pie con buen aire */
        .signatures {
            position: fixed;
            bottom: -14mm;
            left: 0;
            right: 0;
            width: 100%;
            border-collapse: collapse;
        }
        .signatures td {
            width: 50%;
            text-align: center;
            padding: 0 25px;
            vertical-align: bottom;
        }
        .signature-line {
            border-top: 1px solid #4b5563;
            padding-top: 5px;
            font-size: 10px;
            color: #374151;
        }
        .signature-sub {
            font-size: 8.5px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* Pie de página fijo debajo de las firmas */
        .footer {
            position: fixed;
            bottom: -36mm;
            left: 0;
            right: 0;
            border-top: 1px solid #e5e7eb;
            padding-top: 6px;
            font-size: 9px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Espacio para Firmas (anclado abajo) -->
    <table class="signatures">
        <tr>
            <td>
                <div class="signature-line">
                    Entregó (Hospital San Bernardo)
                    <div class="signature-sub">Firma, Aclaración y DNI</div>
                </div>
            </td>
            <td>
                <div class="signature-line">
                    Recibió (Transporte / DGM)
                    <div class="signature-sub">Firma, Aclaración y DNI Chofer</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Pie de página institucional -->
    <div class="footer">
        Hospital San Bernardo • Salta, Argentina — Sistema EcoGestión (Trazabilidad de Residuos Peligrosos)
    </div>

    <!-- Encabezado Institucional -->
    <div class="header-wrapper">
        <table class="header-table">
            <tr>
                <td class="header-logo">
                    <img src="{{ public_path('images/logo-hsb-vertical.png') }}" alt="Hospital San Bernardo">
                </td>
                <td class="header-title">
                    <div class="system-name">EcoGestión</div>
                    <div class="hospital-name">Gestión Ambiental Hospitalaria • Hospital San Bernardo</div>
                    <div class="hospital-name" style="font-size: 10px; color: #6b7280;">Remito Interno de Salida y Disposición Final</div>
                </td>
                <td class="header-meta">
                    <div class="doc-badge">{{ $remito->numero_remito_interno }}</div>
                    <div class="doc-date">Impreso: {{ now()->format('d/m/Y H:i') }} hs</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Información General del Despacho -->
    <div class="section-title">Datos del Despacho Interno</div>
    <table class="details-grid">
        <tr>
            <td class="label">Fecha de emisión</td>
            <td class="value">{{ \Carbon\Carbon::parse($remito->fecha_emision)->format('d/m/Y H:i') }} hs</td>
            <td class="label">Emitido por</td>
            <td class="value">{{ $remito->usuarioDespacha?->full_name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Estado actual</td>
            <td class="value">
                <span class="status-pill">{{ $remito->estado }}</span>
            </td>
            <td class="label">Manifiesto DGM</td>
            <td class="value mono">{{ $remito->numero_remito ?? 'PENDIENTE DE RETIRO (Sin conciliar)' }}</td>
        </tr>
        @if ($remito->observaciones)
            <tr>
                <td class="label">Observaciones</td>
                <td class="value" colspan="3">{{ $remito->observaciones }}</td>
            </tr>
        @endif
    </table>

    <!-- Detalle de Bolsas Cargadas -->
    <div class="section-title">Detalle de Residuos Despachados ({{ $remito->bolsas->count() }})</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 6%; text-align: center;">#</th>
                <th style="width: 24%;">Código de Barras</th>
                <th style="width: 30%;">Tipo de Residuo</th>
                <th style="width: 25%;">Origen / Servicio</th>
                <th style="width: 15%; text-align: right;">Peso (kg)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($remito->bolsas as $index => $bolsa)
                <tr>
                    <td style="text-align: center; color: #6b7280;">{{ $index + 1 }}</td>
                    <td class="mono"><strong>{{ $bolsa->codigo_barra }}</strong></td>
                    <td>{{ $bolsa->tipoBolsa?->tipo_residuo ?? 'Residuo Patogénico' }}</td>
                    <td>{{ $bolsa->remitoEntregaServicio?->servicio?->nombre ?? 'Depósito Central' }}</td>
                    <td style="text-align: right; font-weight: bold;">
                        {{ number_format($bolsa->peso, 2, ',', '.') }} kg
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: #6b7280; padding: 14px;">
                        No hay bolsas vinculadas a este remito.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Tarjeta de Resumen / Totales -->
    <div class="totals-wrapper">
        <table class="totals-table">
            <tr>
                <td class="tot-label">Total de Bolsas:</td>
                <td class="tot-value">{{ $remito->cantidad_bolsas_sistema }} u.</td>
            </tr>
            <tr class="highlight">
                <td class="tot-label" style="background-color: #f0f7fb; color: #296b8b;">Peso Total Sistema:</td>
                <td class="tot-value">{{ number_format($remito->peso_total_sistema ?? $remito->bolsas->sum('peso'), 2, ',', '.') }} kg</td>
            </tr>
        </table>
        <div class="clear"></div>
    </div>

</body>
</html>

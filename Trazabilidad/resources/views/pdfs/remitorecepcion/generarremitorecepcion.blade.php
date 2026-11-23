<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Remito de Recepción #{{ $remito->id }} | EcoGestión</title>
    <style>
        @page {
            margin: 18mm 15mm 50mm 15mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.4;
            margin: 0;
        }

        /* Encabezado Institucional */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 2px solid #296b8b;
            padding-bottom: 10px;
            margin-bottom: 16px;
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
            width: 190px;
        }

        .doc-badge {
            display: inline-block;
            background-color: #296b8b;
            color: #ffffff;
            font-size: 11px;
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

        .color-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid #6b7280;
            vertical-align: middle;
            margin-right: 4px;
        }

        .mono {
            font-family: DejaVu Sans Mono, monospace;
            font-size: 10.5px;
        }

        /* Tabla de Códigos en 3 columnas */
        .codes-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }

        .codes-table th {
            background-color: #296b8b;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            padding: 6px 8px;
            border: 1px solid #296b8b;
            text-align: left;
        }

        .codes-table td {
            padding: 5px 8px;
            border: 1px solid #d1d5db;
            font-size: 10px;
        }

        .codes-table tr:nth-child(even) td {
            background-color: #f9fafb;
        }

        .idx-col {
            width: 28px;
            color: #6b7280;
            text-align: center !important;
        }

        /* Bloque de Firmas más arriba */
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

        /* Pie de página bien separado abajo */
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
                    Firma y Aclaración — Responsable de Recepción
                </div>
            </td>
            <td>
                <div class="signature-line">
                    Firma y Aclaración — Control / Supervisión
                </div>
            </td>
        </tr>
    </table>

    <!-- Pie de página institucional -->
    <div class="footer">
        Hospital San Bernardo • Salta, Argentina — Sistema EcoGestión (Trazabilidad de Residuos Peligrosos)
    </div>

    <!-- Encabezado Institucional -->
    <table class="header-table">
        <tr>
            <td class="header-logo">
                <img src="{{ public_path('images/logo-hsb-vertical.png') }}" alt="Hospital San Bernardo">
            </td>
            <td class="header-title">
                <div class="system-name">EcoGestión</div>
                <div class="hospital-name">Gestión Ambiental Hospitalaria • Hospital San Bernardo</div>
                <div class="hospital-name" style="font-size: 10px; color: #6b7280;">Comprobante Oficial de Recepción de
                    Insumos</div>
            </td>
            <td class="header-meta">
                <div class="doc-badge">REMITO DE RECEPCIÓN #{{ $remito->id }}</div>
                <div class="doc-date">Emitido: {{ now()->format('d/m/Y H:i') }} hs</div>
            </td>
        </tr>
    </table>

    <!-- Datos Generales del Remito -->
    <div class="section-title">Datos de la Recepción</div>
    <table class="details-grid">
        <tr>
            <td class="label">Fecha de recepción</td>
            <td class="value">{{ $remito->fecha_recepcion?->format('d/m/Y H:i') ?? '-' }}</td>
            <td class="label">Registrado por</td>
            <td class="value">
                {{ $remito->usuarioRecep
                    ? trim($remito->usuarioRecep->first_name . ' ' . $remito->usuarioRecep->last_name)
                    : '-' }}
            </td>
        </tr>
        <tr>
            <td class="label">Tipo de residuo</td>
            <td class="value">{{ $remito->tipoBolsa?->tipo_residuo ?? '-' }}</td>
            <td class="label">Color de bolsa</td>
            <td class="value">
                @if ($remito->tipoBolsa?->color)
                    <span class="color-dot" style="background-color: {{ $remito->tipoBolsa->color }};"></span>
                    <span class="mono">{{ $remito->tipoBolsa->color }}</span>
                @else
                    -
                @endif
            </td>
        </tr>
        <tr>
            <td class="label">Tamaño</td>
            <td class="value">{{ $remito->tamanio?->nombre ?? '-' }}</td>
            <td class="label">Proveedor</td>
            <td class="value">{{ $remito->tipoBolsa?->proveedor ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Cantidad declarada</td>
            <td class="value"><strong>{{ $remito->cantidad_declarada }}</strong> bolsas</td>
            <td class="label">Rango de códigos</td>
            <td class="value mono">{{ $remito->codigo_inicio }} - {{ $remito->codigo_fin }}</td>
        </tr>
        <tr>
            <td class="label">Observaciones</td>
            <td class="value" colspan="3">{{ $remito->observaciones ?: 'Sin observaciones registradas.' }}</td>
        </tr>
    </table>

    <!-- Listado de Códigos de Barras en 3 columnas -->
    <div class="section-title">Detalle de Códigos de Barra Registrados ({{ $remito->bolsas->count() }})</div>

    @if ($remito->bolsas->isEmpty())
        <table class="codes-table">
            <tr>
                <td style="text-align: center; padding: 14px; color: #6b7280;">
                    Este remito no tiene bolsas asociadas.
                </td>
            </tr>
        </table>
    @else
        @php
            $filas = $remito->bolsas->values()->chunk(3);
        @endphp
        <table class="codes-table">
            <thead>
                <tr>
                    <th class="idx-col">#</th>
                    <th>Código de Barra</th>
                    <th class="idx-col">#</th>
                    <th>Código de Barra</th>
                    <th class="idx-col">#</th>
                    <th>Código de Barra</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($filas as $chunkIndex => $grupo)
                    <tr>
                        @for ($i = 0; $i < 3; $i++)
                            @php
                                $bolsa = $grupo->values()->get($i);
                                $numero = $chunkIndex * 3 + $i + 1;
                            @endphp
                            @if ($bolsa)
                                <td class="idx-col">{{ $numero }}</td>
                                <td class="mono">{{ $bolsa->codigo_barra }}</td>
                            @else
                                <td class="idx-col"></td>
                                <td></td>
                            @endif
                        @endfor
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

</body>

</html>

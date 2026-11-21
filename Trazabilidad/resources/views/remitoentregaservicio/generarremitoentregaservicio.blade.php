<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Remito de entrega a servicio #{{ $remito->id }}</title>
    <style>
        @page {
            margin: 1.5cm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1f2937;
        }

        .header {
            border-bottom: 2px solid #334155;
            margin-bottom: 18px;
            padding-bottom: 10px;
        }

        h1 {
            font-size: 18px;
            margin: 0 0 6px;
        }

        .muted {
            color: #64748b;
        }

        .details,
        .bags {
            width: 100%;
            border-collapse: collapse;
        }

        .details td {
            padding: 5px;
            vertical-align: top;
        }

        .bags {
            margin-top: 16px;
        }

        .bags th,
        .bags td {
            border: 1px solid #cbd5e1;
            padding: 7px;
            text-align: left;
        }

        .bags th {
            background: #f1f5f9;
        }

        .signatures {
            width: 100%;
            margin-top: 60px;
        }

        .signatures td {
            width: 50%;
            padding: 0 20px;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid #475569;
            padding-top: 7px;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>Remito de entrega a servicio</h1>
        <div class="muted">Remito N.º {{ $remito->id }}</div>
    </header>

    <table class="details">
        <tr>
            <td><strong>Fecha de entrega:</strong></td>
            <td>{{ $remito->fecha_entrega->format('d/m/Y H:i') }}</td>
            <td><strong>Servicio:</strong></td>
            <td>{{ $remito->servicio?->nombre ?? '—' }}</td>
        </tr>
        <tr>
            <td><strong>Retira:</strong></td>
            <td>{{ $remito->retira_nombre }}</td>
            <td><strong>Cargo:</strong></td>
            <td>{{ $remito->entregado_cargo }}</td>
        </tr>
        <tr>
            <td><strong>Entregado por:</strong></td>
            <td colspan="3">
                {{ $remito->usuarioEntrega
                    ? $remito->usuarioEntrega->first_name . ' ' . $remito->usuarioEntrega->last_name
                    : '—' }}
            </td>
        </tr>
        <tr>
            <td><strong>Cantidad de bolsas:</strong></td>
            <td colspan="3">{{ $remito->cantidad_bolsas_dadas }}</td>
        </tr>
    </table>

    <table class="bags">
        <thead>
            <tr>
                <th>N.º</th>
                <th>Código de barras</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($remito->bolsas as $indice => $bolsa)
                <tr>
                    <td>{{ $indice + 1 }}</td>
                    <td>{{ $bolsa->codigo_barra }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="2">No hay bolsas asociadas a este remito.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="signatures">
        <tr>
            <td>
                <div class="signature-line">Entrega</div>
            </td>
            <td>
                <div class="signature-line">Recibe</div>
            </td>
        </tr>
    </table>
</body>
</html>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Remito de recepción #{{ $remito->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #222; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 15px; margin-top: 24px; }
        .muted { color: #666; }
        .details { width: 100%; border-collapse: collapse; }
        .details td { padding: 6px; border-bottom: 1px solid #ddd; vertical-align: top; }
        .details td:first-child { width: 35%; font-weight: bold; }
        .codes { width: 100%; border-collapse: collapse; }
        .codes th, .codes td { padding: 5px; border: 1px solid #ddd; text-align: left; }
        .codes th { background: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Remito de recepción #{{ $remito->id }}</h1>
    <p class="muted">Generado el {{ now()->format('d/m/Y H:i') }}</p>

    <table class="details">
        <tr>
            <td>Fecha de recepción</td>
            <td>{{ $remito->fecha_recepcion?->format('d/m/Y H:i') ?? '-' }}</td>
        </tr>
        <tr>
            <td>Tipo de bolsa</td>
            <td>{{ $remito->tipoBolsa?->tipo_residuo ?? '-' }}</td>
        </tr>
        <tr>
            <td>Color</td>
            <td>
                @if ($remito->tipoBolsa?->color)
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid #999; background-color: {{ $remito->tipoBolsa->color }};"></span>
                    {{ $remito->tipoBolsa->color }}
                @else
                    -
                @endif
            </td>
        </tr>
        <tr>
            <td>Proveedor</td>
            <td>{{ $remito->tipoBolsa?->proveedor ?? '-' }}</td>
        </tr>
        <tr>
            <td>Tamaño</td>
            <td>{{ $remito->tamanio?->nombre ?? '-' }}</td>
        </tr>
        <tr>
            <td>Cantidad declarada</td>
            <td>{{ $remito->cantidad_declarada }}</td>
        </tr>
        <tr>
            <td>Rango de códigos</td>
            <td>{{ $remito->codigo_inicio }} - {{ $remito->codigo_fin }}</td>
        </tr>
        <tr>
            <td>Registrado por</td>
            <td>
                {{ $remito->usuarioRecep
                    ? trim($remito->usuarioRecep->first_name . ' ' . $remito->usuarioRecep->last_name)
                    : '-' }}
            </td>
        </tr>
        <tr>
            <td>Observaciones</td>
            <td>{{ $remito->observaciones ?: '-' }}</td>
        </tr>
    </table>

    <h2>Códigos de barra ({{ $remito->bolsas->count() }})</h2>
    <table class="codes">
        <thead>
            <tr>
                <th>#</th>
                <th>Código</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($remito->bolsas as $bolsa)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $bolsa->codigo_barra }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="2">Este remito no tiene bolsas asociadas.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>

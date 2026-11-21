@extends('emails.layout')

@section('content')
    <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #111827;">
        Estimad@,
    </p>
    <p style="margin-top: 0; margin-bottom: 24px; color: #4b5563;">
        Se adjunta el comprobante oficial en formato PDF correspondiente al 
        <strong>Remito de Recepción #{{ $remito->id }}</strong>.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
        <tr>
            <td style="padding: 16px 20px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Fecha de Recepción</p>
                <p style="margin: 0 0 14px 0; font-size: 15px; color: #0f172a; font-weight: 500;">
                    {{ $remito->fecha_recepcion ? \Carbon\Carbon::parse($remito->fecha_recepcion)->format('d/m/Y H:i') : '—' }}
                </p>

                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Tipo de Bolsa / Residuo</p>
                <p style="margin: 0 0 14px 0; font-size: 15px; color: #0f172a; font-weight: 500;">
                    {{ $remito->tipoBolsa->tipo_residuo ?? '—' }}
                </p>

                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Cantidad Declarada</p>
                <p style="margin: 0 0 14px 0; font-size: 15px; color: #0f172a; font-weight: 500;">
                    {{ $remito->cantidad_declarada }} unidades
                </p>

                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Rango de Códigos</p>
                <p style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 500;">
                    {{ $remito->codigo_inicio }} al {{ $remito->codigo_fin }}
                </p>
            </td>
        </tr>
    </table>
@endsection
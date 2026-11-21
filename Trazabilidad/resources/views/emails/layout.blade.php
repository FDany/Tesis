<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Remito de Recepción - Sistema de Trazabilidad')</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; width: 100% !important;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 36px 12px;">
        <tr>
            <td align="center">
                <!-- Contenedor principal de la tarjeta -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                    
                    <!-- Encabezado institucional -->
                    <tr>
                        <td style="background-color: #1e3a8a; padding: 26px 30px; text-align: center;">
                            <h2 style="margin: 0 0 4px 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.3px;">
                                Sistema de Trazabilidad San Bernardo
                            </h2>
                            <p style="margin: 0; color: #bfdbfe; font-size: 13px; font-weight: 400;">
                                Notificación de Remito de Recepción
                            </p>
                        </td>
                    </tr>

                    <!-- Cuerpo del correo (contenido específico) -->
                    <tr>
                        <td style="padding: 30px; color: #334155; font-size: 15px; line-height: 1.6;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Pie de página -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; line-height: 1.4;">
                                Este es un correo automático generado por el sistema. Por favor no responda a este mensaje.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                                &copy; {{ date('Y') }} Hospital San Bernardo. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales de Acceso</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18181b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e4e4e7; overflow: hidden;">
                    <tr>
                        <td style="background-color: #0f172a; padding: 24px 32px;">
                            <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #ffffff;">
                                Sistema de Trazabilidad de Residuos
                            </h1>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #cbd5e1;">
                                Hospital San Bernardo
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 32px;">
                            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5;">
                                Hola <strong>{{ $user->full_name }}</strong>,
                            </p>
                            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; color: #3f3f46;">
                                Se ha creado tu cuenta de usuario en el sistema. A continuación encontrarás tus credenciales iniciales para iniciar sesión:
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">
                                            <strong>DNI:</strong>
                                            <span style="color: #0f172a;">{{ $user->dni }}</span>
                                        </p>
                                        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">
                                            <strong>Correo electrónico:</strong>
                                            <span style="color: #0f172a;">{{ $user->email }}</span>
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: #64748b;">
                                            <strong>Contraseña temporal:</strong>
                                            <code style="background-color: #e2e8f0; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 14px; font-weight: 600;">
                                                {{ $plainPassword }}
                                            </code>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="{{ url('/login') }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; padding: 12px 24px; border-radius: 6px;">
                                    Ingresar al sistema
                                </a>
                            </div>

                            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #71717a;">
                                Por seguridad, te recomendamos cambiar esta contraseña desde la configuración de tu perfil una vez que ingreses por primera vez.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                                Este es un correo automático generado por el sistema. Por favor, no respondas a este mensaje.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

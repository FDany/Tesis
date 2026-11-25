# Reporte de seeders – datos de prueba adicionales

Rama: `feat/seeders-datos`. Todos los seeders están en `Trazabilidad/database/seeders/`.

Verificación: `php artisan migrate:fresh --seed` corre sin errores en **MySQL 8.0** y en **SQLite** (`.env.example`). Después del seed se ejecutaron consultas de integridad y ninguna devolvió filas:

- estados de bolsa fuera del enum o con espacios;
- códigos de barra que no tienen 13 dígitos;
- `tipo_bolsa_id` / `tamanio_id` de la bolsa distintos a los de su remito de recepción;
- bolsas RECIBIDA en remitos que no están PENDIENTE_CONTROL, y bolsas en otro estado dentro de remitos PENDIENTE_CONTROL;
- `cantidad_declarada`, `cantidad_bolsas_dadas` o `cantidad_bolsas_sistema` distintos a la cantidad real de bolsas vinculadas;
- fechas fuera de orden: recepción < control < entrega a servicio < ingreso a depósito ≤ pesaje < emisión del remito de salida;
- FK incoherentes con el estado de la bolsa, o estado de la bolsa incoherente con el estado del remito de salida.

Las FK huérfanas las controla el motor: las restricciones `constrained()` están activas en MySQL y en SQLite.

Usuarios usados como responsables (de `RolesAndPermissionsSeeder`): 1 admin, 2 recepción-insumos, 3 servicios, 4 depósito-residuos.

## Archivos

| Archivo | Cambio |
|---|---|
| `TiposBolsaSeeder.php` | modificado (agrega 1 registro) |
| `RemitosRecepcionSeeder.php` | modificado (agrega 4 registros) |
| `RemitosEntregaServicioSeeder.php` | modificado (agrega 3 registros) |
| `RemitosSalidaRetiroSeeder.php` | modificado (agrega 6 registros) |
| `RecepcionDepositoSeeder.php` | modificado (agrega 2 registros, necesarios para las FK `recep_dep_id`) |
| `BolsasSeeder.php` | modificado (agrega 16 bolsas; literales de estado reemplazados por el enum) |
| `ManifiestosFinalesSeeder.php` | modificado (ya existía; agrega 2 manifiestos y 2 documentos adjuntos) |
| `IncidenciasSeeder.php` | modificado (agrega 4 registros; se corrigió el tipo de la incidencia existente) |
| `AuditoriasSeeder.php` | **nuevo** (10 registros) |
| `DatabaseSeeder.php` | registra `AuditoriasSeeder` al final, después de `BolsasSeeder` e `IncidenciasSeeder` |

Ningún registro existente se borró ni se modificó, salvo las correcciones de literales descritas abajo, que no cambian los datos. Los registros nuevos usan `firstOrCreate(['id' => N], [...])`, así que el seed es idempotente.

## Registros agregados

### TiposBolsa
| id | tipo_residuo | color | proveedor |
|---|---|---|---|
| 3 | Residuos Comunes Reciclables | `#86EFAC` (verde claro) | DGM |

### RemitosRecepcion
| id | fecha_recepcion | estado | control (usuario / fecha) | tipo / tamaño | códigos | bolsas |
|---|---|---|---|---|---|---|
| 3 | 2026-11-10 08:00 | CONCILIADO | 2 / 2026-11-10 10:00 | 1 / 1 | 3-1 … 3-9 | 16, 17, 19, 20, 21, 23, 25, 26, 28 |
| 4 | 2026-11-12 08:30 | CONCILIADO | 1 / 2026-11-12 11:00 | 2 / 2 | 4-1 … 4-5 | 18, 22, 24, 27, 29 |
| 5 | 2026-11-22 09:00 | PENDIENTE_CONTROL | – | 3 / 3 | 5-1 | 30 |
| 6 | 2026-11-23 09:30 | PENDIENTE_CONTROL | – | 1 / 2 | 6-1 | 31 |

### RemitosEntregaServicio
| id | fecha_entrega | servicio | retira | bolsas (ENTREGADA_A_SERVICIO en **negrita**) |
|---|---|---|---|---|
| 2 | 2026-11-11 08:00 | 3 Laboratorio | Carlos Méndez | **17**, 20, 21, 23, 25, 26, 28 |
| 3 | 2026-11-12 13:00 | 15 Clínica Médica | Laura Fernández | **18**, 22, 24, 27, 29 |
| 4 | 2026-11-13 08:00 | 8 Pediatría | Sofía Ramírez | **19** |

Las bolsas que hoy están en depósito o ya salieron también conservan su `remitos_serv_id`, igual que las bolsas existentes 1-7. Así se evitan casos de "ingreso a depósito sin entrega".

### RecepcionDeposito (agregado por coherencia de FK)
| id | fecha_hora | recibe | bolsas |
|---|---|---|---|
| 4 | 2026-11-13 18:00 | 4 | 23-29 |
| 5 | 2026-11-21 18:00 | 4 | 20, 21, 22 |

### RemitosSalidaRetiro
| id | número interno | emisión | estado final | DGM N° / retiro | sistema / declaradas | bolsas |
|---|---|---|---|---|---|---|
| 4 | RSI-2026-00004 | 2026-11-20 10:00 | PENDIENTE_RETIRO | – | 1 / – | 23 |
| 5 | RSI-2026-00005 | 2026-11-21 10:00 | PENDIENTE_RETIRO | – | 1 / – | 24 |
| 6 | RSI-2026-00006 | 2026-11-14 09:00 | CONCILIADO | 0001-00000003 / 11-14 15:00 | 1 / 1 | 25 |
| 7 | RSI-2026-00007 | 2026-11-14 10:00 | CON_INCIDENCIA | 0001-00000004 / 11-14 15:30 | 2 / 1 | 26, 27 |
| 8 | RSI-2026-00008 | 2026-11-14 11:00 | FINALIZADO (manifiesto 3) | 0001-00000005 / 11-14 16:00 | 1 / 1 | 28 |
| 9 | RSI-2026-00009 | 2026-11-14 12:00 | FINALIZADO (manifiesto 4) | 0001-00000006 / 11-14 16:30 | 1 / 1 | 29 |

Los remitos 8 y 9 se siembran como CONCILIADO y `ManifiestosFinalesSeeder` los pasa a FINALIZADO, igual que hace `ManifiestoFinalController::store` y que ya hacía el seeder con los remitos 2 y 3.

### Bolsas (16-31)
| id | código | estado | rem_rep | remitos_serv | recep_dep | peso (kg) | rem_sal |
|---|---|---|---|---|---|---|---|
| 16 | 0003000000001 | DISPONIBLE | 3 | – | – | – | – |
| 17 | 0003000000002 | ENTREGADA_A_SERVICIO | 3 | 2 | – | – | – |
| 18 | 0004000000001 | ENTREGADA_A_SERVICIO | 4 | 3 | – | – | – |
| 19 | 0003000000003 | ENTREGADA_A_SERVICIO | 3 | 4 | – | – | – |
| 20 | 0003000000004 | INGRESADA_AL_DEPOSITO | 3 | 2 | 5 | – | – |
| 21 | 0003000000005 | PESADA | 3 | 2 | 5 | 3.9 | – |
| 22 | 0004000000002 | PESADA | 4 | 3 | 5 | 2.1 | – |
| 23 | 0003000000006 | DESPACHADA | 3 | 2 | 4 | 4.2 | 4 |
| 24 | 0004000000003 | DESPACHADA | 4 | 3 | 4 | 1.8 | 5 |
| 25 | 0003000000007 | RETIRADA_POR_DGM | 3 | 2 | 4 | 5.0 | 6 |
| 26 | 0003000000008 | RETIRADA_POR_DGM | 3 | 2 | 4 | 3.3 | 7 |
| 27 | 0004000000004 | RETIRADA_POR_DGM | 4 | 3 | 4 | 2.4 | 7 |
| 28 | 0003000000009 | TRATADA_DISPOSICION_FINAL | 3 | 2 | 4 | 4.6 | 8 |
| 29 | 0004000000005 | TRATADA_DISPOSICION_FINAL | 4 | 3 | 4 | 2.7 | 9 |
| 30 | 0005000000001 | RECIBIDA | 5 | – | – | – | – |
| 31 | 0006000000001 | RECIBIDA | 6 | – | – | – | – |

- `tipo_bolsa_id` y `tamanio_id` se toman del remito de recepción de cada bolsa.
- Las bolsas pesadas tienen `pesa_usuario_id = 4` y `fecha_pesaje`.
- Cada código de 13 dígitos se arma con el prefijo de 4 dígitos (id del remito de recepción) más un correlativo de 9 dígitos. Es el mismo esquema que `codigo_inicio`/`codigo_fin` y no choca con los prefijos 0001/0002 existentes.
- No se usan `UTILIZADA` ni `NO_RECIBIDA`.

### ManifiestosFinales
| id | número | fecha / tratamiento | rem_sal | bolsas | peso informado | documento adjunto |
|---|---|---|---|---|---|---|
| 3 | 3 | 2026-11-16 / 2026-11-17 | 8 | 1 | 4.60 | 3 (`manifiestos/manifiesto_00000003.pdf`) |
| 4 | 4 | 2026-11-16 / 2026-11-18 | 9 | 1 | 2.70 | 4 (`manifiestos/manifiesto_00000004.pdf`) |

### Incidencias
| id | tipo (`TipoIncidencia`) | estado | vínculo | registra / cierra |
|---|---|---|---|---|
| 2 | DIFERENCIA_CONCILIACION_DGM | ABIERTA | rem_sal 7 (2 bolsas en sistema vs 1 declarada) | 4 / – |
| 3 | DIFERENCIA_PESO | RESUELTA | bolsa 22, servicio 15, tipo 2 | 4 / 1 (2026-11-22 09:30) |
| 4 | CODIGO_ILEGIBLE | ABIERTA | bolsa 19, servicio 8, tipo 1 | 3 / – |
| 5 | DOCUMENTACION_FALTANTE | RESUELTA | rem_rep 4, tipo 2 | 2 / 1 (2026-11-13 09:00) |

Las incidencias RESUELTA tienen `accion_adoptada`, `usuario_cierra` y `fecha_resolucion`.

### Auditorías (`AuditoriasSeeder`, nuevo)
El formato es el mismo que usa `AuditoriaService`: JSON con los campos que cambiaron, y `operacion` con los mismos textos que usan los controladores.

| id | bolsa | responsable | fecha_hora | operación | valor_anterior → valor_nuevo |
|---|---|---|---|---|---|
| 1 | 30 | 2 | 2026-11-22 09:00 | ALTA RECEPCION | `null` → `{"estado":"RECIBIDA","remito_recepcion_id":5}` |
| 2 | 16 | 2 | 2026-11-10 10:00 | Control recepción - Disponible | `{"estado":"RECIBIDA",…:3}` → `{"estado":"DISPONIBLE",…:3}` |
| 3 | 17 | 2 | 2026-11-11 08:00 | ENTREGA A SERVICIO | `{"estado":"DISPONIBLE","remitos_serv_id":null}` → `{"estado":"ENTREGADA_A_SERVICIO","remitos_serv_id":2}` |
| 4 | 19 | 2 | 2026-11-13 08:00 | ENTREGA A SERVICIO | … → `{"estado":"ENTREGADA_A_SERVICIO","remitos_serv_id":4}` |
| 5 | 20 | 4 | 2026-11-21 18:00 | Recepción en depósito | `{"estado":"ENTREGADA_A_SERVICIO","recep_dep_id":null}` → `{"estado":"INGRESADA_AL_DEPOSITO","recep_dep_id":5}` |
| 6 | 21 | 4 | 2026-11-21 18:30 | Pesaje en depósito | `{"estado":"INGRESADA_AL_DEPOSITO","peso":null}` → `{"estado":"PESADA","peso":3.9}` |
| 7 | 23 | 4 | 2026-11-20 10:00 | DESPACHO A RETIRO | `{"estado":"PESADA","rem_sal_id":null}` → `{"estado":"DESPACHADA","rem_sal_id":4}` |
| 8 | 25 | 4 | 2026-11-14 15:00 | RETIRO POR DGM | `{"estado":"DESPACHADA","rem_sal_id":6}` → `{"estado":"RETIRADA_POR_DGM","rem_sal_id":6}` |
| 9 | 26 | 4 | 2026-11-14 15:30 | RETIRO POR DGM | `{"estado":"DESPACHADA","rem_sal_id":7}` → `{"estado":"RETIRADA_POR_DGM","rem_sal_id":7}` |
| 10 | 28 | 4 | 2026-11-16 10:00 | Tratamiento / disposición final | `{"estado":"RETIRADA_POR_DGM"}` → `{"estado":"TRATADA_DISPOSICION_FINAL","numero_manifiesto":3}` |

Antes de este cambio no había seeder de auditorías, así que estos registros tienen ids 1-10.

## Literales corregidos

- En los seeders no había estados de bolsa con espacios (`'RETIRADA POR DGM'`) ni `UTILIZADA`.
- `BolsasSeeder`: en las bolsas existentes 6-10, los literales `'PESADA'` (6, 7) y `'DISPONIBLE'` (8, 9, 10) se reemplazaron por `EstadoBolsa::PESADA->value` y `EstadoBolsa::DISPONIBLE->value`. El valor guardado es el mismo.
- `IncidenciasSeeder`: la incidencia existente id 1 tenía `tipo_incidencia = 'DISCREPANCIA_CONCILIACION_DGM'`, que **no existe** en `App\Enums\TipoIncidencia`. Se corrigió a `TipoIncidencia::DIFERENCIA_CONCILIACION_DGM->value`, que es el valor que genera `RemitoSalidaRetiroController::conciliar`. No se cambió ningún otro dato de ese registro.

## Decisiones de coherencia

- **`rem_dep_id` → `recep_dep_id`:** la columna real en `bolsas` es `recep_dep_id` (FK a `recepciones_deposito`). Para que INGRESADA_AL_DEPOSITO / PESADA / estados posteriores tuvieran una recepción con fecha posterior a la entrega, se agregaron las recepciones de depósito 4 y 5. Las existentes (1-3) tienen fechas anteriores a los remitos nuevos.
- **Estado de la bolsa vs remito de salida:**
  - DESPACHADA va con PENDIENTE_RETIRO;
  - RETIRADA_POR_DGM va con CONCILIADO o CON_INCIDENCIA;
  - TRATADA_DISPOSICION_FINAL va con FINALIZADO y un manifiesto final.

  Es el flujo de `RemitoSalidaRetiroController` y `ManifiestoFinalController`.
- **DISPONIBLE:** la bolsa 16 queda con el `rem_rep_id` del remito CONCILIADO #3 y sin `remitos_serv_id`, `recep_dep_id` ni `rem_sal_id`. `rem_rep_id` no admite null.
- **RECIBIDA:** las bolsas 30 y 31 pertenecen a los remitos PENDIENTE_CONTROL #5 y #6, y la cantidad declarada coincide con las bolsas generadas.
- **Auditoría 1 (ALTA RECEPCION):** registra `estado = RECIBIDA`, que es el estado real con el que se crean las bolsas. Ver la observación 2.
- **Timestamps:** `db:seed` corre con los modelos desprotegidos (`Model::unguarded`), así que se respetan `id`, `created_at` y `updated_at`. Las fechas nuevas van de 2026-11-10 a 2026-11-23.

## Observaciones sobre datos existentes (no modificados)

1. Los remitos de salida existentes 2 y 3 quedan FINALIZADO, pero sus bolsas (2-5) siguen en RETIRADA_POR_DGM. El controlador las pasaría a TRATADA_DISPOSICION_FINAL. No se tocaron porque la consigna pide no modificar registros existentes.
2. `RemitoRecepcionController::store` registra en la auditoría `ALTA RECEPCION` el estado `DISPONIBLE`, mientras que la bolsa se crea como `RECIBIDA`. Es una inconsistencia del código de la app, no de los seeders.
3. `RoleAndUserSeeder` existe pero no se llama desde `DatabaseSeeder`. Se mantuvo así.

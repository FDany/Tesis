# Reporte — Control de Recepción de Bolsas

Rama: `feat/control-recepcion`

## 1. Archivos CREADOS

| Archivo | Descripción |
|---|---|
| `app/Http/Controllers/ControlRecepcionController.php` | Controller nuevo. `create()` renderiza `control-recepcion/create` con los remitos en `PENDIENTE_CONTROL` que tienen bolsas `RECIBIDA`. `verificarBolsa()` valida cada código escaneado contra el remito elegido (DECLARADA / SOBRANTE). `store()` confirma el control: bolsas escaneadas `RECIBIDA → DISPONIBLE`, faltantes `RECIBIDA → NO_RECIBIDA`, genera incidencias `PENDIENTE` por faltantes y sobrantes y pasa el remito a `CONCILIADO` guardando usuario y fecha de control. |
| `database/migrations/2026_11_24_000001_add_control_fields_to_remitos_recepcion_table.php` | Agrega a `remitos_recepcion`: `estado` (default `PENDIENTE_CONTROL`), `control_usuario_id` (FK nullable a `users`) y `fecha_control` (nullable). Usa `Schema::hasColumn` para no duplicar columnas. |
| `database/migrations/2026_11_24_000002_add_rem_rep_id_to_incidencias_table.php` | Agrega `incidencias.rem_rep_id` (nullable, FK a `remitos_recepcion`) si no existe. |
| `resources/js/pages/control-recepcion/create.tsx` | Página Inertia "Control Recepción": selector de remito, detalle del remito, escaneo con `ScannerInput` (reutilizado de `features/bolsas`), contadores (controladas / pendientes / sobrantes), lista de bolsas escaneadas y botón "Confirmar control". Solo tokens semánticos de Tailwind. |
| `resources/js/features/control-recepcion/types/controlRecepcion.ts` | Tipos TS: `RemitoPendienteControl`, `BolsaEscaneada`, `ResultadoEscaneo`, `ResultadoControl`. |
| `resources/js/features/control-recepcion/components/ResumenControlRecepcion.tsx` | Tarjeta de resumen que se muestra después de confirmar (declaradas, controladas, faltantes, sobrantes, responsable y fecha). |
| `resources/js/features/control-recepcion/index.ts` | Barrel de exportación del feature. |
| `REPORTE_CONTROL_RECEPCION.md` | Este reporte. |

## 2. Archivos MODIFICADOS (antes / después)

### 2.1 `app/Http/Controllers/RemitoRecepcionController.php` — `store()`

**Estado inicial del remito**

Antes:
```php
            $validated['recep_usuario_id'] = $request->user()->id;

            $remito = RemitoRecepcion::create($validated);
```
Después:
```php
            $validated['recep_usuario_id'] = $request->user()->id;
            // Antes: el remito no tenía estado.
            // Ahora: nace pendiente del control físico de recepción.
            $validated['estado'] = 'PENDIENTE_CONTROL';

            $remito = RemitoRecepcion::create($validated);
```
Por qué: la tabla `remitos_recepcion` no tenía columna `estado` (se agregó por migración); el remito ahora nace en `PENDIENTE_CONTROL` y pasa a `CONCILIADO` al confirmar el control.

**Estado inicial de las bolsas**

Antes:
```php
                    'estado' => EstadoBolsa::DISPONIBLE->value,
```
Después:
```php
                    // 'estado' => EstadoBolsa::DISPONIBLE->value,
                    // Las bolsas quedan RECIBIDA hasta que se escaneen en "Control Recepción".
                    'estado' => EstadoBolsa::RECIBIDA->value,
```
Por qué: las bolsas no deben quedar disponibles para entregar a servicios hasta que se controlen físicamente.

### 2.2 `app/Models/RemitoRecepcion.php`

Antes:
```php
#[Fillable([
    ...
    'tipo_bolsa_id',
    'tamanio_id'
])]
...
    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'cantidad_declarada' => 'integer',
    ];
```
Después:
```php
#[Fillable([
    ...
    'tipo_bolsa_id',
    'tamanio_id',
    'estado',
    'control_usuario_id',
    'fecha_control',
])]
...
    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'cantidad_declarada' => 'integer',
        'fecha_control' => 'datetime',
    ];

    public const ESTADO_PENDIENTE_CONTROL = 'PENDIENTE_CONTROL';
    public const ESTADO_CONCILIADO = 'CONCILIADO';

    /** Usuario que realizó el control físico de recepción. */
    public function usuarioControl(): BelongsTo
    {
        return $this->belongsTo(User::class, 'control_usuario_id');
    }

    /** Incidencias generadas durante el control de recepción. */
    public function incidencias(): HasMany
    {
        return $this->hasMany(Incidencia::class, 'rem_rep_id');
    }
```
Por qué: exponer las columnas nuevas (estado, responsable y fecha del control) y sus relaciones.

### 2.3 `app/Models/Incidencia.php`

Antes:
```php
    'bolsa_id',
    'rem_sal_id',
    'codigo_no_registrado',
```
Después:
```php
    'bolsa_id',
    'rem_sal_id',
    'rem_rep_id',
    'codigo_no_registrado',
...
    /**Remito de recepción controlado que originó la incidencia (opcional).*/
    public function remitoRecepcion(): BelongsTo
    {
        return $this->belongsTo(RemitoRecepcion::class, 'rem_rep_id');
    }
```
Por qué: vincular la incidencia con el remito de recepción controlado.

### 2.4 `app/Enums/TipoIncidencia.php`

Antes:
```php
    case DIFERENCIA_CONCILIACION_DGM = 'DIFERENCIA_CONCILIACION_DGM';
    case BOLSA_SIN_PESAJE = 'BOLSA_SIN_PESAJE';
```
Después:
```php
    case DIFERENCIA_CONCILIACION_DGM = 'DIFERENCIA_CONCILIACION_DGM';
    case BOLSA_FALTANTE_RECEPCION = 'BOLSA_FALTANTE_RECEPCION';
    case BOLSA_SOBRANTE_RECEPCION = 'BOLSA_SOBRANTE_RECEPCION';
    case BOLSA_SIN_PESAJE = 'BOLSA_SIN_PESAJE';
    // + etiquetas en label():
    // BOLSA_FALTANTE_RECEPCION => 'Bolsas declaradas en remito de recepción no recibidas'
    // BOLSA_SOBRANTE_RECEPCION => 'Bolsa recibida no declarada en remito de recepción'
```
Por qué: ningún tipo existente describía faltantes/sobrantes de un remito de recepción. No se agregaron a `tiposManuales()` porque son incidencias automáticas.

### 2.5 `routes/web.php`

Antes: no existían rutas de control de recepción.

Después:
```php
use App\Http\Controllers\ControlRecepcionController;
...
    // Control de Recepción (escaneo de bolsas RECIBIDA de un remito de recepción)
    Route::get('control-recepcion', [ControlRecepcionController::class, 'create'])
        ->name('control-recepcion.create');
    Route::post('control-recepcion', [ControlRecepcionController::class, 'store'])
        ->name('control-recepcion.store');
    Route::get('control-recepcion/verificar-bolsa', [ControlRecepcionController::class, 'verificarBolsa'])
        ->name('control-recepcion.verificar-bolsa');
```
Por qué: vista nueva, confirmación del control y verificación de cada escaneo. Están dentro del grupo `auth`/`verified`, sin permisos Spatie (según lo pedido).

### 2.6 `resources/js/components/app-sidebar.tsx`

Antes:
```tsx
    {
        title: 'Remitos de Recepción',
        href: '/remitos-recepcion',
        icon: ClipboardCheck,
        permission: 'listar remitosRecepcion',
    },
    {
        title: 'Bolsas',
```
Después:
```tsx
    {
        title: 'Remitos de Recepción',
        href: '/remitos-recepcion',
        icon: ClipboardCheck,
        permission: 'listar remitosRecepcion',
    },
    {
        title: 'Control Recepción',
        href: '/control-recepcion',
        icon: ScanBarcode,
    },
    {
        title: 'Bolsas',
```
Por qué: acceso a la vista nueva. Icono `ScanBarcode` de lucide. No tiene `permission`, así que lo ve cualquier usuario autenticado.

### 2.7 `database/seeders/RemitosRecepcionSeeder.php`

Antes:
```php
        RemitoRecepcion::firstOrCreate([
            'id' => 1,
            ...
            'cantidad_declarada' => 10,
        ]);
```
Después:
```php
        RemitoRecepcion::firstOrCreate([
            'id' => 1,
            ...
            'cantidad_declarada' => 10,
            // Sus bolsas ya fueron controladas (DISPONIBLE o estados posteriores).
            'estado' => 'CONCILIADO',
            'control_usuario_id' => 2,
            'fecha_control' => '2026-10-05 11:00:00',
        ]);

        // Remito pendiente de control: sus bolsas quedan RECIBIDA (ver BolsasSeeder).
        RemitoRecepcion::firstOrCreate([
            'id' => 2,
            'fecha_recepcion' => '2026-11-20 09:00:00',
            'recep_usuario_id' => 2,
            'codigo_inicio' => '2-1',
            'codigo_fin' => '2-5',
            'tipo_bolsa_id' => 1,
            'tamanio_id' => 1,
            'cantidad_declarada' => 5,
            'estado' => 'PENDIENTE_CONTROL',
        ]);
```
Por qué: el remito 1 tiene todas sus bolsas en `DISPONIBLE` o en estados posteriores, así que queda `CONCILIADO`. Se agrega el remito 2 para tener datos de prueba en la vista nueva.

### 2.8 `database/seeders/BolsasSeeder.php`

Antes: solo bolsas del remito 1, ninguna en `RECIBIDA`.

Después (se agrega al final):
```php
        // 4. Bolsas RECIBIDAS (Remito de recepción #2 pendiente de control)
        for ($i = 1; $i <= 5; $i++) {
            Bolsa::firstOrCreate([
                'id' => 10 + $i,
                'codigo_barra' => '0002' . str_pad((string) $i, 9, '0', STR_PAD_LEFT),
                'tipo_bolsa_id' => 1,
                'tamanio_id' => 1,
                'estado' => EstadoBolsa::RECIBIDA->value,
                'peso' => null,
                'rem_rep_id' => 2,
                ...
            ]);
        }
```
Por qué: las bolsas de un remito que todavía no se controló deben estar en `RECIBIDA`. Códigos `0002000000001` a `0002000000005`.

### 2.9 `app/Http/Controllers/RemitoEntregaServicioController.php` — revisado, SIN cambios

La validación actual ya compara contra el enum sin `->value` y solo acepta bolsas `DISPONIBLE`:
```php
                ->filter(fn (Bolsa $bolsa) =>
                    $bolsa->estado !== EstadoBolsa::DISPONIBLE
                    || $bolsa->remitos_serv_id !== null
                )
```
`BolsaScannerService::buscarParaEntrega()`, que valida cada escaneo de la entrega, hace lo mismo. Como las bolsas nuevas nacen `RECIBIDA`, no se pueden entregar a un servicio hasta que se controlan.

## 3. Flujo resultante

1. **Crear remito de recepción** (`/remitos-recepcion`) → el remito nace `PENDIENTE_CONTROL` y sus bolsas `RECIBIDA`.
2. **Control Recepción** (`/control-recepcion`) → el usuario elige un remito `PENDIENTE_CONTROL` con bolsas `RECIBIDA` y escanea las bolsas una por una con `ScannerInput`. Cada código se verifica en el servidor:
   - **DECLARADA**: la bolsa pertenece al remito y está `RECIBIDA`.
   - **SOBRANTE**: el código no pertenece al remito (es de otro remito o no está registrado).
   - Error: la bolsa es del remito pero ya no está `RECIBIDA`, o el remito ya se controló.
3. **Confirmar control** (POST `/control-recepcion`, en una sola transacción):
   - Bolsas escaneadas y declaradas: `RECIBIDA → DISPONIBLE`.
   - **Faltantes** (declaradas y no escaneadas): `RECIBIDA → NO_RECIBIDA` + **1 incidencia** `BOLSA_FALTANTE_RECEPCION` con la lista de códigos.
   - **Sobrantes**: **1 incidencia por código** `BOLSA_SOBRANTE_RECEPCION`, con `bolsa_id` si la bolsa existe o `codigo_no_registrado` si no existe. El estado de esas bolsas no cambia.
   - Todas las incidencias quedan con `estado = 'PENDIENTE'`, `usuario_registra = usuario autenticado` y `rem_rep_id = remito`.
4. **Remito `CONCILIADO`**, con `control_usuario_id` (responsable) y `fecha_control`. Después del control se muestra un resumen con declaradas, controladas, faltantes y sobrantes.
5. Las bolsas `DISPONIBLE` ya se pueden entregar a un servicio (`RemitoEntregaServicioController`).

## 4. Observaciones

- El módulo Incidencias no se modificó (no tocar otros módulos). Hoy muestra `tipo_incidencia` como texto, así que los tipos nuevos se ven tal cual. `IncidenciaBadge` y `ResolverIncidenciaModal` no tienen un caso para `'PENDIENTE'` (sí para `'ABIERTA'`): conviene revisarlo si las incidencias pendientes se van a resolver desde ahí.
- No se agregaron permisos ni roles.

## 5. Verificación

- `php artisan migrate:fresh --seed`: sin errores.
- `npm run build`: sin errores.
- Prueba manual del flujo con requests HTTP autenticadas sobre el remito 2: 3 bolsas declaradas escaneadas + 1 de otro remito + 1 código inexistente → 3 bolsas `DISPONIBLE`, 2 `NO_RECIBIDA`, 1 incidencia de faltantes, 2 de sobrantes, remito `CONCILIADO` con el usuario de control.
- `php artisan test`: los mismos 6 fallos que antes de estos cambios (Admin/Dashboard/EmailVerification), no relacionados con esta tarea.

---

## Corrección: estado visible en tabla y acceso directo al control

Problema: la columna `estado` de `remitos_recepcion` (agregada en `f654e80`) no se mostraba en la tabla de remitos de recepción, y no había forma de ir desde un remito pendiente a su control.

### Punto 1 — `app/Models/RemitoRecepcion.php` (sin cambios nuevos)

Ya se había resuelto en `f654e80`: `#[Fillable]` incluye `'estado'`, `'control_usuario_id'` y `'fecha_control'`, y `$casts` incluye `'fecha_control' => 'datetime'`. Se verificó y no hizo falta modificarlo.

El `index` de `RemitoRecepcionController` usa `RemitoRecepcion::with(...)` sin `select()` explícito, así que `estado` ya llegaba al frontend (verificado: remito 1 `CONCILIADO`, remito 2 `PENDIENTE_CONTROL`).

### Archivos creados

| Archivo | Descripción |
|---|---|
| `resources/js/features/remitos-recepcion/components/EstadoRemitoRecepcionBadge.tsx` | Badge reutilizable (tabla y modal de detalle) que muestra `PENDIENTE_CONTROL` como "Pendiente de control" (variant `secondary`) y `CONCILIADO` como "Conciliado" (variant `default`). Usa el `Badge` existente, cuyas variantes usan tokens semánticos (tema claro/oscuro). |

### Archivos modificados

#### `resources/js/features/remitos-recepcion/types/remitoRecepcion.ts`

Por qué: el tipo del frontend no tenía los campos de control.

Antes:
```ts
  tamanio_id: number;
  created_at?: string;
```

Después:
```ts
  tamanio_id: number;
  estado: string;
  control_usuario_id?: number | null;
  fecha_control?: string | null;
  created_at?: string;
```

#### `resources/js/features/remitos-recepcion/components/RemitoRecepcionTable.tsx`

Por qué: mostrar el estado del remito y agregar un acceso directo al control para los remitos pendientes.

Antes (imports):
```tsx
import { Eye } from 'lucide-react';
...
import { useAuth } from '@/hooks/use-auth'
```

Después:
```tsx
import { Link } from '@inertiajs/react';
import { Eye, ScanLine } from 'lucide-react';
...
import { useAuth } from '@/hooks/use-auth'
import { EstadoRemitoRecepcionBadge } from './EstadoRemitoRecepcionBadge';
```

Antes (encabezado):
```tsx
<TableHead>Tamaño</TableHead>
<TableHead className="text-right">Ver</TableHead>
```

Después (el encabezado anterior queda comentado; la columna ahora tiene más de una acción):
```tsx
<TableHead>Tamaño</TableHead>
<TableHead>Estado</TableHead>
{/* <TableHead className="text-right">Ver</TableHead> */}
<TableHead className="text-right">Acciones</TableHead>
```

Antes (fila vacía):
```tsx
colSpan={7}
```

Después (hay una columna más):
```tsx
colSpan={8}
```

Antes (celda de acciones):
```tsx
<TableCell className="text-right">
  {(can('verDetalle remitosRecepcion'))&&(
    <Button type="button" variant="ghost" size="icon"
      aria-label={`Ver detalle del remito ${remito.id}`}
      onClick={() => onVer(remito.id)}>
      <Eye className="h-4 w-4" />
    </Button>)}
</TableCell>
```

Después (celda de estado nueva y botón de control solo para `PENDIENTE_CONTROL`; no aparece para `CONCILIADO`):
```tsx
<TableCell>
  <EstadoRemitoRecepcionBadge estado={remito.estado} />
</TableCell>

<TableCell className="text-right">
  {remito.estado === 'PENDIENTE_CONTROL' && (
    <Button asChild variant="ghost" size="icon"
      aria-label={`Controlar recepción del remito ${remito.id}`}
      title="Controlar recepción">
      <Link href="/control-recepcion" data={{ remito_id: remito.id }}>
        <ScanLine className="h-4 w-4" />
      </Link>
    </Button>
  )}
  {(can('verDetalle remitosRecepcion'))&&(
    <Button type="button" variant="ghost" size="icon"
      aria-label={`Ver detalle del remito ${remito.id}`}
      onClick={() => onVer(remito.id)}>
      <Eye className="h-4 w-4" />
    </Button>)}
</TableCell>
```

#### `app/Http/Controllers/ControlRecepcionController.php`

Por qué: la vista de control acepta `?remito_id=X` para preseleccionar el remito. El backend solo lo acepta si ese remito está en la lista de pendientes; si no, envía `null` (por ejemplo, para un remito ya conciliado o un valor inválido).

Antes:
```php
return Inertia::render('control-recepcion/create', [
    'remitos' => $remitos,
```

Después:
```php
$remitoIdSolicitado = (int) $request->query('remito_id', 0);
$remitoSeleccionadoId = $remitos->contains('id', $remitoIdSolicitado)
    ? $remitoIdSolicitado
    : null;

return Inertia::render('control-recepcion/create', [
    'remitos' => $remitos,
    'remitoSeleccionadoId' => $remitoSeleccionadoId,
```

#### `resources/js/pages/control-recepcion/create.tsx`

Por qué: la página toma el remito preseleccionado como valor inicial del formulario al montarse. Después de confirmar se limpia con `setData`, porque `reset()` volvería al remito inicial, que ya quedó conciliado.

Antes:
```tsx
    remitos: RemitoPendienteControl[];
    resultadoControl: ResultadoControl | null;
}
...
    remitos,
    resultadoControl,
}: Props) {
    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            remito_id: '',
...
            onSuccess: (page) => {
                reset();
```

Después:
```tsx
    remitos: RemitoPendienteControl[];
    remitoSeleccionadoId: number | null;
    resultadoControl: ResultadoControl | null;
}
...
    remitos,
    remitoSeleccionadoId,
    resultadoControl,
}: Props) {
    // Preselección desde /control-recepcion?remito_id=X (validada en el backend).
    const { data, setData, post, processing, errors, transform } =
        useForm({
            remito_id: remitoSeleccionadoId ? String(remitoSeleccionadoId) : '',
...
            onSuccess: (page) => {
                // reset();
                setData({ remito_id: '', codigos: [] });
```

#### `app/Http/Controllers/RemitoRecepcionController.php` (`show`)

Por qué: el modal de detalle recibe un arreglo armado a mano, así que hay que agregarle el estado y los datos del control.

Antes:
```php
            'usuarioRecep',
        ])->findOrFail($id);
...
                'bolsas' => $codigos,
            ],
```

Después:
```php
            'usuarioRecep',
            'usuarioControl',
        ])->findOrFail($id);
...
                'bolsas' => $codigos,
                'estado' => $remito->estado,
                'usuario_control' => $remito->usuarioControl?->full_name,
                'fecha_control' => $remito->fecha_control?->format('d/m/Y H:i'),
            ],
```

#### `resources/js/features/remitos-recepcion/components/RemitoRecepcionDetalleModal.tsx` (opcional, punto 5)

Por qué: el modal ya muestra los datos en una grilla de pares etiqueta/valor, así que el estado y el responsable del control encajan como dos celdas más.

Antes (tipo):
```tsx
    bolsas: string[];
};
```

Después:
```tsx
    bolsas: string[];
    estado: string;
    usuario_control: string | null;
    fecha_control: string | null;
};
```

Antes (grilla):
```tsx
<div className="col-span-2">
    <p className="text-muted-foreground">Observaciones</p>
```

Después:
```tsx
<div>
    <p className="text-muted-foreground">Estado</p>
    <EstadoRemitoRecepcionBadge estado={detalle.estado} />
</div>

<div>
    <p className="text-muted-foreground">Controlado por</p>
    <p>
        {detalle.usuario_control
            ? `${detalle.usuario_control} (${detalle.fecha_control})`
            : '-'}
    </p>
</div>

<div className="col-span-2">
    <p className="text-muted-foreground">Observaciones</p>
```

#### `resources/js/features/remitos-recepcion/index.ts`

Por qué: exportar el badge nuevo desde el barrel de la feature.

Después (línea agregada):
```ts
export * from './components/EstadoRemitoRecepcionBadge';
```

### Flujo resultante

Tabla de remitos de recepción → badge "Pendiente de control" → botón de control (ícono `ScanLine`) → `/control-recepcion?remito_id=X` con el remito preseleccionado → escaneo y confirmación → remito `CONCILIADO` → la tabla muestra "Conciliado" y ya no aparece el botón de control.

### Verificación

- `npm run build`: sin errores.
- Requests HTTP con datos del seeder: `/control-recepcion?remito_id=2` preselecciona el 2; `?remito_id=1` (conciliado) y `?remito_id=abc` devuelven `null`; `/remitos-recepcion` envía `estado` en cada remito; el detalle del remito 1 devuelve `estado`, `usuario_control` y `fecha_control`.

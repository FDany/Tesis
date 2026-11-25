<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use App\Models\DocumentoAdjunto;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable([
    'fecha_recepcion',
    'recep_usuario_id',
    'observaciones',
    'codigo_inicio',
    'codigo_fin',
    'cantidad_declarada',
    'tipo_bolsa_id',
    'tamanio_id',
    'estado',
    'control_usuario_id',
    'fecha_control',
])]
class RemitoRecepcion extends Model
{
    use HasFactory;

    protected $table = 'remitos_recepcion';

    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'cantidad_declarada' => 'integer',
        'fecha_control' => 'datetime',
    ];

    public const ESTADO_PENDIENTE_CONTROL = 'PENDIENTE_CONTROL';
    public const ESTADO_CONCILIADO = 'CONCILIADO';

    /** Relaciones Eloquent */

    /** Usuario que registra el remito de recepción. */
    public function usuarioRecep(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recep_usuario_id');
    }

    /** Tipo de bolsa (corriente/flujo) asociado al lote del remito. */
    public function tipoBolsa(): BelongsTo
    {
        return $this->belongsTo(TipoBolsa::class, 'tipo_bolsa_id');
    }

    /** Tamaño de la bolsa ingresado en este remito. */
    public function tamanio(): BelongsTo
    {
        return $this->belongsTo(Tamanio::class, 'tamanio_id');
    }

    /** Bolsas generadas/asociadas a este remito de recepción. */
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'rem_rep_id');
    }

    public function documentosAdjuntos(): MorphMany
    {
        return $this->morphMany(DocumentoAdjunto::class, 'documentable');
    }

    public function usuarioControl(): BelongsTo
    {
        return $this->belongsTo(User::class, 'control_usuario_id');
    }

    /** Incidencias generadas durante el control de recepción. */
    public function incidencias(): HasMany
    {
        return $this->hasMany(Incidencia::class, 'rem_rep_id');
    }
}

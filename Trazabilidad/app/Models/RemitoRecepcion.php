<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'fecha_recepcion',
    'recep_usuario_id',
    'observaciones',
    'codigo_inicio',
    'codigo_fin',
    'cantidad_declarada',
    'tipo_bolsa_id',
    'tamanio'
])]
class RemitoRecepcion extends Model
{
    use HasFactory;

    protected $table = 'remitos_recepcion';

    protected $casts = [
        'fecha_recepcion' => 'datetime',
        'cantidad_declarada' => 'integer',
    ];

    /**Relaciones eloquent*/

    /**Usuario que registra el remito de recepción.*/
    public function usuarioRecep(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recep_usuario_id');
    }

    /**Tipo de bolsa asociado al lote del remito.*/
    public function tipoBolsa(): BelongsTo
    {
        return $this->belongsTo(TipoBolsa::class, 'tipo_bolsa_id');
    }

    /**Bolsas generadas/asociadas a este remito de recepción.*/
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'rem_rep_id');
    }
}

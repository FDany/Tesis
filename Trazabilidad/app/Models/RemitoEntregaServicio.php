<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'entrega_usuario_id',
    'retira_nombre',
    'entregado_cargo',
    'fecha_entrega',
    'servicio_id',
    'cantidad_bolsas_dadas',
])]
class RemitoEntregaServicio extends Model
{
    use HasFactory;

    protected $table = 'remitos_entrega_servicios';

    protected $casts = [
        'fecha_entrega' => 'datetime',
        'cantidad_bolsas_dadas' => 'integer',
    ];

    /**Relaciones eloquent*/

    /**Usuario de la institución que realiza la entrega.*/
    public function usuarioEntrega(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entrega_usuario_id');
    }

    /**Servicio/Sector que recibe los insumos/bolsas.*/
    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }

    /**Bolsas asociadas a este remito de entrega.*/
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'remito_entrega_servicio_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'codigo_barra',
    'tipo_bolsa_id',
    'estado',
    'peso',
    'remitos_serv_id',
    'rem_rep_id',
    'recep_dep_id',
    'rem_sal_id',
])]
class Bolsa extends Model
{
    use HasFactory;

    protected $table = 'bolsas';

    protected $casts = [
        'peso' => 'float',
    ];

    /**Relaciones eloquent*/

    /**Tipo de bolsa (color, tamaño, categoría de residuo).*/
    public function tipoBolsa(): BelongsTo
    {
        return $this->belongsTo(TipoBolsa::class, 'tipo_bolsa_id');
    }

    /**Remito de entrega de insumos al servicio/sector.*/
    public function remitoEntregaServicio(): BelongsTo
    {
        return $this->belongsTo(RemitoEntregaServicio::class, 'remitos_serv_id');
    }

    /**Remito de recepción del lote.*/
    public function remitoRecepcion(): BelongsTo
    {
        return $this->belongsTo(RemitoRecepcion::class, 'rem_rep_id');
    }

    /**Registro de recepción física en depósito central.*/
    public function recepcionDeposito(): BelongsTo
    {
        return $this->belongsTo(RecepcionDeposito::class, 'recep_dep_id');
    }

    /**Remito de salida/despacho externo (DGM).*/
    public function remitoSalidaRetiro(): BelongsTo
    {
        return $this->belongsTo(RemitoSalidaRetiro::class, 'rem_sal_id');
    }

    /**Historial de auditorías registradas para esta bolsa.*/
    public function auditorias(): HasMany
    {
        return $this->hasMany(Auditoria::class, 'bolsa_id');
    }

    /**Incidencias registradas sobre esta bolsa.*/
    public function incidencias(): HasMany
    {
        return $this->hasMany(Incidencia::class, 'bolsa_id');
    }
}

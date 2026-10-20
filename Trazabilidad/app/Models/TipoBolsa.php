<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['tipo_residuo', 'color', 'proveedor'])]
class TipoBolsa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tipos_bolsa';

    /** Relaciones Eloquent */

    /** Un tipo de bolsa (corriente) tiene muchas bolsas registradas en el sistema. */
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'tipo_bolsa_id');
    }

    /** Un tipo de bolsa puede estar asociado a varios remitos de recepción. */
    public function remitosRecepcion(): HasMany
    {
        return $this->hasMany(RemitoRecepcion::class, 'tipo_bolsa_id');
    }

    /** Un tipo de bolsa puede tener incidencias registradas. */
    public function incidencias(): HasMany
    {
        return $this->hasMany(Incidencia::class, 'tipo_bolsa_id');
    }
}

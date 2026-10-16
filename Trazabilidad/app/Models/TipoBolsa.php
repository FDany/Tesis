<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['tipo_residuo', 'color', 'proveedor'])]
class TipoBolsa extends Model
{
    use HasFactory;

    protected $table = 'tipos_bolsa';

    /**Relaciones eloquent*/

    /**Un tipo de bolsa tiene muchas bolsas registradas en el sistema.*/
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'tipo_bolsa_id');
    }

    /**Un tipo de bolsa puede estar asociado a varios remitos de recepción.*/
    public function remitosRecepcion(): HasMany
    {
        return $this->hasMany(RemitoRecepcion::class, 'tipo_bolsa_id');
    }

    /**Un tipo de bolsa puede tener incidencias registradas.*/
    public function incidencias(): HasMany
    {
        return $this->hasMany(Incidencia::class, 'tipo_bolsa_id');
    }
}

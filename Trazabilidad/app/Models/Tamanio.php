<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['nombre'])]
class Tamanio extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tamanios';

    /** Un tamaño pertenece a muchos remitos de recepción. */
    public function remitosRecepcion(): HasMany
    {
        return $this->hasMany(RemitoRecepcion::class, 'tamanio_id');
    }

    /** Un tamaño pertenece a muchas bolsas registradas. */
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'tamanio_id');
    }
}

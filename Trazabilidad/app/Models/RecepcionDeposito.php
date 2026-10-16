<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['fecha_hora','recibe_usuario_id',])]
class RecepcionDeposito extends Model
{
    use HasFactory;

    protected $table = 'recepciones_deposito';

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    /**Relaciones eloquent*/

    /**Usuario que recibe las bolsas en el depósito.*/
    public function usuarioRecibe(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recibe_usuario_id');
    }

    /**Bolsas recibidas en este evento de depósito.*/
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'recep_dep_id');
    }
}

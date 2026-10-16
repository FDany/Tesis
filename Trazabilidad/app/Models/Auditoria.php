<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'responsable_usuario_id',
    'fecha_hora',
    'operacion',
    'bolsa_id',
    'valor_anterior',
    'valor_nuevo',
])]
class Auditoria extends Model
{
    use HasFactory;

    protected $table = 'auditorias';

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    /**Relaciones eloquent*/

    /**Usuario responsable que ejecutó la operación de auditoría.*/
    public function responsable(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsable_usuario_id');
    }

    /**Bolsa asociada a este evento de auditoría.*/
    public function bolsa(): BelongsTo
    {
        return $this->belongsTo(Bolsa::class, 'bolsa_id');
    }
}

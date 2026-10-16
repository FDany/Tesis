<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'fecha_hora',
    'usuario_registra',
    'bolsa_id',
    'codigo_no_registrado',
    'tipo_bolsa_id',
    'servicio_id',
    'tipo_incidencia',
    'decripcion',
    'acccion_adoptada',
    'usuario_cierra',
    'fecha_resolucion',
    'estado',
])]
class Incidencia extends Model
{
    use HasFactory;

    protected $table = 'incidencias';

    protected $casts = [
        'fecha_hora' => 'datetime',
        'fecha_resolucion' => 'datetime',
        'codigo_no_registrado' => 'integer',
    ];

    /**Relaciones eloquent*/

    /**Usuario que registra la incidencia.*/
    public function usuarioRegistra(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_registra');
    }

    /**Usuario que resuelve y cierra la incidencia.*/
    public function usuarioCierra(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_cierra');
    }

    /**Bolsa asociada a la incidencia (opcional).*/
    public function bolsa(): BelongsTo
    {
        return $this->belongsTo(Bolsa::class, 'bolsa_id');
    }

    /**Tipo de bolsa asociado a la incidencia (opcional).*/
    public function tipoBolsa(): BelongsTo
    {
        return $this->belongsTo(TipoBolsa::class, 'tipo_bolsa_id');
    }

    /**Servicio/Sector asociado a la incidencia (opcional).*/
    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }

    /**Evidencias o fotografías adjuntas a esta incidencia (Polimórfico).*/
    public function documentos(): MorphMany
    {
        return $this->morphMany(DocumentoAdjunto::class, 'documentable');
    }
}

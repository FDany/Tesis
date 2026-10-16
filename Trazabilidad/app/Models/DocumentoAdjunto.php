<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'tipo_documento',
    'nombre_archivo',
    'url_archivo',
    'fecha_hora',
    'documentable_type',
    'documentable_id',
])]
class DocumentoAdjunto extends Model
{
    use HasFactory;

    protected $table = 'documentos_adjuntos';

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    /**Relaciones eloquent*/

    /**Obtiene el modelo padre polimórfico (Incidencia, RemitoSalidaRetiro, etc.).*/
    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }

    /**Manifiestos finales que referencian directamente este documento como certificado oficial.*/
    public function manifiestosFinales(): HasMany
    {
        return $this->hasMany(ManifiestoFinal::class, 'documento_digital');
    }
}

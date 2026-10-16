<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'numero_manifiesto',
    'fecha',
    'fecha_tratamiento',
    'rem_sal_id',
    'cantidad_bolsas',
    'peso_informado',
    'documento_digital',
    'observaciones',
])]
class ManifiestoFinal extends Model
{
    use HasFactory;

    protected $table = 'manifiestos_finales';

    protected $casts = [
        'fecha' => 'date',
        'fecha_tratamiento' => 'date',
        'peso_informado' => 'float',
        'numero_manifiesto' => 'integer',
    ];

    /**Relaciones eloquent*/

    /**Remito de salida/retiro asociado a este manifiesto final.*/
    public function remitoSalidaRetiro(): BelongsTo
    {
        return $this->belongsTo(RemitoSalidaRetiro::class, 'rem_sal_id');
    }

    /**Documento digital / certificado oficial asignado directamente a este manifiesto.*/
    public function documentoOficial(): BelongsTo
    {
        return $this->belongsTo(DocumentoAdjunto::class, 'documento_digital', 'id');
    }

    /**Documentos adjuntos o anexos adicionales cargados de forma polimórfica.*/
    public function documentos(): MorphMany
    {
        return $this->morphMany(DocumentoAdjunto::class, 'documentable');
    }
}

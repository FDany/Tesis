<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'numero_remito',
    'fecha_retiro',
    'cantidad_bolsas_declaradas_Empresa',
    'responsable_empresa',
    'usuario_despacha',
    'datos_transporte',
    'observaciones',
])]
class RemitoSalidaRetiro extends Model
{
    use HasFactory;

    protected $table = 'remitos_salida_retiro';

    protected $casts = [
        'cantidad_bolsas_declaradas_Empresa' => 'integer',
    ];

    /**Relaciones eloquent*/

    /**Usuario institucional que autoriza y despacha la salida del camión.*/
    public function usuarioDespacha(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_despacha');
    }

    /**Bolsas incluidas en esta salida/retiro.*/
    public function bolsas(): HasMany
    {
        return $this->hasMany(Bolsa::class, 'rem_sal_id');
    }

    /**Manifiestos de tratamiento final vinculados a esta salida.*/
    public function manifiestosFinales(): HasMany
    {
        return $this->hasMany(ManifiestoFinal::class, 'rem_sal_id');
    }

    /**Documentos o fotos adjuntas vinculadas a este remito de salida (Polimórfico).*/
    public function documentos(): MorphMany
    {
        return $this->morphMany(DocumentoAdjunto::class, 'documentable');
    }
}

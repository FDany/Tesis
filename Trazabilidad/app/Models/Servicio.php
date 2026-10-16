<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre', 'activo'])]
class Servicio extends Model
{
    use HasFactory;

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function remitosEntrega(): HasMany
    {
        return $this->hasMany(RemitoEntregaServicio::class, 'servicio_id');
    }

    public function incidencias(): HasMany
    {
        return $this->hasMany(Incidencia::class, 'servicio_id');
    }

}

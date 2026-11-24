<?php

namespace App\Policies;

use App\Models\ManifiestoFinal;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ManifiestoFinalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('listar manifiestosFinales');
    }

    public function view(User $user, ManifiestoFinal $manifiesto): bool
    {
        return $user->can('verDetalle manifiestosFinales');
    }

    public function create(User $user): bool
    {
        return $user->can('crear manifiestosFinales');
    }

    public function descargarDocumento(User $user, ManifiestoFinal $manifiesto): bool
    {
        return $user->can('descargarDocumento manifiestosFinales');
    }
}

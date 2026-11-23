<?php

namespace App\Policies;

use App\Models\Incidencia;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IncidenciaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('listar incidencias');
    }

    public function view(User $user, Incidencia $incidencia): bool
    {
        return $user->can('verDetalle incidencias');
    }

    public function create(User $user): bool
    {
        return $user->can('crear incidencias');
    }

    public function resolver(User $user, Incidencia $incidencia): Response
    {
        if (! $user->can('resolver incidencias')) {
            return Response::deny('No tienes permiso para gestionar o resolver incidencias.');
        }

        if ($incidencia->estado === 'CERRADA') {
            return Response::deny("La incidencia #{$incidencia->id} ya se encuentra CERRADA y no admite modificaciones.");
        }

        return Response::allow();
    }
}

<?php

namespace App\Policies;

use App\Models\RemitoRecepcion;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RemitoRecepcionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('listar remitosRecepcion');
    }

    public function view(User $user, RemitoRecepcion $remito): bool
    {
        return $user->can('verDetalle remitosRecepcion');
    }

    public function create(User $user): bool
    {
        return $user->can('crear remitosRecepcion');
    }

    public function update(User $user, RemitoRecepcion $remito): Response
    {
        if (! $user->can('editar remitosRecepcion')) {
            return Response::deny('No tienes permiso para editar remitos de recepción.');
        }

        $tieneBolsasEnUso = $remito->bolsas()
            ->where('estado', '!=', 'DISPONIBLE')
            ->exists();

        if ($tieneBolsasEnUso) {
            return Response::deny('No se puede editar un remito de recepción cuyas bolsas ya entraron en circulación.');
        }

        return Response::allow();
    }

    public function delete(User $user, RemitoRecepcion $remito): Response
    {
        if (! $user->can('eliminar remitosRecepcion')) {
            return Response::deny('No tienes permiso para eliminar remitos de recepción.');
        }

        $tieneBolsasEnUso = $remito->bolsas()
            ->where('estado', '!=', 'DISPONIBLE')
            ->exists();

        if ($tieneBolsasEnUso) {
            return Response::deny('No se puede eliminar un remito de recepción cuyas bolsas ya fueron entregadas o procesadas.');
        }

        return Response::allow();
    }
}

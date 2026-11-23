<?php

namespace App\Policies;

use App\Models\Bolsa;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BolsaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('listar bolsas');
    }

    public function view(User $user, Bolsa $bolsa): bool
    {
        return $user->can('verDetalle bolsas');
    }

    public function create(User $user): bool
    {
        return $user->can('crear bolsas');
    }

    public function update(User $user, Bolsa $bolsa): Response
    {
        if (! $user->can('editar bolsas')) {
            return Response::deny('No tienes permiso para editar bolsas.');
        }

        if ($bolsa->estado !== 'DISPONIBLE' || $bolsa->remitos_serv_id !== null) {
            return Response::deny('No se puede modificar una bolsa que ya entró en circulación.');
        }

        return Response::allow();
    }

    public function delete(User $user, Bolsa $bolsa): Response
    {
        if (! $user->can('eliminar bolsas')) {
            return Response::deny('No tienes permiso para eliminar bolsas.');
        }

        if ($bolsa->estado !== 'DISPONIBLE' || $bolsa->remitos_serv_id !== null) {
            return Response::deny('No se puede eliminar una bolsa que ya fue entregada a un servicio o procesada en depósito.');
        }

        return Response::allow();
    }
}

<?php

namespace App\Policies;

use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RolePolicy
{
    private const ROLES_PROTEGIDOS = [
        'admin',
        'recepcion-insumos',
        'servicios',
        'deposito-residuos',
        'area-ambiental',
        'administracion',
    ];

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $authUser): bool
    {
        return $authUser->can('listar roles');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $authUser): bool
    {
        return $authUser->can('crear roles');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $authUser, Role $role): bool
    {
        return $authUser->can('editar roles');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $authUser, Role $role): Response|bool
    {
        if (! $authUser->can('eliminar roles')) {
            return false;
        }

        if (in_array($role->name, self::ROLES_PROTEGIDOS, true)) {
            return Response::deny("El rol '{$role->name}' es un perfil estructural del sistema y no puede eliminarse.");
        }

        if ($role->users()->exists()) {
            return Response::deny('No se puede eliminar un rol que tiene usuarios asignados.');
        }

        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Role $role): bool
    {
        return false;
    }
}

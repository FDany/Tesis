<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $authUser): bool
    {
        return $authUser->can('listar usuarios');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $authUser): bool
    {
        return $authUser->can('crear usuarios');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $authUser, User $targetUser): Response|bool
    {
        if (! $authUser->can('editar usuarios')) {
            return false;
        }

        if ($targetUser->hasRole('admin') && ! $authUser->hasRole('admin')) {
            return Response::deny('Solo un administrador puede modificar a otro administrador.');
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $authUser, User $targetUser): Response|bool
    {
        if (! $authUser->can('eliminar usuarios')) {
            return false;
        }

        if ($authUser->is($targetUser)) {
            return Response::deny('No puedes eliminar tu propia cuenta.');
        }

        if ($targetUser->hasRole('admin') && ! $authUser->hasRole('admin')) {
            return Response::deny('Solo un administrador puede eliminar a otro administrador.');
        }

        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}

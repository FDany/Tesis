<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('roles/index', [
            'roles' => Role::query()
                ->withCount('users')
                ->orderBy('name')
                ->get(['id', 'name', 'guard_name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->where('guard_name', 'web')],
        ]);

        Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return to_route('roles.index')->with('success', 'Rol creado.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        abort_unless($role->guard_name === 'web', 404);
        abort_if($role->name === 'admin', 403, 'No se puede cambiar el rol administrador.');

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->where('guard_name', 'web')->ignore($role->id),
            ],
        ]);

        $role->update($validated);

        return to_route('roles.index')->with('success', 'Rol actualizado.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        abort_unless($role->guard_name === 'web', 404);

        if ($role->name === 'admin') {
            return to_route('roles.index')->with('error', 'No se puede eliminar el rol administrador.');
        }

        if ($role->users()->exists()) {
            return to_route('roles.index')->with('error', 'No se puede eliminar un rol asignado a usuarios.');
        }

        $role->delete();

        return to_route('roles.index')->with('success', 'Rol eliminado.');
    }
}

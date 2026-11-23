<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    #[Middleware('permission:listar permisos')]
    public function index(): Response
    {
        return Inertia::render('permisos/index', [
            'permissions' => Permission::query()
                ->get(['id', 'name', 'guard_name', 'created_at']),
        ]);
    }

    #[Middleware('permission:crear permisos')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions', 'name')->where('guard_name', 'web')],
            'guard_name' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['guard_name'] = $validated['guard_name'] ?? 'web';

        Permission::create($validated);
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('permisos.index')->with('success', 'Permiso creado correctamente.');
    }

    #[Middleware('permission:editar permisos')]
    public function update(Request $request, Permission $permiso): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')
                    ->where('guard_name', $permiso->guard_name)
                    ->ignore($permiso->id),
            ],
        ]);

        $permiso->update($validated);
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('permisos.index')->with('success', 'Permiso actualizado correctamente.');
    }

    #[Middleware('permission:eliminar permisos')]
    public function destroy(Permission $permiso): RedirectResponse
    {
        if ($permiso->roles()->exists()) {
            return redirect()->route('permisos.index')
                ->with('error', 'No se puede eliminar un permiso que está asignado a uno o más roles.');
        }

        $permiso->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('permisos.index')->with('success', 'Permiso eliminado correctamente.');
    }
}

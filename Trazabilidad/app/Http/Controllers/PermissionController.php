<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('permisos/index', [
            'permissions' => Permission::get([
                'id',
                'name',
                'guard_name',
                'created_at'
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'nullable|string|max:255'
        ]);
        // Por defecto usamos el guard web si no se especifica
        $validated['guard_name'] = $validated['guard_name'] ?? 'web';
        Permission::create($validated);
        return redirect()->route('permisos.index')->with('success', 'Permiso creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' .
                $permission->id,
        ]);
        $permission->update($validated);
        return redirect()->route('permisos.index')->with('success', 'Permiso
actualizado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();
        return redirect()->route('permisos.index')->with('success', 'Permiso
eliminado correctamente.');
    }
}

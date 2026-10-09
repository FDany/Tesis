<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => User::query()
                ->with('roles:id,name')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'dni' => ['required', 'string', 'max:255', 'unique:users,dni'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ]);

        $roles = $validated['roles'] ?? [];
        unset($validated['roles']);

        DB::transaction(function () use ($validated, $roles): void {
            $user = User::create($validated);
            $user->syncRoles($roles);
        });

        return to_route('users.index')->with('success', 'Usuario creado.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user->load('roles:id,name'),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'dni' => ['required', 'string', 'max:255', Rule::unique('users', 'dni')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ]);

        $roleIds = $validated['roles'] ?? [];
        unset($validated['roles']);
        if (blank($validated['password'] ?? null)) {
            unset($validated['password']);
        }

        $adminRole = Role::query()->where('guard_name', 'web')->where('name', 'admin')->first();
        if (
            $adminRole !== null
            && $user->hasRole('admin')
            && ! in_array($adminRole->id, $roleIds)
            && User::role('admin')->count() <= 1
        ) {
            throw ValidationException::withMessages([
                'roles' => 'No se puede quitar el rol del último administrador.',
            ]);
        }

        DB::transaction(function () use ($validated, $roleIds, $user): void {
            $user->update($validated);
            $user->syncRoles($roleIds);
        });

        return to_route('users.index')->with('success', 'Usuario actualizado.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            throw ValidationException::withMessages([
                'user' => 'No puedes eliminar tu propia cuenta desde esta pantalla.',
            ]);
        }

        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            throw ValidationException::withMessages([
                'user' => 'No se puede eliminar el último administrador.',
            ]);
        }

        $user->delete();

        return to_route('users.index')->with('success', 'Usuario eliminado.');
    }
}

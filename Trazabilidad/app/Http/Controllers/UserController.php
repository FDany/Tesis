<?php

namespace App\Http\Controllers;

use App\Mail\UsuarioCreadoMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Throwable;

class UserController extends Controller
{
    private const OPCIONES_POR_PAGINA = [5, 10, 20];

    #[Middleware('permission:listar usuarios')]
    public function index(Request $request): Response
    {
        $opcionesPorPagina = self::OPCIONES_POR_PAGINA;
        $porPagina = (int) $request->input('por_pagina', $opcionesPorPagina[0]);

        if (! in_array($porPagina, $opcionesPorPagina, true)) {
            $porPagina = $opcionesPorPagina[0];
        }

        return Inertia::render('users/index', [
            'users' => User::query()
                ->with('roles:id,name')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->paginate($porPagina),
            'porPagina' => $porPagina,
            'opcionesPorPagina' => $opcionesPorPagina,
        ]);
    }

    #[Middleware('permission:crear usuarios')]
    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    #[Middleware('permission:crear usuarios')]
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'dni' => ['required', 'string', 'max:255', 'unique:users,dni'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ]);

        $roles = $validated['roles'] ?? [];
        unset($validated['roles']);

        $plainPassword = Str::password(10, symbols: false);
        $validated['password'] = $plainPassword;
        $validated['must_change_password'] = true;

        try {
            DB::transaction(function () use ($validated, $roles, $plainPassword): void {
                $user = User::create($validated);
                $user->syncRoles($roles);

                Mail::to($user->email)->send(new UsuarioCreadoMail($user, $plainPassword));
            });
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo enviar el correo con las credenciales. El usuario no fue creado.');
        }

        return to_route('users.index')->with('success', 'Usuario creado y credenciales enviadas por correo.');
    }

    #[Middleware('permission:editar usuarios')]
    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        return Inertia::render('users/edit', [
            'user' => $user->load('roles:id,name'),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    #[Middleware('permission:editar usuarios')]
    public function update(Request $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'dni' => ['required', 'string', 'max:255', Rule::unique('users', 'dni')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'reset_password' => ['sometimes', 'boolean'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')->where('guard_name', 'web')],
        ]);

        $roleIds = $validated['roles'] ?? [];
        $resetPassword = (bool) ($validated['reset_password'] ?? false);
        unset($validated['roles'], $validated['reset_password']);

        $plainPassword = null;
        if ($resetPassword) {
            $plainPassword = Str::password(10, symbols: false);
            $validated['password'] = $plainPassword;
            $validated['must_change_password'] = true;
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

        try {
            DB::transaction(function () use ($validated, $roleIds, $user, $plainPassword): void {
                $user->update($validated);
                $user->syncRoles($roleIds);

                if ($plainPassword !== null) {
                    Mail::to($user->email)->send(new UsuarioCreadoMail($user, $plainPassword));
                }
            });
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo enviar el correo con la nueva contraseña. No se guardaron los cambios.');
        }

        $mensaje = $plainPassword !== null
            ? 'Usuario actualizado y nueva contraseña temporal enviada por correo.'
            : 'Usuario actualizado.';

        return to_route('users.index')->with('success', $mensaje);
    }

    #[Middleware('permission:eliminar usuarios')]
    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return to_route('users.index')->with('error', 'No se puede eliminar el último administrador.');
        }

        $user->delete();

        return to_route('users.index')->with('success', 'Usuario eliminado.');
    }
}

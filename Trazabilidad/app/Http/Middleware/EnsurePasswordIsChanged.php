<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class EnsurePasswordIsChanged
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || ! $user->must_change_password) {
            return $next($request);
        }

        if ($request->routeIs('security.edit', 'user-password.update', 'password.*', 'logout')) {
            return $next($request);
        }

        Inertia::flash('toast', [
            'type' => 'warning',
            'message' => 'Debes cambiar tu contraseña temporal antes de continuar.',
        ]);

        return to_route('security.edit');
    }
}

<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use App\Http\Middleware\EnsurePasswordIsChanged;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Auth\Access\AuthorizationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            EnsurePasswordIsChanged::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
        //Agregados
        $exceptions->render(function (AuthorizationException|AccessDeniedHttpException $e, Request $request) {
            if ($request->header('X-Inertia')) {
                $mensaje = $e->getMessage() !== '' && $e->getMessage() !== 'This action is unauthorized.'
                    ? $e->getMessage()
                    : 'No tienes autorización para realizar esta acción.';

                return back()->with('error', $mensaje);
            }
        });

        $exceptions->render(function (UnauthorizedException $e, Request $request) {
            if ($request->header('X-Inertia')) {
                return back()->with('error', 'No tienes los permisos necesarios para realizar esta acción.');
            }
        });

        $exceptions->render(function (AuthorizationException|AccessDeniedHttpException|UnauthorizedException $e, Request $request) {
            if (! $request->header('X-Inertia')) {
                return null;
            }

            $mensaje = ($e instanceof UnauthorizedException || $e->getMessage() === '' || $e->getMessage() === 'This action is unauthorized.')
                ? 'No tienes los permisos necesarios para realizar esta acción.'
                : $e->getMessage();

            $destino = url()->previous() !== $request->fullUrl()
                ? back()
                : redirect()->route('dashboard');

            return $destino->with('error', $mensaje);
        });
    })->create();

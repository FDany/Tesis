<?php

namespace App\Policies;

use App\Models\RemitoSalidaRetiro;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RemitoSalidaRetiroPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('listar remitosSalida');
    }

    public function view(User $user, RemitoSalidaRetiro $remito): bool
    {
        return $user->can('verDetalle remitosSalida');
    }

    public function create(User $user): bool
    {
        return $user->can('crear remitosSalida');
    }

    public function conciliar(User $user, RemitoSalidaRetiro $remito): Response
    {
        if (! $user->can('conciliar remitosSalida')) {
            return Response::deny('No tienes permiso para conciliar remitos de salida.');
        }

        if ($remito->estado !== 'PENDIENTE_RETIRO') {
            return Response::deny("El remito {$remito->numero_remito_interno} ya fue conciliado (estado actual: {$remito->estado}) y no admite modificaciones.");
        }

        return Response::allow();
    }

    public function anular(User $user, RemitoSalidaRetiro $remito): Response
    {
        if (! $user->can('anular remitosSalida')) {
            return Response::deny('No tienes permiso para anular remitos de salida.');
        }

        if ($remito->estado !== 'PENDIENTE_RETIRO') {
            return Response::deny("Solo se pueden anular remitos en estado Pendiente de Retiro (estado actual: {$remito->estado}).");
        }

        return Response::allow();
    }

    public function descargarPdf(User $user, RemitoSalidaRetiro $remito): bool
    {
        return $user->can('descargarPDF remitosSalida');
    }
}

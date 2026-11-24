<?php

namespace App\Http\Controllers;

use App\Services\BolsaScannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class BolsaScannerController extends Controller
{
    public function __construct(
        private readonly BolsaScannerService $scannerService,
    ) {}

    #[Middleware('permission:crear remitosRecepcion')]
    public function verificarParaAlta(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
        ]);

        $resultado = $this->scannerService->verificarDisponibleParaAlta($validated['codigo']);

        return response()->json($resultado['payload'], $resultado['status']);
    }

    #[Middleware('permission:crear remitosEntregaServicio')]
    public function buscarParaEntrega(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
        ]);

        $resultado = $this->scannerService->buscarParaEntrega($validated['codigo']);

        return response()->json($resultado['payload'], $resultado['status']);
    }

    #[Middleware('permission:gestionar deposito')]
    public function buscarParaRecepcionDeposito(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],
        ]);

        $resultado = $this->scannerService->buscarParaRecepcionDeposito($validated['codigo']);

        return response()->json($resultado['payload'], $resultado['status']);
    }

    #[Middleware('permission:crear remitosSalida')]
    public function buscarParaDespacho(Request $request): JsonResponse
    {
        $codigo = (string) $request->query('codigo', '');

        if ($codigo === '') {
            return response()->json([
                'message' => 'Código de barras no proporcionado.',
            ], 400);
        }

        if (! preg_match('/^\d{13}$/', $codigo)) {
            return response()->json([
                'message' => 'El código de barras debe tener exactamente 13 dígitos numéricos.',
            ], 422);
        }

        $resultado = $this->scannerService->buscarParaDespacho($codigo);

        return response()->json($resultado['payload'], $resultado['status']);
    }
}

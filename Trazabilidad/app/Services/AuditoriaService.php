<?php

namespace App\Services;
use App\Models\Auditoria;
use Illuminate\Support\Facades\Auth;

class AuditoriaService
{
    public static function registrar(
        int $bolsaId,
        string $operacion,
        mixed $valorAnterior = null,
        mixed $valorNuevo = null,
        ?int $responsableId = null,
        mixed $fechaHora = null,
    ): Auditoria {
        return Auditoria::create([
            'responsable_usuario_id' => $responsableId ?? Auth::id(),
            'fecha_hora' => $fechaHora ?? now(),
            'operacion' => $operacion,
            'bolsa_id' => $bolsaId,
            'valor_anterior' => self::normalizarValor($valorAnterior),
            'valor_nuevo' => self::normalizarValor($valorNuevo),
        ]);
    }

    /**
     * @param  iterable<int, int>  $bolsaIds
     */
    public static function registrarLote(
        iterable $bolsaIds,
        string $operacion,
        mixed $valorAnterior = null,
        mixed $valorNuevo = null,
        ?int $responsableId = null,
        mixed $fechaHora = null,
    ): void {
        $responsableFinal = $responsableId ?? Auth::id();
        $fechaFinal = $fechaHora ?? now();
        $anteriorNormalizado = self::normalizarValor($valorAnterior);
        $nuevoNormalizado = self::normalizarValor($valorNuevo);
        $now = now();

        $filas = [];
        foreach ($bolsaIds as $bolsaId) {
            $filas[] = [
                'responsable_usuario_id' => $responsableFinal,
                'fecha_hora' => $fechaFinal,
                'operacion' => $operacion,
                'bolsa_id' => $bolsaId,
                'valor_anterior' => $anteriorNormalizado,
                'valor_nuevo' => $nuevoNormalizado,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if ($filas !== []) {
            Auditoria::insert($filas);
        }
    }

    private static function normalizarValor(mixed $valor): ?string
    {
        if ($valor === null) {
            return null;
        }

        if (is_array($valor) || is_object($valor)) {
            return json_encode($valor, JSON_UNESCAPED_UNICODE);
        }

        return (string) $valor;
    }
}

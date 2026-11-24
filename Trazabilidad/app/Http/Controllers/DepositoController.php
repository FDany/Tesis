<?php  
  
namespace App\Http\Controllers;  
  
use App\Models\Bolsa;  
use App\Models\RecepcionDeposito;  
use Illuminate\Http\JsonResponse;  
use Illuminate\Http\RedirectResponse;  
use Illuminate\Http\Request;  
use Illuminate\Support\Facades\DB;  
use Illuminate\Validation\ValidationException;  
use Inertia\Inertia;  
use Inertia\Response;  
  
class DepositoController extends Controller  
{  

    #[Middleware('permission:gestionar deposito')]  
    public function create(Request $request): Response  
    {  
        return Inertia::render('deposito/create', [  
            'puedeRecepcionar' => $request->user()->can('registrarRecepcionBolsa Deposito'),  
            'puedePesar' => $request->user()->can('registrarPesoBolsa Deposito'),  
        ]);  
    }

    // ---------- Recepción en depósito ----------    
    #[Middleware('permission:gestionar deposito')]  
    public function storeRecepcion(Request $request): RedirectResponse  
    {  
        $validated = $request->validate([  
            'codigos' => ['required', 'array', 'min:1', 'max:1000'],  
            'codigos.*' => [  
                'required',  
                'string',  
                'distinct:strict',  
                'regex:/^\d{13}$/',  
            ],  
        ]);  
  
        return DB::transaction(function () use ($validated, $request) {  
            $bolsas = Bolsa::query()  
                ->whereIn('codigo_barra', $validated['codigos'])  
                ->lockForUpdate()  
                ->get();  
  
            $codigosEncontrados = $bolsas->pluck('codigo_barra')->all();  
            $codigosNoEncontrados = array_diff($validated['codigos'], $codigosEncontrados);  
  
            if ($codigosNoEncontrados !== []) {  
                throw ValidationException::withMessages([  
                    'codigos' => 'No se encontraron estas bolsas: '  
                        . implode(', ', $codigosNoEncontrados),  
                ]);  
            }  
  
            $bolsasEstado = $bolsas  
                ->filter(fn (Bolsa $bolsa) =>  
                    $bolsa->estado !== 'OCUPADO'  
                    || $bolsa->remitos_serv_id === null  
                    || $bolsa->recep_dep_id !== null  
                )  
                ->pluck('codigo_barra')  
                ->all();  
  
            if ($bolsasEstado !== []) {  
                throw ValidationException::withMessages([  
                    'codigos' => 'Estas bolsas no están ocupadas por un servicio o ya fueron recibidas en depósito: '  
                        . implode(', ', $bolsasEstado),  
                ]);  
            }  
  
            $recepcion = RecepcionDeposito::create([  
                'fecha_hora' => now(),  
                'recibe_usuario_id' => $request->user()->id,  
            ]);  
  
            foreach ($bolsas as $bolsa) {  
                $bolsa->update([  
                    'estado' => 'EN_DEPOSITO',  
                    'recep_dep_id' => $recepcion->id,  
                ]);  
            }  
  
            return back()->with('success', 'Bolsas recibidas en depósito correctamente.');  
        });  
    }
  
    // ---------- Pesaje en depósito ----------    
    #[Middleware('permission:gestionar deposito')]  
    public function storePesaje(Request $request): RedirectResponse  
    {  
        $validated = $request->validate([  
            'codigo' => ['required', 'string', 'regex:/^\d{13}$/'],  
            'peso' => ['required', 'numeric', 'gt:0'],  
        ]);  
  
        return DB::transaction(function () use ($validated) {  
            $bolsa = Bolsa::query()  
                ->where('codigo_barra', $validated['codigo'])  
                ->lockForUpdate()  
                ->first();  
  
            if (! $bolsa) {  
                throw ValidationException::withMessages([  
                    'codigo' => 'No existe una bolsa con ese código.',  
                ]);  
            }  
  
            if (  
                $bolsa->estado !== 'EN_DEPOSITO'  
                || $bolsa->recep_dep_id === null  
                || $bolsa->rem_sal_id !== null  
            ) {  
                throw ValidationException::withMessages([  
                    'codigo' => 'La bolsa no está pendiente de pesaje en depósito.',  
                ]);  
            }  
  
            $bolsa->update([  
                'peso' => $validated['peso'],  
                'estado' => 'PESADA',  
            ]);  
  
            return back()->with(  
                'success',  
                "Bolsa {$bolsa->codigo_barra} pesada correctamente.",  
            );  
        });  
    }  
}  
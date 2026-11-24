<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ManifiestoFinal;  
use App\Models\DocumentoAdjunto;  
use App\Models\RemitoSalidaRetiro;  

class ManifiestosFinalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ------------------------------------------------------------------------  
        // 1. Manifiesto para remito RSI-2026-00002 (CONCILIADO -> FINALIZADO)  
        //    1 bolsa de 3.2 kg, sin diferencias  
        // ------------------------------------------------------------------------  
  
        // Documento oficial (certificado de tratamiento) del manifiesto  
        $doc1 = DocumentoAdjunto::firstOrCreate([  
            'id' => 1,  
            'tipo_documento' => 'CERTIFICADO_TRATAMIENTO',  
            'nombre_archivo' => 'manifiesto_00000001.pdf',  
            'url_archivo' => 'documentos/manifiestos/manifiesto_00000001.pdf',  
            'fecha_hora' => '2026-11-07 10:00:00',  
            'documentable_type' => ManifiestoFinal::class,  
            'documentable_id' => 1,  
        ]);  
  
        ManifiestoFinal::firstOrCreate([  
            'id' => 1,  
            'numero_manifiesto' => 1,  
            'fecha' => '2026-11-07',  
            'fecha_tratamiento' => '2026-11-08',  
            'rem_sal_id' => 2,  
            'cantidad_bolsas' => 1,  
            'peso_informado' => 3.2,  
            'documento_digital' => $doc1->id,  
            'observaciones' => 'Tratamiento por incineración efectuado sin novedades.',  
            'created_at' => '2026-11-07 10:00:00',  
            'updated_at' => '2026-11-07 10:00:00',  
        ]);  
  
        // El remito pasa a FINALIZADO (mismo efecto que ManifiestoFinalController::store)  
        RemitoSalidaRetiro::where('id', 2)->update(['estado' => 'FINALIZADO']);  
  
        // ------------------------------------------------------------------------  
        // 2. Manifiesto para remito RSI-2026-00003 (CON_INCIDENCIA -> FINALIZADO)  
        //    3 bolsas, 11.8 kg reales; DGM certificó 11.5 kg -> diferencia de peso  
        // ------------------------------------------------------------------------  
  
        $doc2 = DocumentoAdjunto::firstOrCreate([  
            'id' => 2,  
            'tipo_documento' => 'CERTIFICADO_TRATAMIENTO',  
            'nombre_archivo' => 'manifiesto_00000002.pdf',  
            'url_archivo' => 'documentos/manifiestos/manifiesto_00000002.pdf',  
            'fecha_hora' => '2026-11-07 11:00:00',  
            'documentable_type' => ManifiestoFinal::class,  
            'documentable_id' => 2,  
        ]);  
  
        ManifiestoFinal::firstOrCreate([  
            'id' => 2,  
            'numero_manifiesto' => 2,  
            'fecha' => '2026-11-07',  
            'fecha_tratamiento' => '2026-11-09',  
            'rem_sal_id' => 3,  
            'cantidad_bolsas' => 3,  
            'peso_informado' => 11.5,  
            'documento_digital' => $doc2->id,  
            'observaciones' => 'DGM certificó 0.3 kg menos respecto al peso registrado en sistema.',  
            'created_at' => '2026-11-07 11:00:00',  
            'updated_at' => '2026-11-07 11:00:00',  
        ]);  
  
        RemitoSalidaRetiro::where('id', 3)->update(['estado' => 'FINALIZADO']); 
    }
}

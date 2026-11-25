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
        $doc1 = DocumentoAdjunto::firstOrCreate(  
            ['url_archivo' => 'manifiestos/manifiesto_00000001.pdf'],  
            [  
                'tipo_documento' => 'manifiesto_final',  
                'nombre_archivo' => 'manifiesto_00000001.pdf',  
                'fecha_hora' => '2026-11-07 10:00:00',  
            ]  
        );  
    
        ManifiestoFinal::firstOrCreate(  
            ['numero_manifiesto' => 1],  
            [  
                'fecha' => '2026-11-07',  
                'fecha_tratamiento' => '2026-11-08',  
                'rem_sal_id' => 2,  
                'cantidad_bolsas' => 1,  
                'peso_informado' => 3.2,  
                'documento_digital' => $doc1->id,  
                'observaciones' => 'Tratamiento por incineración efectuado sin novedades.',  
                'created_at' => '2026-11-07 10:00:00',  
                'updated_at' => '2026-11-07 10:00:00',  
            ]  
        );  
    
        // El remito pasa a FINALIZADO (mismo efecto que ManifiestoFinalController::store)  
        RemitoSalidaRetiro::where('id', 2)->update(['estado' => 'FINALIZADO']);  
    
        // ------------------------------------------------------------------------  
        // 2. Manifiesto para remito RSI-2026-00003 (CON_INCIDENCIA -> FINALIZADO)  
        //    3 bolsas, 11.8 kg reales; DGM certificó 11.5 kg -> diferencia de peso  
        // ------------------------------------------------------------------------  
    
        $doc2 = DocumentoAdjunto::firstOrCreate(  
            ['url_archivo' => 'manifiestos/manifiesto_00000002.pdf'],  
            [  
                'tipo_documento' => 'manifiesto_final',  
                'nombre_archivo' => 'manifiesto_00000002.pdf',  
                'fecha_hora' => '2026-11-07 11:00:00',  
            ]  
        );  
    
        ManifiestoFinal::firstOrCreate(  
            ['numero_manifiesto' => 2],  
            [  
                'fecha' => '2026-11-07',  
                'fecha_tratamiento' => '2026-11-09',  
                'rem_sal_id' => 3,  
                'cantidad_bolsas' => 3,  
                'peso_informado' => 11.5,  
                'documento_digital' => $doc2->id,  
                'observaciones' => 'DGM certificó 0.3 kg menos respecto al peso registrado en sistema.',  
                'created_at' => '2026-11-07 11:00:00',  
                'updated_at' => '2026-11-07 11:00:00',  
            ]  
        );  
    
        RemitoSalidaRetiro::where('id', 3)->update(['estado' => 'FINALIZADO']);

        // ------------------------------------------------------------------------
        // 3. Manifiesto para remito RSI-2026-00008 (CONCILIADO -> FINALIZADO)
        //    1 bolsa (id 28) de 4.6 kg, sin diferencias
        // ------------------------------------------------------------------------
        $doc3 = DocumentoAdjunto::firstOrCreate(
            ['url_archivo' => 'manifiestos/manifiesto_00000003.pdf'],
            [
                'tipo_documento' => 'manifiesto_final',
                'nombre_archivo' => 'manifiesto_00000003.pdf',
                'fecha_hora' => '2026-11-16 10:00:00',
            ]
        );

        ManifiestoFinal::firstOrCreate(
            ['numero_manifiesto' => 3],
            [
                'fecha' => '2026-11-16',
                'fecha_tratamiento' => '2026-11-17',
                'rem_sal_id' => 8,
                'cantidad_bolsas' => 1,
                'peso_informado' => 4.6,
                'documento_digital' => $doc3->id,
                'observaciones' => 'Tratamiento por autoclave efectuado sin novedades.',
                'created_at' => '2026-11-16 10:00:00',
                'updated_at' => '2026-11-16 10:00:00',
            ]
        );

        RemitoSalidaRetiro::where('id', 8)->update(['estado' => 'FINALIZADO']);

        // ------------------------------------------------------------------------
        // 4. Manifiesto para remito RSI-2026-00009 (CONCILIADO -> FINALIZADO)
        //    1 bolsa (id 29) de residuos químicos, 2.7 kg
        // ------------------------------------------------------------------------
        $doc4 = DocumentoAdjunto::firstOrCreate(
            ['url_archivo' => 'manifiestos/manifiesto_00000004.pdf'],
            [
                'tipo_documento' => 'manifiesto_final',
                'nombre_archivo' => 'manifiesto_00000004.pdf',
                'fecha_hora' => '2026-11-16 11:00:00',
            ]
        );

        ManifiestoFinal::firstOrCreate(
            ['numero_manifiesto' => 4],
            [
                'fecha' => '2026-11-16',
                'fecha_tratamiento' => '2026-11-18',
                'rem_sal_id' => 9,
                'cantidad_bolsas' => 1,
                'peso_informado' => 2.7,
                'documento_digital' => $doc4->id,
                'observaciones' => 'Residuos químicos neutralizados y dispuestos en relleno de seguridad.',
                'created_at' => '2026-11-16 11:00:00',
                'updated_at' => '2026-11-16 11:00:00',
            ]
        );

        RemitoSalidaRetiro::where('id', 9)->update(['estado' => 'FINALIZADO']);
    }
}

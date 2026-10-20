<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bolsas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_barra', 30)->unique();
            $table->foreignId('tipo_bolsa_id')->constrained('tipos_bolsa');
            $table->foreignId('tamanio_id')->constrained('tamanios');
            $table->string('estado');
            $table->float('peso')->nullable();
            $table->foreignId('rem_rep_id')->constrained('remitos_recepcion');
            $table->foreignId('remitos_serv_id')->nullable()->constrained('remitos_entrega_servicios');
            $table->foreignId('recep_dep_id')->nullable()->constrained('recepciones_deposito');
            $table->foreignId('rem_sal_id')->nullable()->constrained('remitos_salida_retiro');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bolsas');
    }
};

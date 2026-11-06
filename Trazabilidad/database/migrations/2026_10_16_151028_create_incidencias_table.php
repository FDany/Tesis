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
        Schema::create('incidencias', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha_hora');
            $table->foreignId('usuario_registra')->constrained('users');
            //Relaciones opcionales
            $table->foreignId('bolsa_id')->nullable()->constrained('bolsas');
            $table->foreignId('rem_sal_id')->nullable()->constrained('remitos_salida_retiro');
            $table->string('codigo_no_registrado', 30)->nullable();
            $table->foreignId('tipo_bolsa_id')->nullable()->constrained('tipos_bolsa');
            $table->foreignId('servicio_id')->nullable()->constrained('servicios');
            //Detalle de la incidencia
            $table->string('tipo_incidencia');
            $table->string('descripcion');
            $table->string('accion_adoptada')->nullable();
            //Cierre y resolucion de la incidencia
            $table->foreignId('usuario_cierra')->nullable()->constrained('users');
            $table->timestamp('fecha_resolucion')->nullable();
            $table->string('estado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidencias');
    }
};

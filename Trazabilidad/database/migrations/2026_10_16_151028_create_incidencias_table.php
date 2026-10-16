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
            $table->unsignedBigInteger('usuario_registra');
            $table->foreign('usuario_registra')->references('id')->on('users');
            $table->foreignId('bolsa_id')->constrained('bolsas')->nullable();
            $table->string('codigo_no_registrado', 30)->nullable();
            $table->foreignId('tipo_bolsa_id')->constrained('tipos_bolsa')->nullable();
            $table->foreignId('servicio_id')->constrained('servicios')->nullable();
            $table->string('tipo_incidencia');
            $table->string('decripcion');
            $table->string('acccion_adoptada');
            $table->foreignId('usuario_cierra')->constrained('users')->nullable();
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

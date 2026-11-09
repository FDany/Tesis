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
        Schema::create('remitos_salida_retiro', function (Blueprint $table) {
            $table->id();
            // --- Datos del Remito Interno (Generado por el Hospital) ---
            $table->string('numero_remito_interno')->unique();
            $table->dateTime('fecha_emision');
            $table->integer('cantidad_bolsas_sistema');
            $table->foreignId('usuario_despacha_id')->constrained('users');

            // Estado del flujo operativo y de conciliación
            $table->string('estado')->default('PENDIENTE_RETIRO'); // PENDIENTE_RETIRO, CONCILIADO, CON_INCIDENCIA, ANULAD

            // --- Datos del Remito Oficial DGM (Completados al conciliar / retirar) ---
            $table->string('numero_remito')->nullable(); // Número de manifiesto DGM
            $table->dateTime('fecha_retiro')->nullable();
            $table->integer('cantidad_bolsas_declaradas_Empresa')->nullable();
            $table->string('responsable_empresa')->nullable();
            $table->string('datos_transporte')->nullable();

            // --- Observaciones generales ---
            $table->string('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitos_salida_retiro');
    }
};

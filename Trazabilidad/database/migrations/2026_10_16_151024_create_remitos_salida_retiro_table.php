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
            $table->string('numero_remito');
            $table->string('fecha_retiro');
            $table->integer('cantidad_bolsas_declaradas_Empresa');
            $table->string('responsable_empresa');
            $table->foreignId('usuario_despacha')->constrained('users');
            $table->string('datos_transporte')->nullable();
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

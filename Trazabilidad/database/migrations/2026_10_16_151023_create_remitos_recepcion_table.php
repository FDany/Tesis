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
        Schema::create('remitos_recepcion', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha_recepcion');
            $table->foreignId('recep_usuario_id')->constrained('users');
            $table->string('observaciones')->nullable();
            $table->string('codigo_inicio');
            $table->string('codigo_fin');
            $table->foreignId('tipo_bolsa_id')->constrained('tipos_bolsa');
            $table->integer('cantidad_declarada');
            $table->string('tamanio');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitos_recepcion');
    }
};

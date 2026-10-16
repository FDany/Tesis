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
        Schema::create('remitos_entrega_servicios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entrega_usuario_id')->constrained('users');
            $table->string('retira_nombre');
            $table->string('entregado_cargo');
            $table->timestamp('fecha_entrega');
            $table->foreignId('servicio_id')->constrained('servicios');
            $table->integer('cantidad_bolsas_dadas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remitos_entrega_servicios');
    }
};

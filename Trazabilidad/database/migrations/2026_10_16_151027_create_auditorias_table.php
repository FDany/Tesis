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
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('responsable_usuario_id')->constrained('users');
            $table->timestamp('fecha_hora')->useCurrent();
            $table->string('operacion');
            $table->foreignId('bolsa_id')->constrained('bolsas');
            $table->text('valor_anterior')->nullable();
            $table->text('valor_nuevo')->nullable();
            $table->timestamps();

            $table->index(['bolsa_id', 'fecha_hora'], 'auditorias_bolsa_fecha_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};

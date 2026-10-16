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
            $table->timestamp('fecha_hora');
            $table->string('operacion');
            $table->foreignId('bolsa_id')->constrained('bolsas');
            $table->string('valor_anterior');
            $table->string('valor_nuevo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};

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
        Schema::create('tipos_bolsa', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_residuo');
            $table->string('color');
            $table->string('proveedor');
            $table->unique(['tipo_residuo', 'color']);// Evita duplicar exactamente la misma combinación de flujo y color
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_bolsa');
    }
};

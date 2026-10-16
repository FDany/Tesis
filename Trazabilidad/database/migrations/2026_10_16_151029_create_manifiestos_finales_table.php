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
        Schema::create('manifiestos_finales', function (Blueprint $table) {
            $table->id();
            $table->integer('numero_manifiesto');
            $table->date('fecha');
            $table->date('fecha_tratamiento');
            $table->unsignedBigInteger('rem_sal_id');
            $table->foreign('rem_sal_id')->references('id')->on('remitos_salida_retiro');
            $table->string('cantidad_bolsas');
            $table->float('peso_informado');
            $table->foreignId('documento_digital')->constrained('documentos_adjuntos')->nullable();
            $table->string('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manifiestos_finales');
    }
};

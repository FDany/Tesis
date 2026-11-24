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
            $table->string('numero_manifiesto');
            $table->date('fecha');
            $table->date('fecha_tratamiento');
            $table->foreignId('rem_sal_id')
                ->unique()
                ->constrained('remitos_salida_retiro')
                ->cascadeOnDelete();
            $table->integer('cantidad_bolsas');
            $table->decimal('peso_informado', 8, 2);
            $table->foreignId('documento_digital')
                ->nullable()
                ->constrained('documentos_adjuntos')
                ->nullOnDelete();
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

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega el estado del remito de recepción y los datos del control físico
     * (usuario responsable y fecha) realizado desde la vista "Control Recepción".
     */
    public function up(): void
    {
        Schema::table('remitos_recepcion', function (Blueprint $table) {
            if (! Schema::hasColumn('remitos_recepcion', 'estado')) {
                $table->string('estado')->default('PENDIENTE_CONTROL')->after('cantidad_declarada');
            }

            if (! Schema::hasColumn('remitos_recepcion', 'control_usuario_id')) {
                $table->foreignId('control_usuario_id')->nullable()->after('estado')->constrained('users');
            }

            if (! Schema::hasColumn('remitos_recepcion', 'fecha_control')) {
                $table->timestamp('fecha_control')->nullable()->after('control_usuario_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('remitos_recepcion', function (Blueprint $table) {
            if (Schema::hasColumn('remitos_recepcion', 'control_usuario_id')) {
                $table->dropConstrainedForeignId('control_usuario_id');
            }

            if (Schema::hasColumn('remitos_recepcion', 'fecha_control')) {
                $table->dropColumn('fecha_control');
            }

            if (Schema::hasColumn('remitos_recepcion', 'estado')) {
                $table->dropColumn('estado');
            }
        });
    }
};

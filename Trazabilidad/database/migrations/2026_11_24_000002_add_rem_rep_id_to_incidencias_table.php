<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Vincula la incidencia con el remito de recepción controlado (opcional).
     */
    public function up(): void
    {
        if (Schema::hasColumn('incidencias', 'rem_rep_id')) {
            return;
        }

        Schema::table('incidencias', function (Blueprint $table) {
            $table->foreignId('rem_rep_id')->nullable()->after('rem_sal_id')->constrained('remitos_recepcion');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('incidencias', 'rem_rep_id')) {
            return;
        }

        Schema::table('incidencias', function (Blueprint $table) {
            $table->dropConstrainedForeignId('rem_rep_id');
        });
    }
};

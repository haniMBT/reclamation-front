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
        Schema::table('users', function (Blueprint $table) {
            // Ajouter les nouvelles colonnes si elles n'existent pas
            if (!Schema::hasColumn('users', 'nom')) {
                $table->string('nom')->after('id');
            }
            if (!Schema::hasColumn('users', 'prenom')) {
                $table->string('prenom')->after('nom');
            }
            if (!Schema::hasColumn('users', 'photo')) {
                $table->string('photo')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'privileges')) {
                $table->json('privileges')->nullable()->after('photo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nom', 'prenom', 'photo', 'privileges']);
        });
    }
};
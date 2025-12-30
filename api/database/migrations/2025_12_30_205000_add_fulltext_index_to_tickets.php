<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            // Using raw SQL for fulltext because older Laravel versions/MariaDB combinations
            // might not support the blueprint fullText() method consistently.
            DB::statement('ALTER TABLE tickets ADD FULLTEXT INDEX tickets_title_fulltext (title)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex('tickets_title_fulltext');
        });
    }
};

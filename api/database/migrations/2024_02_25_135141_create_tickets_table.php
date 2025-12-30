<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('description');
            $table->enum('category', [
                'Support / Incident — customer problems and outages.',
                'Service Request / Account — non-incident requests about accounts or access.',
                'Sales / Leads — inbound leads and followups tracked as tickets.',
                'Billing / Payment — invoices, refunds, disputes.'
            ]);
            $table->integer('priority');
            $table->foreignId('user_id')->default('1')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

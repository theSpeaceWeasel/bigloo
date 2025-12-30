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
        // First, change column to VARCHAR temporarily to allow data updates
        DB::statement("ALTER TABLE tickets MODIFY COLUMN category VARCHAR(255)");
        
        // Update existing data to map old categories to new ones
        // You may want to customize this mapping based on your business logic
        DB::table('tickets')
            ->where('category', 'Q1')
            ->update(['category' => 'Support / Incident — customer problems and outages.']);
        
        DB::table('tickets')
            ->where('category', 'Q2')
            ->update(['category' => 'Service Request / Account — non-incident requests about accounts or access.']);
        
        DB::table('tickets')
            ->where('category', 'Q3')
            ->update(['category' => 'Sales / Leads — inbound leads and followups tracked as tickets.']);
        
        DB::table('tickets')
            ->where('category', 'Q4')
            ->update(['category' => 'Billing / Payment — invoices, refunds, disputes.']);

        // Now change back to enum with new values
        DB::statement("ALTER TABLE tickets MODIFY COLUMN category ENUM(
            'Support / Incident — customer problems and outages.',
            'Service Request / Account — non-incident requests about accounts or access.',
            'Sales / Leads — inbound leads and followups tracked as tickets.',
            'Billing / Payment — invoices, refunds, disputes.'
        )");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, change column to VARCHAR temporarily to allow data updates
        DB::statement("ALTER TABLE tickets MODIFY COLUMN category VARCHAR(255)");
        
        // Update existing data back to old categories
        // Note: This is a reverse mapping - you may need to adjust based on your data
        DB::table('tickets')
            ->where('category', 'Support / Incident — customer problems and outages.')
            ->update(['category' => 'Q1']);
        
        DB::table('tickets')
            ->where('category', 'Service Request / Account — non-incident requests about accounts or access.')
            ->update(['category' => 'Q2']);
        
        DB::table('tickets')
            ->where('category', 'Sales / Leads — inbound leads and followups tracked as tickets.')
            ->update(['category' => 'Q3']);
        
        DB::table('tickets')
            ->where('category', 'Billing / Payment — invoices, refunds, disputes.')
            ->update(['category' => 'Q4']);

        // Revert to original enum values
        DB::statement("ALTER TABLE tickets MODIFY COLUMN category ENUM('Q1', 'Q2', 'Q3', 'Q4')");
    }
};

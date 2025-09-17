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
        Schema::create('counseling_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('session_id')->unique();
            $table->enum('session_type', ['chatbot', 'human_handover']);
            $table->json('messages'); // Array of message objects with timestamps
            $table->enum('status', ['open', 'closed', 'escalated'])->default('open');
            $table->foreignId('assigned_staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('escalated_at')->nullable();
            $table->text('escalation_reason')->nullable();
            $table->timestamp('consent_given_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status', 'created_at']);
            $table->index('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('counseling_sessions');
    }
};
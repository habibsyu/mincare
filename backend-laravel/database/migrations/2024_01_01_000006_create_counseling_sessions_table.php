<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('counseling_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('counselor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('type', ['chatbot', 'human_handover'])->default('chatbot');
            $table->enum('status', ['open', 'escalated', 'closed'])->default('open');
            $table->json('messages')->nullable();
            $table->text('escalation_reason')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->integer('rating')->nullable(); // 1-5 rating
            $table->text('feedback')->nullable();
            $table->timestamps();
            
            $table->index(['status', 'created_at']);
            $table->index(['type', 'status']);
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('counseling_sessions');
    }
};
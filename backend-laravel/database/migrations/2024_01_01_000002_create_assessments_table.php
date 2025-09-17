<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('type'); // PHQ-9, GAD-7, DASS-21, etc.
            $table->json('questions');
            $table->json('answers');
            $table->integer('score');
            $table->string('result_label');
            $table->json('recommendations')->nullable();
            $table->boolean('consent_given')->default(false);
            $table->timestamp('consent_timestamp')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('session_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['type', 'created_at']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
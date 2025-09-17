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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('type', ['PHQ-9', 'GAD-7', 'DASS-21', 'custom']);
            $table->text('raw_answers'); // Encrypted JSON
            $table->decimal('score', 8, 2);
            $table->string('result_label');
            $table->json('recommendations');
            $table->timestamp('consent_given_at');
            $table->string('anonymous_session_id')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'type', 'created_at']);
            $table->index('anonymous_session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
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
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['article', 'video', 'quiz']);
            $table->longText('body'); // Markdown or HTML
            $table->json('meta')->nullable(); // tags, categories, SEO
            $table->string('video_url')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->foreignId('author_id')->constrained('users');
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->timestamps();
            
            $table->index(['type', 'status', 'created_at']);
            $table->index('author_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
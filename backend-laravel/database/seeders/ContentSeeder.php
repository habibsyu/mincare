<?php

namespace Database\Seeders;

use App\Models\Content;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $staff = User::where('role', 'staff')->first();

        // Sample Articles
        Content::firstOrCreate(
            ['title' => 'Understanding Depression: Signs and Symptoms'],
            [
                'type' => 'article',
                'body' => '<p>Depression is a common mental health condition that affects millions of people worldwide...</p>',
                'meta' => json_encode([
                    'tags' => ['depression', 'mental-health', 'awareness'],
                    'category' => 'education',
                    'seo_title' => 'Understanding Depression | MindCare',
                    'seo_description' => 'Learn about depression signs, symptoms, and treatment options.'
                ]),
                'author_id' => $staff->id,
                'status' => 'published'
            ]
        );

        Content::firstOrCreate(
            ['title' => 'Anxiety Management Techniques'],
            [
                'type' => 'article',
                'body' => '<p>Anxiety is a natural response to stress, but when it becomes overwhelming...</p>',
                'meta' => json_encode([
                    'tags' => ['anxiety', 'coping-strategies', 'mental-health'],
                    'category' => 'self-help',
                    'seo_title' => 'Anxiety Management | MindCare',
                    'seo_description' => 'Effective techniques for managing anxiety and stress.'
                ]),
                'author_id' => $staff->id,
                'status' => 'published'
            ]
        );

        // Sample Videos
        Content::firstOrCreate(
            ['title' => 'Guided Meditation for Beginners'],
            [
                'type' => 'video',
                'body' => '<p>A 10-minute guided meditation session perfect for beginners...</p>',
                'video_url' => 'https://www.youtube.com/watch?v=example1',
                'thumbnail_path' => '/images/meditation-thumbnail.jpg',
                'meta' => json_encode([
                    'tags' => ['meditation', 'mindfulness', 'relaxation'],
                    'category' => 'video-content',
                    'duration' => '10:30'
                ]),
                'author_id' => $admin->id,
                'status' => 'published'
            ]
        );

        // Sample Blogs
        Blog::firstOrCreate(
            ['slug' => 'mental-health-awareness-month'],
            [
                'title' => 'Mental Health Awareness Month: Breaking the Stigma',
                'body' => '<p>Every year, Mental Health Awareness Month provides an opportunity...</p>',
                'tags' => json_encode(['awareness', 'stigma', 'mental-health']),
                'seo_meta' => json_encode([
                    'title' => 'Mental Health Awareness Month | MindCare Blog',
                    'description' => 'Join us in breaking mental health stigma this awareness month.',
                    'keywords' => 'mental health, awareness, stigma, support'
                ]),
                'author_id' => $staff->id,
                'status' => 'published',
                'published_at' => now()
            ]
        );

        Blog::firstOrCreate(
            ['slug' => 'importance-of-professional-help'],
            [
                'title' => 'The Importance of Seeking Professional Mental Health Help',
                'body' => '<p>While self-care and coping strategies are important...</p>',
                'tags' => json_encode(['professional-help', 'therapy', 'counseling']),
                'seo_meta' => json_encode([
                    'title' => 'Professional Mental Health Help | MindCare',
                    'description' => 'Learn when and why to seek professional mental health support.',
                    'keywords' => 'therapy, counseling, mental health professional'
                ]),
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDays(3)
            ]
        );
    }
}
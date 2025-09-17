<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Content;
use App\Models\Blog;
use App\Models\CommunityLink;
use App\Models\Assessment;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@mindcare.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $staff = User::create([
            'name' => 'Staff User',
            'email' => 'staff@mindcare.com',
            'password' => Hash::make('staff123'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        $psikolog = User::create([
            'name' => 'Dr. Sarah Johnson',
            'email' => 'psikolog@mindcare.com',
            'password' => Hash::make('psikolog123'),
            'role' => 'psikolog',
            'email_verified_at' => now(),
        ]);

        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@mindcare.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create sample content
        Content::create([
            'title' => 'Understanding Depression: A Comprehensive Guide',
            'slug' => 'understanding-depression-guide',
            'excerpt' => 'Learn about the signs, symptoms, and treatment options for depression.',
            'body' => '<p>Depression is a common mental health condition that affects millions of people worldwide. It is characterized by persistent feelings of sadness, hopelessness, and a lack of interest in activities that were once enjoyable.</p><p>This comprehensive guide will help you understand the various aspects of depression, including its causes, symptoms, and available treatment options.</p>',
            'type' => 'article',
            'status' => 'published',
            'author_id' => $staff->id,
            'featured' => true,
            'meta' => ['tags' => ['depression', 'mental health', 'treatment']],
            'published_at' => now(),
        ]);

        Content::create([
            'title' => 'Anxiety Management Techniques',
            'slug' => 'anxiety-management-techniques',
            'excerpt' => 'Practical strategies to help manage anxiety in daily life.',
            'body' => '<p>Anxiety is a normal response to stress, but when it becomes overwhelming, it can interfere with daily activities. Here are some effective techniques to help manage anxiety:</p><ul><li>Deep breathing exercises</li><li>Progressive muscle relaxation</li><li>Mindfulness meditation</li><li>Regular exercise</li><li>Healthy sleep habits</li></ul>',
            'type' => 'article',
            'status' => 'published',
            'author_id' => $staff->id,
            'meta' => ['tags' => ['anxiety', 'coping strategies', 'mindfulness']],
            'published_at' => now(),
        ]);

        Content::create([
            'title' => 'Meditation for Mental Health',
            'slug' => 'meditation-mental-health-video',
            'excerpt' => 'A guided meditation session for stress relief and mental clarity.',
            'body' => '<p>This guided meditation video will help you relax, reduce stress, and improve your mental well-being. Perfect for beginners and experienced practitioners alike.</p>',
            'type' => 'video',
            'status' => 'published',
            'author_id' => $staff->id,
            'video_url' => 'https://example.com/meditation-video',
            'meta' => ['tags' => ['meditation', 'stress relief', 'mindfulness']],
            'published_at' => now(),
        ]);

        // Create sample blog posts
        Blog::create([
            'title' => '5 Daily Habits for Better Mental Health',
            'slug' => '5-daily-habits-better-mental-health',
            'excerpt' => 'Simple daily practices that can significantly improve your mental well-being.',
            'body' => '<p>Maintaining good mental health requires consistent effort and the right habits. Here are five daily practices that can make a significant difference in your mental well-being:</p><h3>1. Start Your Day with Gratitude</h3><p>Take a few minutes each morning to reflect on three things you\'re grateful for. This simple practice can shift your mindset and improve your overall mood.</p><h3>2. Practice Mindful Breathing</h3><p>Spend 5-10 minutes focusing on your breath. This helps reduce stress and anxiety while improving focus and clarity.</p><h3>3. Get Moving</h3><p>Regular physical activity releases endorphins, which are natural mood boosters. Even a short walk can make a difference.</p><h3>4. Connect with Others</h3><p>Social connections are vital for mental health. Make time to connect with friends, family, or colleagues each day.</p><h3>5. Prioritize Sleep</h3><p>Quality sleep is essential for mental health. Aim for 7-9 hours of sleep each night and maintain a consistent sleep schedule.</p>',
            'author_id' => $staff->id,
            'status' => 'published',
            'featured' => true,
            'tags' => ['mental health', 'daily habits', 'wellness', 'self-care'],
            'meta_description' => 'Discover five simple daily habits that can significantly improve your mental health and overall well-being.',
            'published_at' => now(),
        ]);

        Blog::create([
            'title' => 'Breaking the Stigma: Talking About Mental Health',
            'slug' => 'breaking-stigma-talking-mental-health',
            'excerpt' => 'Why open conversations about mental health matter and how to start them.',
            'body' => '<p>Mental health stigma remains one of the biggest barriers to seeking help. Many people suffer in silence due to fear of judgment, discrimination, or misunderstanding.</p><p>It\'s time to break this stigma and create a culture where mental health is treated with the same importance as physical health.</p><h3>Why Stigma Exists</h3><p>Mental health stigma often stems from:</p><ul><li>Lack of understanding about mental health conditions</li><li>Fear of the unknown</li><li>Cultural and societal beliefs</li><li>Media misrepresentation</li></ul><h3>How to Start Conversations</h3><p>Here are some ways to promote open dialogue about mental health:</p><ul><li>Share your own experiences when appropriate</li><li>Listen without judgment</li><li>Educate yourself and others</li><li>Use person-first language</li><li>Challenge misconceptions when you hear them</li></ul>',
            'author_id' => $psikolog->id,
            'status' => 'published',
            'tags' => ['mental health', 'stigma', 'awareness', 'communication'],
            'meta_description' => 'Learn how to break mental health stigma and start meaningful conversations about mental wellness.',
            'published_at' => now()->subDays(2),
        ]);

        // Create community links
        CommunityLink::create([
            'platform' => 'discord',
            'url' => 'https://discord.gg/mindcare-support',
            'description' => 'Join our Discord community for real-time support, group discussions, and mental health resources.',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        CommunityLink::create([
            'platform' => 'telegram',
            'url' => 'https://t.me/mindcare_community',
            'description' => 'Connect with our Telegram community for daily mental health tips and peer support.',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Create sample assessments
        Assessment::create([
            'user_id' => $user->id,
            'type' => 'PHQ-9',
            'questions' => [
                'Little interest or pleasure in doing things',
                'Feeling down, depressed, or hopeless',
                'Trouble falling or staying asleep, or sleeping too much',
                'Feeling tired or having little energy',
                'Poor appetite or overeating',
                'Feeling bad about yourself or that you are a failure',
                'Trouble concentrating on things',
                'Moving or speaking slowly or being restless',
                'Thoughts that you would be better off dead'
            ],
            'answers' => [1, 2, 1, 2, 0, 1, 1, 0, 0],
            'score' => 8,
            'result_label' => 'Mild Depression',
            'recommendations' => [
                'Consider speaking with a mental health professional',
                'Practice regular exercise and maintain a healthy diet',
                'Ensure adequate sleep and establish a routine',
                'Stay connected with friends and family'
            ],
            'consent_given' => true,
            'consent_timestamp' => now(),
            'ip_address' => '127.0.0.1',
        ]);

        Assessment::create([
            'user_id' => $user->id,
            'type' => 'GAD-7',
            'questions' => [
                'Feeling nervous, anxious, or on edge',
                'Not being able to stop or control worrying',
                'Worrying too much about different things',
                'Trouble relaxing',
                'Being so restless that it is hard to sit still',
                'Becoming easily annoyed or irritable',
                'Feeling afraid, as if something awful might happen'
            ],
            'answers' => [2, 1, 2, 1, 0, 1, 1],
            'score' => 8,
            'result_label' => 'Mild Anxiety',
            'recommendations' => [
                'Practice relaxation techniques such as deep breathing',
                'Consider mindfulness or meditation practices',
                'Regular physical activity can help reduce anxiety',
                'Limit caffeine and alcohol consumption'
            ],
            'consent_given' => true,
            'consent_timestamp' => now(),
            'ip_address' => '127.0.0.1',
        ]);
    }
}
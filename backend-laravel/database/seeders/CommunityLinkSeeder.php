<?php

namespace Database\Seeders;

use App\Models\CommunityLink;
use Illuminate\Database\Seeder;

class CommunityLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommunityLink::firstOrCreate(
            ['platform' => 'discord'],
            [
                'url' => 'https://discord.gg/mindcare-support',
                'title' => 'MindCare Support Community',
                'description' => 'Join our Discord server for peer support, group discussions, and community events.',
                'sort_order' => 1
            ]
        );

        CommunityLink::firstOrCreate(
            ['platform' => 'telegram'],
            [
                'url' => 'https://t.me/mindcare_support',
                'title' => 'MindCare Telegram Group',
                'description' => 'Daily mental health tips, motivation, and support in our Telegram community.',
                'sort_order' => 2
            ]
        );

        CommunityLink::firstOrCreate(
            ['platform' => 'other'],
            [
                'url' => 'https://www.reddit.com/r/MindCareSupport',
                'title' => 'MindCare Reddit Community',
                'description' => 'Share experiences, ask questions, and find support in our Reddit community.',
                'sort_order' => 3
            ]
        );
    }
}
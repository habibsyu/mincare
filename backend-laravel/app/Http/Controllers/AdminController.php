<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Assessment;
use App\Models\Content;
use App\Models\Blog;
use App\Models\CounselingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $stats = [
            'users' => [
                'total' => User::count(),
                'new_this_month' => User::where('created_at', '>=', Carbon::now()->startOfMonth())->count(),
                'active_users' => User::where('is_active', true)->count(),
                'by_role' => User::select('role', DB::raw('count(*) as count'))
                    ->groupBy('role')
                    ->get()
                    ->keyBy('role')
            ],
            'assessments' => [
                'total' => Assessment::count(),
                'this_month' => Assessment::where('created_at', '>=', Carbon::now()->startOfMonth())->count(),
                'by_type' => Assessment::select('type', DB::raw('count(*) as count'))
                    ->groupBy('type')
                    ->get()
                    ->keyBy('type'),
                'average_scores' => Assessment::select('type', DB::raw('AVG(score) as avg_score'))
                    ->groupBy('type')
                    ->get()
                    ->keyBy('type')
            ],
            'content' => [
                'total_articles' => Content::where('type', 'article')->count(),
                'total_videos' => Content::where('type', 'video')->count(),
                'published_content' => Content::where('status', 'published')->count(),
                'draft_content' => Content::where('status', 'draft')->count(),
                'total_blogs' => Blog::count(),
                'published_blogs' => Blog::where('status', 'published')->count()
            ],
            'counseling' => [
                'total_sessions' => CounselingSession::count(),
                'active_sessions' => CounselingSession::where('status', 'open')->count(),
                'escalated_sessions' => CounselingSession::where('status', 'escalated')->count(),
                'sessions_this_month' => CounselingSession::where('created_at', '>=', Carbon::now()->startOfMonth())->count()
            ]
        ];

        return response()->json($stats);
    }

    public function statistics(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);

        $userGrowth = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $assessmentTrends = Assessment::select(
                DB::raw('DATE(created_at) as date'),
                'type',
                DB::raw('COUNT(*) as count'),
                DB::raw('AVG(score) as avg_score')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date', 'type')
            ->orderBy('date')
            ->get();

        $contentViews = Content::select(
                'title',
                'type',
                'views_count',
                'likes_count',
                'created_at'
            )
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->limit(10)
            ->get();

        $sessionActivity = CounselingSession::select(
                DB::raw('DATE(created_at) as date'),
                'session_type',
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date', 'session_type')
            ->orderBy('date')
            ->get();

        return response()->json([
            'user_growth' => $userGrowth,
            'assessment_trends' => $assessmentTrends,
            'popular_content' => $contentViews,
            'session_activity' => $sessionActivity,
            'period' => $period . ' days'
        ]);
    }
}
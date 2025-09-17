<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Services\AssessmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AssessmentController extends Controller
{
    protected $assessmentService;

    public function __construct(AssessmentService $assessmentService)
    {
        $this->assessmentService = $assessmentService;
    }

    public function getQuestions(Request $request)
    {
        $type = $request->query('type', 'PHQ-9');
        
        $questions = $this->assessmentService->getQuestions($type);
        
        return response()->json([
            'type' => $type,
            'questions' => $questions,
            'total_questions' => count($questions)
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:PHQ-9,GAD-7,DASS-21,custom',
            'answers' => 'required|array',
            'consent' => 'required|boolean|accepted',
            'anonymous_session_id' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $isAnonymous = !$user && $request->anonymous_session_id;

        if (!$user && !$isAnonymous) {
            return response()->json(['error' => 'Authentication required for non-anonymous assessments'], 401);
        }

        try {
            $result = $this->assessmentService->processAssessment(
                $request->type,
                $request->answers,
                $user?->id,
                $request->anonymous_session_id
            );

            $assessment = Assessment::create([
                'user_id' => $user?->id,
                'type' => $request->type,
                'raw_answers' => encrypt(json_encode($request->answers)),
                'score' => $result['score'],
                'result_label' => $result['label'],
                'recommendations' => $result['recommendations'],
                'consent_given_at' => now(),
                'anonymous_session_id' => $request->anonymous_session_id
            ]);

            return response()->json([
                'id' => $assessment->id,
                'score' => $result['score'],
                'result_label' => $result['label'],
                'recommendations' => $result['recommendations'],
                'severity_level' => $result['severity_level'] ?? null,
                'next_steps' => $result['next_steps'] ?? null
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process assessment'], 500);
        }
    }

    public function show($id)
    {
        $assessment = Assessment::find($id);

        if (!$assessment) {
            return response()->json(['error' => 'Assessment not found'], 404);
        }

        $user = Auth::user();

        // Check permission
        if (!$user || (
            $assessment->user_id !== $user->id && 
            !in_array($user->role, ['admin', 'staff'])
        )) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'id' => $assessment->id,
            'type' => $assessment->type,
            'score' => $assessment->score,
            'result_label' => $assessment->result_label,
            'recommendations' => $assessment->recommendations,
            'created_at' => $assessment->created_at,
        ];

        // Only show raw answers to admin/staff or assessment owner
        if ($user->role === 'admin' || $assessment->user_id === $user->id) {
            $data['raw_answers'] = json_decode(decrypt($assessment->raw_answers));
        }

        return response()->json($data);
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = Assessment::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->date_from) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $assessments = $query->paginate(20);

        // Remove sensitive data for staff role
        if ($user->role === 'staff') {
            $assessments->getCollection()->transform(function ($assessment) {
                unset($assessment->raw_answers);
                return $assessment;
            });
        }

        return response()->json($assessments);
    }

    public function statistics()
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $stats = $this->assessmentService->getStatistics();

        return response()->json($stats);
    }
}
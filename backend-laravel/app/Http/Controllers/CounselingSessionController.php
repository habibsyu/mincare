<?php

namespace App\Http\Controllers;

use App\Models\CounselingSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CounselingSessionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (in_array($user->role, ['admin', 'staff', 'psikolog'])) {
            $query = CounselingSession::with('user:id,name,email', 'assignedStaff:id,name')
                ->orderBy('created_at', 'desc');

            if ($request->status) {
                $query->where('status', $request->status);
            }

            if ($request->assigned_to_me && in_array($user->role, ['staff', 'psikolog'])) {
                $query->where('assigned_staff_id', $user->id);
            }

            $sessions = $query->paginate(20);
        } else {
            // Regular users can only see their own sessions
            $sessions = CounselingSession::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
        }

        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'session_type' => 'in:chatbot,human_handover',
            'consent' => 'required|boolean|accepted'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $session = CounselingSession::create([
            'user_id' => $user->id,
            'session_type' => $request->session_type ?? 'chatbot',
            'messages' => [],
            'consent_given_at' => now()
        ]);

        return response()->json($session, 201);
    }

    public function show($id)
    {
        $user = Auth::user();
        $session = CounselingSession::with('user:id,name,email', 'assignedStaff:id,name')->find($id);

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Check permissions
        $hasAccess = $session->user_id === $user->id || 
                    in_array($user->role, ['admin', 'staff', 'psikolog']) ||
                    $session->assigned_staff_id === $user->id;

        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($session);
    }

    public function addMessage(Request $request, $id)
    {
        $user = Auth::user();
        $session = CounselingSession::find($id);

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Check permissions
        $hasAccess = $session->user_id === $user->id || 
                    in_array($user->role, ['admin', 'staff', 'psikolog']) ||
                    $session->assigned_staff_id === $user->id;

        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'message.message' => 'required|string',
            'message.sender' => 'required|in:user,bot,staff',
            'message.metadata' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $messageData = $request->message;
        $messageData['id'] = uniqid();
        $messageData['timestamp'] = now()->toISOString();

        $session->addMessage(
            $messageData['message'],
            $messageData['sender'],
            $messageData['metadata'] ?? []
        );

        return response()->json(['message' => 'Message added successfully']);
    }

    public function assign(Request $request, $id)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff', 'psikolog'])) {
            return response()->json(['error' => 'Staff access required'], 403);
        }

        $session = CounselingSession::find($id);

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'staffId' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $session->assignToStaff($request->staffId);

        return response()->json(['message' => 'Session assigned successfully']);
    }

    public function escalate(Request $request, $id)
    {
        $user = Auth::user();
        $session = CounselingSession::find($id);

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        // Check permissions
        $hasAccess = $session->user_id === $user->id || 
                    in_array($user->role, ['admin', 'staff', 'psikolog']);

        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string',
            'staffId' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $session->escalateToHuman($request->reason, $request->staffId);

        return response()->json(['message' => 'Session escalated successfully']);
    }

    public function close(Request $request, $id)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff', 'psikolog'])) {
            return response()->json(['error' => 'Staff access required'], 403);
        }

        $session = CounselingSession::find($id);

        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $session->close();

        return response()->json(['message' => 'Session closed successfully']);
    }
}
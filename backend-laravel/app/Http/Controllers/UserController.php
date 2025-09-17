<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $query = User::orderBy('created_at', 'desc');

        if ($request->role) {
            $query->where('role', $request->role);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate(20);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff']) && $user->id != $id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $targetUser = User::with(['assessments' => function($query) use ($user) {
            if ($user->role !== 'admin') {
                $query->select('id', 'user_id', 'type', 'score', 'result_label', 'created_at');
            }
        }])->find($id);

        if (!$targetUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($targetUser);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $user->id != $id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $rules = [
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed'
        ];

        // Only admin can change roles
        if ($user->role === 'admin') {
            $rules['role'] = 'in:admin,staff,user,psikolog';
            $rules['is_active'] = 'boolean';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = $request->only(['name', 'email', 'phone']);

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        if ($user->role === 'admin') {
            if ($request->has('role')) {
                $updateData['role'] = $request->role;
            }
            if ($request->has('is_active')) {
                $updateData['is_active'] = $request->is_active;
            }
        }

        $targetUser->update($updateData);

        return response()->json($targetUser->only(['id', 'name', 'email', 'phone', 'role', 'is_active', 'created_at']));
    }

    public function profile()
    {
        $user = Auth::user();
        return response()->json($user->only(['id', 'name', 'email', 'phone', 'role', 'created_at']));
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = $request->only(['name', 'email', 'phone']);

        if ($request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json($user->only(['id', 'name', 'email', 'phone', 'role', 'created_at']));
    }

    public function ban($id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($targetUser->role === 'admin') {
            return response()->json(['error' => 'Cannot ban admin users'], 403);
        }

        $targetUser->update(['is_active' => false]);

        return response()->json(['message' => 'User banned successfully']);
    }

    public function unban($id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $targetUser->update(['is_active' => true]);

        return response()->json(['message' => 'User unbanned successfully']);
    }
}
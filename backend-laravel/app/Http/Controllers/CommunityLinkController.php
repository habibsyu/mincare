<?php

namespace App\Http\Controllers;

use App\Models\CommunityLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommunityLinkController extends Controller
{
    public function index()
    {
        $links = CommunityLink::active()->ordered()->get();
        return response()->json($links);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $validator = Validator::make($request->all(), [
            'platform' => 'required|in:discord,telegram,other',
            'url' => 'required|url',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $link = CommunityLink::create($request->all());

        return response()->json($link, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $link = CommunityLink::find($id);

        if (!$link) {
            return response()->json(['error' => 'Link not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'platform' => 'in:discord,telegram,other',
            'url' => 'url',
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $link->update($request->all());

        return response()->json($link);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }

        $link = CommunityLink::find($id);

        if (!$link) {
            return response()->json(['error' => 'Link not found'], 404);
        }

        $link->delete();

        return response()->json(['message' => 'Link deleted successfully']);
    }
}
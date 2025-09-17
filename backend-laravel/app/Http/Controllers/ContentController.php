<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    public function index(Request $request)
    {
        $query = Content::with('author:id,name')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc');

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('body', 'like', '%' . $request->search . '%');
            });
        }

        $contents = $query->paginate(12);

        return response()->json($contents);
    }

    public function show($id)
    {
        $content = Content::with('author:id,name')->find($id);

        if (!$content || $content->status !== 'published') {
            return response()->json(['error' => 'Content not found'], 404);
        }

        // Increment views
        $content->incrementViews();

        return response()->json($content);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'type' => 'required|in:article,video,quiz',
            'body' => 'required|string',
            'meta' => 'nullable|array',
            'video_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|max:2048',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $content = Content::create([
            'title' => $request->title,
            'type' => $request->type,
            'body' => $request->body,
            'meta' => $request->meta ?? [],
            'video_url' => $request->video_url,
            'thumbnail_path' => $thumbnailPath,
            'author_id' => $user->id,
            'status' => $request->status ?? 'draft'
        ]);

        return response()->json($content->load('author:id,name'), 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $content = Content::find($id);

        if (!$content) {
            return response()->json(['error' => 'Content not found'], 404);
        }

        if (!in_array($user->role, ['admin', 'staff']) && $content->author_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'type' => 'in:article,video,quiz',
            'body' => 'string',
            'meta' => 'nullable|array',
            'video_url' => 'nullable|url',
            'thumbnail' => 'nullable|image|max:2048',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = $request->only(['title', 'type', 'body', 'meta', 'video_url', 'status']);

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($content->thumbnail_path) {
                Storage::disk('public')->delete($content->thumbnail_path);
            }
            $updateData['thumbnail_path'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $content->update($updateData);

        return response()->json($content->load('author:id,name'));
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $content = Content::find($id);

        if (!$content) {
            return response()->json(['error' => 'Content not found'], 404);
        }

        if ($user->role !== 'admin' && $content->author_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete thumbnail
        if ($content->thumbnail_path) {
            Storage::disk('public')->delete($content->thumbnail_path);
        }

        $content->delete();

        return response()->json(['message' => 'Content deleted successfully']);
    }
}
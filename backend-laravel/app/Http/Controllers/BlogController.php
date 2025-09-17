<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::with('author:id,name')
            ->published()
            ->orderBy('published_at', 'desc');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('body', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->tag) {
            $query->withTag($request->tag);
        }

        $blogs = $query->paginate(10);

        return response()->json($blogs);
    }

    public function show($slug)
    {
        $blog = Blog::with('author:id,name')
            ->where('slug', $slug)
            ->published()
            ->first();

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], 404);
        }

        // Increment views
        $blog->incrementViews();

        return response()->json($blog);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'tags' => 'nullable|array',
            'seo_meta' => 'nullable|array',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $blog = Blog::create([
            'title' => $request->title,
            'body' => $request->body,
            'tags' => $request->tags ?? [],
            'seo_meta' => $request->seo_meta ?? [],
            'author_id' => $user->id,
            'status' => $request->status ?? 'draft',
            'published_at' => $request->status === 'published' ? now() : null
        ]);

        return response()->json($blog->load('author:id,name'), 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], 404);
        }

        if (!in_array($user->role, ['admin', 'staff']) && $blog->author_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'body' => 'string',
            'tags' => 'nullable|array',
            'seo_meta' => 'nullable|array',
            'status' => 'in:draft,published'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateData = $request->only(['title', 'body', 'tags', 'seo_meta', 'status']);

        if ($request->status === 'published' && !$blog->published_at) {
            $updateData['published_at'] = now();
        }

        $blog->update($updateData);

        return response()->json($blog->load('author:id,name'));
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], 404);
        }

        if ($user->role !== 'admin' && $blog->author_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $blog->delete();

        return response()->json(['message' => 'Blog deleted successfully']);
    }
}
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommunityLinkController;
use App\Http\Controllers\CounselingSessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Assessment routes (some public for anonymous assessments)
Route::prefix('assessments')->group(function () {
    Route::get('/questions', [AssessmentController::class, 'getQuestions']);
    Route::post('/', [AssessmentController::class, 'submit'])->middleware('throttle:assessment');
    Route::get('/history', [AssessmentController::class, 'getHistory'])->middleware('auth:api');
    Route::get('/{id}', [AssessmentController::class, 'getResult']);
});

// Public content routes
Route::prefix('contents')->group(function () {
    Route::get('/', [ContentController::class, 'index']);
    Route::get('/{id}', [ContentController::class, 'show']);
});

// Public blog routes
Route::prefix('blogs')->group(function () {
    Route::get('/', [BlogController::class, 'index']);
    Route::get('/{id}', [BlogController::class, 'show']);
    Route::get('/slug/{slug}', [BlogController::class, 'showBySlug']);
});

// Public community links
Route::get('/community/links', [CommunityLinkController::class, 'index']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    
    // User routes
    Route::prefix('users')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
    });
    
    // Content management (staff/admin only)
    Route::middleware('role:staff,admin')->prefix('contents')->group(function () {
        Route::post('/', [ContentController::class, 'store']);
        Route::put('/{id}', [ContentController::class, 'update']);
        Route::delete('/{id}', [ContentController::class, 'destroy']);
    });
    
    // Blog management (staff/admin only)
    Route::middleware('role:staff,admin')->prefix('blogs')->group(function () {
        Route::post('/', [BlogController::class, 'store']);
        Route::put('/{id}', [BlogController::class, 'update']);
        Route::delete('/{id}', [BlogController::class, 'destroy']);
    });
    
    // Community management (admin only)
    Route::middleware('role:admin')->prefix('community')->group(function () {
        Route::post('/links', [CommunityLinkController::class, 'store']);
        Route::put('/links/{id}', [CommunityLinkController::class, 'update']);
        Route::delete('/links/{id}', [CommunityLinkController::class, 'destroy']);
    });
    
    // Counseling sessions (psikolog/admin)
    Route::middleware('role:psikolog,admin')->prefix('counseling')->group(function () {
        Route::get('/sessions', [CounselingSessionController::class, 'index']);
        Route::get('/sessions/{id}', [CounselingSessionController::class, 'show']);
        Route::post('/sessions/{id}/claim', [CounselingSessionController::class, 'claim']);
        Route::post('/sessions/{id}/close', [CounselingSessionController::class, 'close']);
    });
    
    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/assessments', [AdminController::class, 'getAssessments']);
        Route::get('/sessions', [AdminController::class, 'getSessions']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::post('/users/{id}/ban', [UserController::class, 'ban']);
        Route::post('/users/{id}/unban', [UserController::class, 'unban']);
    });
});
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommunityLinkController;
use App\Http\Controllers\CounselingSessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Assessment routes (some public)
Route::get('/assessments/questions', [AssessmentController::class, 'getQuestions']);
Route::post('/assessments', [AssessmentController::class, 'store']);

// Public content routes
Route::get('/contents', [ContentController::class, 'index']);
Route::get('/contents/{id}', [ContentController::class, 'show']);
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
Route::get('/community/links', [CommunityLinkController::class, 'index']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    
    // User routes
    Route::get('/users/profile', [UserController::class, 'profile']);
    Route::put('/users/profile', [UserController::class, 'updateProfile']);
    
    // Assessment routes
    Route::get('/assessments/{id}', [AssessmentController::class, 'show']);
    
    // Counseling routes
    Route::get('/counseling/sessions', [CounselingSessionController::class, 'index']);
    Route::post('/counseling/sessions', [CounselingSessionController::class, 'store']);
    Route::get('/counseling/sessions/{id}', [CounselingSessionController::class, 'show']);
    Route::post('/counseling/sessions/{id}/messages', [CounselingSessionController::class, 'addMessage']);
    
    // Staff/Admin routes
    Route::middleware('role:staff,admin')->group(function () {
        // Content management
        Route::post('/contents', [ContentController::class, 'store']);
        Route::put('/contents/{id}', [ContentController::class, 'update']);
        Route::delete('/contents/{id}', [ContentController::class, 'destroy']);
        
        // Blog management
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{id}', [BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
        
        // Assessment overview
        Route::get('/assessments', [AssessmentController::class, 'index']);
        Route::get('/assessments/statistics', [AssessmentController::class, 'statistics']);
        
        // Session management
        Route::put('/counseling/sessions/{id}/assign', [CounselingSessionController::class, 'assign']);
        Route::put('/counseling/sessions/{id}/escalate', [CounselingSessionController::class, 'escalate']);
        Route::put('/counseling/sessions/{id}/close', [CounselingSessionController::class, 'close']);
    });
    
    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::post('/users/{id}/ban', [UserController::class, 'ban']);
        Route::post('/users/{id}/unban', [UserController::class, 'unban']);
        
        // Community links management
        Route::post('/community/links', [CommunityLinkController::class, 'store']);
        Route::put('/community/links/{id}', [CommunityLinkController::class, 'update']);
        Route::delete('/community/links/{id}', [CommunityLinkController::class, 'destroy']);
        
        // Admin dashboard
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/statistics', [AdminController::class, 'statistics']);
    });
});
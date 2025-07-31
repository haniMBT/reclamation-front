<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - Authentification EPAL
|--------------------------------------------------------------------------
*/

// Routes publiques (sans authentification)
Route::group(['prefix' => 'api'], function () {
    // Authentification
    Route::post('/login', [AuthController::class, 'login']);
    
    // Mot de passe oublié
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Routes protégées (avec authentification)
Route::group(['prefix' => 'api', 'middleware' => 'auth:sanctum'], function () {
    // Informations utilisateur
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Gestion du profil
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    Route::post('/profile/change-password', [AuthController::class, 'changePassword']);
    
    // Changement de mot de passe avec code email
    Route::post('/profile/request-password-change-code', [AuthController::class, 'requestPasswordChangeCode']);
    Route::post('/profile/change-password-with-code', [AuthController::class, 'changePasswordWithCode']);
    
    // Route pour récupérer les privilèges (compatibilité avec l'existant)
    Route::post('/allPrivileges', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'privileges' => $request->user()->privileges ?? []
        ]);
    });
});
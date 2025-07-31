<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PasswordResetCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\PasswordResetCodeMail;

class AuthController extends Controller
{
    /**
     * Login utilisateur
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données de connexion invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = [
            'email' => $request->Email,
            'password' => $request->password
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'photo' => $user->photo ? asset('storage/photos/' . $user->photo) : null,
                'created_at' => $user->created_at,
            ]
        ]);
    }

    /**
     * Logout utilisateur
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     */
    public function user(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'photo' => $user->photo ? asset('storage/photos/' . $user->photo) : null,
                'created_at' => $user->created_at,
            ]
        ]);
    }

    /**
     * Demande de réinitialisation de mot de passe - Étape 1
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Aucun compte associé à cette adresse email.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email invalide',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Supprimer les anciens codes de cet utilisateur
        PasswordResetCode::where('email', $request->email)->delete();

        // Générer un code à 6 chiffres
        $code = sprintf('%06d', mt_rand(100000, 999999));

        // Sauvegarder le code
        PasswordResetCode::create([
            'email' => $request->email,
            'code' => Hash::make($code),
            'created_at' => Carbon::now()
        ]);

        // Envoyer le code par email
        try {
            Mail::to($request->email)->send(new PasswordResetCodeMail($code, $user->prenom));
            
            return response()->json([
                'status' => 'success',
                'message' => 'Un code de vérification a été envoyé à votre adresse email.',
                'email' => $request->email
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
            ], 500);
        }
    }

    /**
     * Vérification du code et réinitialisation du mot de passe - Étape 2
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.confirmed' => 'Les mots de passe ne correspondent pas.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Trouver le code de réinitialisation
        $passwordReset = PasswordResetCode::where('email', $request->email)
            ->where('created_at', '>=', Carbon::now()->subMinutes(15)) // Code valide 15 minutes
            ->first();

        if (!$passwordReset) {
            return response()->json([
                'status' => 'error',
                'message' => 'Code de vérification expiré ou invalide.'
            ], 400);
        }

        // Vérifier le code
        if (!Hash::check($request->code, $passwordReset->code)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Code de vérification incorrect.'
            ], 400);
        }

        // Mettre à jour le mot de passe
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Supprimer le code utilisé
        PasswordResetCode::where('email', $request->email)->delete();

        // Supprimer tous les tokens existants pour forcer une nouvelle connexion
        $user->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Mot de passe mis à jour avec succès. Veuillez vous reconnecter.'
        ]);
    }

    /**
     * Changer le mot de passe depuis le profil (utilisateur connecté)
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.confirmed' => 'Les mots de passe ne correspondent pas.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Vérifier le mot de passe actuel
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 400);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mot de passe mis à jour avec succès.'
        ]);
    }

    /**
     * Changer le mot de passe depuis le profil avec code email
     */
    public function requestPasswordChangeCode(Request $request)
    {
        $user = $request->user();

        // Supprimer les anciens codes
        PasswordResetCode::where('email', $user->email)->delete();

        // Générer un code
        $code = sprintf('%06d', mt_rand(100000, 999999));

        // Sauvegarder le code
        PasswordResetCode::create([
            'email' => $user->email,
            'code' => Hash::make($code),
            'created_at' => Carbon::now()
        ]);

        // Envoyer le code par email
        try {
            Mail::to($user->email)->send(new PasswordResetCodeMail($code, $user->prenom));
            
            return response()->json([
                'status' => 'success',
                'message' => 'Un code de vérification a été envoyé à votre adresse email.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'envoi de l\'email.'
            ], 500);
        }
    }

    /**
     * Changer le mot de passe avec code de vérification
     */
    public function changePasswordWithCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Vérifier le code
        $passwordReset = PasswordResetCode::where('email', $user->email)
            ->where('created_at', '>=', Carbon::now()->subMinutes(15))
            ->first();

        if (!$passwordReset || !Hash::check($request->code, $passwordReset->code)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Code de vérification invalide ou expiré.'
            ], 400);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Supprimer le code
        PasswordResetCode::where('email', $user->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Mot de passe mis à jour avec succès.'
        ]);
    }

    /**
     * Mettre à jour le profil utilisateur
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['nom', 'prenom']);

        // Gérer l'upload de photo
        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo
            if ($user->photo && file_exists(storage_path('app/public/photos/' . $user->photo))) {
                unlink(storage_path('app/public/photos/' . $user->photo));
            }

            // Sauvegarder la nouvelle photo
            $photo = $request->file('photo');
            $photoName = time() . '_' . $user->id . '.' . $photo->extension();
            $photo->storeAs('photos', $photoName, 'public');
            $updateData['photo'] = $photoName;
        }

        $user->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil mis à jour avec succès.',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'photo' => $user->photo ? asset('storage/photos/' . $user->photo) : null,
            ]
        ]);
    }
}
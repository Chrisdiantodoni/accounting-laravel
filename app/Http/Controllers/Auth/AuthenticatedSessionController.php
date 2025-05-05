<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Flasher\SweetAlert\Prime\SweetAlertInterface;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),

        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $credentials = $request->only('username', 'password');
            $remember = $request->boolean('remember'); // Check if the 'remember' checkbox is checked

            if (Auth::attempt($credentials, $remember)) {
                $user = Auth::user();

                if ($user->status == 0) {
                    Auth::logout(); // Log out the user if their status is inactive
                    $notification = [
                        'message' => 'User ' . $user->name . ' has been deactivated',
                        'alert-type' => 'info'
                    ];
                    return redirect()->route('login')->with($notification);
                } else {
                    $notification = [
                        'type' => 'success',
                        'message' => 'Login successful'
                    ];
                }

                return redirect()->intended(route('dashboard'))->with('message', $notification);
            } else {
                $notification = [
                    'type' => 'error',
                    'message' => 'Invalid username or password'
                ];
            }
        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());

            $notification = [
                'type' => 'error',
                'message' => 'Login failed: ' . $e->getMessage()
            ];
        }

        return redirect()->back()->with('message', $notification);
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

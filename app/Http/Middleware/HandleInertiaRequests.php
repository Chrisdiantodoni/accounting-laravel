<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Permission\Models\Permission;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $sharedData = parent::share($request);

        $authData = [];
        if ($user = $request->user()) {
            // If there is a logged-in user, load relationships
            // $user->load('permissions', 'dealer_users.dealers', 'roles');
            $user->load('permissions', 'roles');
            $authData['user'] = $user;
        } else {
            // If there is no logged-in user, set user data to null
            $authData['user'] = null;
        }

        return array_merge($sharedData, [
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
            ],
            'auth' => $authData,
        ]);
    }
}

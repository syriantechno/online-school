<?php

namespace App\Http\Middleware;

use App\Models\AppNotification;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user()
                    ? $request->user()->only(['id', 'name', 'email', 'role', 'gender', 'stars', 'is_active'])
                    : null,
                'enrolledCourseIds' => fn () => $request->user()
                    ? Enrollment::query()
                        ->where('user_id', $request->user()->id)
                        ->pluck('course_id')
                        ->all()
                    : [],
            ],
            'locale' => app()->getLocale(),
            'appName' => config('app.name'),
            'unreadNotifications' => fn () => $request->user()
                ? AppNotification::query()
                    ->where('user_id', $request->user()->id)
                    ->whereNull('read_at')
                    ->count()
                : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}

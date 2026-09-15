<?php

namespace App\Support;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AuthRedirect
{
    public static function home(User $user): string
    {
        if ($user->isStudent()) {
            return '/';
        }

        return route('dashboard', absolute: false);
    }

    public static function isValidRedirect(?string $url): bool
    {
        if (! $url) {
            return false;
        }

        if (str_starts_with($url, '/') && ! str_starts_with($url, '//')) {
            return true;
        }

        $appHost = parse_url(config('app.url'), PHP_URL_HOST);
        $redirectHost = parse_url($url, PHP_URL_HOST);

        return $appHost && $redirectHost && $appHost === $redirectHost;
    }

    public static function captureIntent(Request $request): void
    {
        if ($request->filled('redirect')) {
            $redirect = $request->string('redirect')->toString();

            if (self::isValidRedirect($redirect)) {
                $request->session()->put('url.intended', $redirect);
            }
        }

        if ($request->filled('enroll_course')) {
            $request->session()->put('enroll_course_id', (int) $request->input('enroll_course'));
        }
    }

    public static function redirectAfterAuth(Request $request, User $user): RedirectResponse
    {
        $courseId = $request->session()->pull('enroll_course_id');

        if ($courseId && ($user->isStudent() || $user->isAdmin())) {
            $course = Course::query()->find($courseId);

            if ($course && ($course->is_published || $user->isAdmin())) {
                self::enrollUser($user, $course);

                return redirect()
                    ->route('explore.show', $course->slug)
                    ->with('success', 'تم التسجيل في الدورة بنجاح.');
            }
        }

        return redirect()->intended(self::home($user));
    }

    public static function enrollUser(User $user, Course $course): Enrollment
    {
        return Enrollment::query()->firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'status' => 'active',
                'progress_percent' => 0,
                'enrolled_at' => now(),
            ]
        );
    }
}

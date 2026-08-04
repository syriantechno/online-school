<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);
        abort_unless($course->is_published || $user->isAdmin(), 403);

        $studentId = $user->isAdmin() && $request->filled('user_id')
            ? (int) $request->validate(['user_id' => ['required', 'exists:users,id']])['user_id']
            : $user->id;

        Enrollment::query()->firstOrCreate(
            [
                'user_id' => $studentId,
                'course_id' => $course->id,
            ],
            [
                'status' => 'active',
                'progress_percent' => 0,
                'enrolled_at' => now(),
            ]
        );

        return back()->with('success', 'تم التسجيل في الدورة بنجاح.');
    }

    public function destroy(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        $enrollment = Enrollment::query()
            ->where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        abort_unless($user->isStudent() || $user->isAdmin(), 403);

        $enrollment->delete();

        return back()->with('success', 'تم إلغاء التسجيل من الدورة.');
    }
}

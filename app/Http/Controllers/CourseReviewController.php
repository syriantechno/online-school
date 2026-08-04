<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseReview;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CourseReviewController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent(), 403);
        abort_unless(
            Enrollment::query()->where('user_id', $user->id)->where('course_id', $course->id)->exists(),
            403
        );

        $data = $request->validate([
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        CourseReview::query()->updateOrCreate(
            [
                'course_id' => $course->id,
                'user_id' => $user->id,
            ],
            [
                'stars' => $data['stars'],
                'comment' => $data['comment'] ?? null,
            ]
        );

        return back()->with('success', 'شكراً لتقييمك الدورة.');
    }
}

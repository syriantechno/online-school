<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsLessonShowResponse;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Support\CourseLessonProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicLessonController extends Controller
{
    use BuildsLessonShowResponse;

    public function show(Request $request, Course $course, Lesson $lesson): Response|RedirectResponse
    {
        abort_unless($course->is_published && $lesson->is_published, 404);
        abort_unless($lesson->course_id === $course->id, 404);

        $user = $request->user();

        $isEnrolled = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        $canBypassLocks = $user->isAdmin() || ($user->isTeacher() && $course->teacher_id === $user->id);

        if ($user->isStudent()) {
            if (! $isEnrolled) {
                return redirect()
                    ->route('explore.show', $course->slug)
                    ->with('error', 'سجّل في الدورة أولاً للوصول للدرس.');
            }

            if (! CourseLessonProgress::isLessonUnlocked($lesson, $user->id)) {
                return redirect()
                    ->route('explore.show', $course->slug)
                    ->with('error', 'أكمل الدرس السابق أولاً ثم تابع.');
            }
        } elseif (! $canBypassLocks) {
            abort(403);
        }

        $lessonPath = $this->lessonPathForCourse(
            $request,
            $course,
            $isEnrolled || $canBypassLocks,
            ! $canBypassLocks
        );

        return Inertia::render('Lessons/Show', [
            ...$this->lessonShowData($request, $lesson),
            'publicMode' => true,
            'courseSlug' => $course->slug,
            'lessonPath' => $lessonPath,
            'nextLessonId' => CourseLessonProgress::nextPlayableLessonId($lessonPath),
        ]);
    }

    private function lessonPathForCourse(
        Request $request,
        Course $course,
        bool $canAccessLessons,
        bool $sequentialLock = true,
    ): array {
        $lessons = $course->lessons()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'duration_minutes', 'sort_order', 'is_interactive', 'stars_reward']);

        $completedIds = $canAccessLessons
            ? CourseLessonProgress::completedIds($request->user()->id, $course->id)
            : [];

        return CourseLessonProgress::lessonsWithStatus($lessons, $completedIds, $canAccessLessons, $sequentialLock);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Support\CourseLessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicCourseController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = Course::query()
            ->with('teacher:id,name')
            ->withCount(['lessons' => fn ($q) => $q->where('is_published', true)])
            ->withSum(['lessons as total_minutes' => fn ($q) => $q->where('is_published', true)], 'duration_minutes')
            ->where('is_published', true)
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->level, fn ($q, $level) => $q->where('level', $level))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Explore/Index', [
            'courses' => $courses,
            'filters' => $request->only('search', 'level'),
        ]);
    }

    public function show(Request $request, Course $course): Response
    {
        abort_unless($course->is_published, 404);

        $user = $request->user();

        $course->load([
            'teacher:id,name',
            'lessons' => fn ($query) => $query
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug', 'course_id', 'duration_minutes', 'sort_order', 'is_interactive', 'stars_reward']),
        ]);

        $isEnrolled = $user
            ? Enrollment::query()->where('user_id', $user->id)->where('course_id', $course->id)->exists()
            : false;

        $enrollment = $isEnrolled && $user
            ? Enrollment::query()->where('user_id', $user->id)->where('course_id', $course->id)->first()
            : null;

        $completedIds = $user && $isEnrolled
            ? CourseLessonProgress::completedIds($user->id, $course->id)
            : [];

        $lessonPath = CourseLessonProgress::lessonsWithStatus($course->lessons, $completedIds, $isEnrolled);

        return Inertia::render('Public/Explore/Show', [
            'course' => $course,
            'lessonPath' => $lessonPath,
            'nextLessonId' => $isEnrolled ? CourseLessonProgress::nextPlayableLessonId($lessonPath) : null,
            'stats' => [
                'lessons_count' => $course->lessons->count(),
                'total_minutes' => (int) $course->lessons->sum('duration_minutes'),
                'students_count' => $course->enrollments()->count(),
            ],
            'isEnrolled' => $isEnrolled,
            'enrollment' => $enrollment,
            'canEnroll' => $user?->isStudent() || $user?->isAdmin(),
        ]);
    }
}

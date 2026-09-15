<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);

        if ($user->isAdmin()) {
            return redirect()->route('dashboard');
        }

        $stats = [
            ['label' => 'دوراتي', 'value' => Enrollment::where('user_id', $user->id)->count()],
            ['label' => 'التقدّم', 'value' => (int) round(Enrollment::where('user_id', $user->id)->avg('progress_percent') ?? 0).'%'],
            ['label' => 'نجومي', 'value' => $user->stars],
            ['label' => 'دروس مكتملة', 'value' => $user->lessonCompletions()->count()],
        ];

        $recentCourses = Course::query()
            ->with('teacher:id,name')
            ->whereHas('enrollments', fn ($e) => $e->where('user_id', $user->id))
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'subject', 'level', 'teacher_id']);

        $announcements = Announcement::query()
            ->where('is_published', true)
            ->where(function ($q) use ($user) {
                $q->whereNull('course_id')
                    ->orWhereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id));
            })
            ->latest('published_at')
            ->take(5)
            ->get(['id', 'title', 'body']);

        $enrollments = Enrollment::query()
            ->with('course:id,title,slug')
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Public/StudentProfile', [
            'stats' => $stats,
            'recentCourses' => $recentCourses,
            'announcements' => $announcements,
            'enrollments' => $enrollments,
        ]);
    }
}

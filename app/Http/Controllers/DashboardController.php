<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Book;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response|\Illuminate\Http\RedirectResponse
    {
        $user = auth()->user();

        if ($user->isStudent()) {
            return redirect()->route('student.profile');
        }

        $stats = match (true) {
            $user->isAdmin() => [
                ['label' => 'المستخدمون', 'value' => User::count()],
                ['label' => 'الدورات', 'value' => Course::count()],
                ['label' => 'الدروس', 'value' => Lesson::count()],
                ['label' => 'الكتب', 'value' => Book::count()],
            ],
            $user->isTeacher() => [
                ['label' => 'دوراتي', 'value' => Course::where('teacher_id', $user->id)->count()],
                ['label' => 'الدروس', 'value' => Lesson::whereHas('course', fn ($q) => $q->where('teacher_id', $user->id))->count()],
                ['label' => 'الطلاب', 'value' => Enrollment::whereHas('course', fn ($q) => $q->where('teacher_id', $user->id))->distinct('user_id')->count('user_id')],
                ['label' => 'الكتب', 'value' => Book::where('uploaded_by', $user->id)->count()],
            ],
            $user->isParent() => [
                ['label' => 'أبنائي', 'value' => $user->children()->count()],
                ['label' => 'نجومهم', 'value' => (int) $user->children()->sum('stars')],
                ['label' => 'تسجيلاتهم', 'value' => Enrollment::whereIn('user_id', $user->children()->pluck('users.id'))->count()],
                ['label' => 'إعلانات', 'value' => Announcement::where('is_published', true)->count()],
            ],
            default => [
                ['label' => 'دوراتي', 'value' => Enrollment::where('user_id', $user->id)->count()],
                ['label' => 'التقدّم', 'value' => (int) round(Enrollment::where('user_id', $user->id)->avg('progress_percent') ?? 0).'%'],
                ['label' => 'نجومي', 'value' => $user->stars],
                ['label' => 'دروس مكتملة', 'value' => $user->lessonCompletions()->count()],
            ],
        };

        $recentCourses = Course::query()
            ->with('teacher:id,name')
            ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
            ->when($user->isStudent(), function ($q) use ($user) {
                $q->whereHas('enrollments', fn ($e) => $e->where('user_id', $user->id));
            })
            ->when($user->isParent(), function ($q) use ($user) {
                $childIds = $user->children()->pluck('users.id');
                $q->whereHas('enrollments', fn ($e) => $e->whereIn('user_id', $childIds));
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'subject', 'level', 'is_published', 'teacher_id', 'created_at']);

        $announcements = Announcement::query()
            ->with(['author:id,name', 'course:id,title'])
            ->where('is_published', true)
            ->when($user->isStudent(), function ($q) use ($user) {
                $q->where(function ($inner) use ($user) {
                    $inner->whereNull('course_id')
                        ->orWhereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id));
                });
            })
            ->latest('published_at')
            ->take(5)
            ->get();

        $enrollments = $user->isStudent()
            ? Enrollment::query()
                ->with('course:id,title')
                ->where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get()
            : collect();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentCourses' => $recentCourses,
            'announcements' => $announcements,
            'enrollments' => $enrollments,
            'roleLabel' => match ($user->role) {
                User::ROLE_ADMIN => 'مدير',
                User::ROLE_TEACHER => 'معلم',
                User::ROLE_PARENT => 'ولي أمر',
                default => 'طالب',
            },
        ]);
    }
}

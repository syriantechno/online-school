<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyLearningController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);

        $studentId = $user->isStudent() ? $user->id : $user->id;

        $enrollments = Enrollment::query()
            ->with([
                'course:id,title,subject,level,teacher_id',
                'course.teacher:id,name',
                'course.lessons' => fn ($q) => $q->where('is_published', true)->orderBy('sort_order'),
            ])
            ->where('user_id', $studentId)
            ->latest()
            ->get();

        $completedLessonIds = LessonCompletion::query()
            ->where('user_id', $studentId)
            ->pluck('lesson_id')
            ->all();

        $continueItems = $enrollments->map(function (Enrollment $enrollment) use ($completedLessonIds) {
            $nextLesson = $enrollment->course?->lessons
                ?->first(fn (Lesson $lesson) => ! in_array($lesson->id, $completedLessonIds, true));

            return [
                'enrollment' => [
                    'id' => $enrollment->id,
                    'progress_percent' => $enrollment->progress_percent,
                    'status' => $enrollment->status,
                ],
                'course' => $enrollment->course,
                'next_lesson' => $nextLesson ? [
                    'id' => $nextLesson->id,
                    'title' => $nextLesson->title,
                ] : null,
            ];
        });

        $pendingAssignments = Assignment::query()
            ->with('course:id,title')
            ->where('is_published', true)
            ->whereHas('course.enrollments', fn ($e) => $e->where('user_id', $studentId))
            ->whereDoesntHave('submissions', fn ($s) => $s->where('user_id', $studentId))
            ->latest()
            ->take(5)
            ->get();

        $pendingExams = \App\Models\Exam::query()
            ->with('course:id,title')
            ->withCount('questions')
            ->where('is_published', true)
            ->whereHas('course.enrollments', fn ($e) => $e->where('user_id', $studentId))
            ->whereDoesntHave('attempts', fn ($a) => $a->where('user_id', $studentId)->whereIn('status', ['submitted', 'graded']))
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Learning/MyLearning', [
            'continueItems' => $continueItems,
            'pendingAssignments' => $pendingAssignments,
            'pendingExams' => $pendingExams,
            'stats' => [
                'courses' => $enrollments->count(),
                'completed' => $enrollments->where('status', 'completed')->count(),
                'avg_progress' => (int) round($enrollments->avg('progress_percent') ?? 0),
            ],
        ]);
    }
}

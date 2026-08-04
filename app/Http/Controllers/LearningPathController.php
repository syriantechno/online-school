<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** مسار التعلم داخل دورة واحدة — ترتيب الدروس مع حالة الإكمال */
class LearningPathController extends Controller
{
    public function __invoke(Request $request, Course $course): Response
    {
        $user = $request->user();
        $course->load(['teacher:id,name', 'lessons' => fn ($q) => $q->where('is_published', true)->orderBy('sort_order')]);

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        $completedIds = LessonCompletion::query()
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->pluck('lesson_id')
            ->all();

        $steps = $course->lessons->values()->map(function (Lesson $lesson, int $index) use ($completedIds) {
            $done = in_array($lesson->id, $completedIds, true);

            return [
                'order' => $index + 1,
                'lesson' => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'duration_minutes' => $lesson->duration_minutes,
                    'is_interactive' => $lesson->is_interactive,
                    'stars_reward' => $lesson->stars_reward,
                ],
                'completed' => $done,
                'locked' => false,
            ];
        });

        return Inertia::render('Learning/Path', [
            'course' => $course,
            'enrollment' => $enrollment,
            'steps' => $steps,
            'completedCount' => count($completedIds),
            'totalCount' => $course->lessons->count(),
        ]);
    }
}

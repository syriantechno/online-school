<?php

namespace App\Support;

use App\Models\Lesson;
use App\Models\LessonCompletion;
use Illuminate\Support\Collection;

class CourseLessonProgress
{
    public static function completedIds(int $userId, int $courseId): array
    {
        return LessonCompletion::query()
            ->where('user_id', $userId)
            ->whereHas('lesson', fn ($query) => $query
                ->where('course_id', $courseId)
                ->where('is_published', true))
            ->pluck('lesson_id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    /**
     * @param  Collection<int, Lesson>  $lessons
     * @return array<int, array<string, mixed>>
     */
    public static function lessonsWithStatus(Collection $lessons, array $completedIds, bool $isEnrolled, bool $sequentialLock = true): array
    {
        $ordered = $lessons->values();

        return $ordered->map(function (Lesson $lesson, int $index) use ($ordered, $completedIds, $isEnrolled, $sequentialLock) {
            $completed = in_array($lesson->id, $completedIds, true);
            $previous = $index > 0 ? $ordered[$index - 1] : null;
            $previousCompleted = $previous === null || in_array($previous->id, $completedIds, true);
            $unlocked = $isEnrolled && (! $sequentialLock || $index === 0 || $previousCompleted);

            return [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'slug' => $lesson->slug,
                'duration_minutes' => $lesson->duration_minutes,
                'sort_order' => $lesson->sort_order,
                'is_interactive' => $lesson->is_interactive,
                'stars_reward' => $lesson->stars_reward,
                'index' => $index + 1,
                'completed' => $completed,
                'unlocked' => $unlocked,
                'locked' => $isEnrolled && ! $unlocked,
            ];
        })->all();
    }

    public static function isLessonUnlocked(Lesson $lesson, int $userId): bool
    {
        $lessonIds = Lesson::query()
            ->where('course_id', $lesson->course_id)
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->pluck('id')
            ->values();

        $index = $lessonIds->search($lesson->id);

        if ($index === false) {
            return false;
        }

        if ($index === 0) {
            return true;
        }

        $previousId = (int) $lessonIds[$index - 1];

        return LessonCompletion::query()
            ->where('user_id', $userId)
            ->where('lesson_id', $previousId)
            ->exists();
    }

    /**
     * @param  array<int, array<string, mixed>>  $lessonsWithStatus
     */
    public static function nextPlayableLessonId(array $lessonsWithStatus): ?int
    {
        foreach ($lessonsWithStatus as $lesson) {
            if ($lesson['unlocked'] && ! $lesson['completed']) {
                return $lesson['id'];
            }
        }

        return null;
    }
}

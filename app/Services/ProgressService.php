<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;

class ProgressService
{
    public function __construct(
        private CertificateService $certificates,
    ) {}

    public function recalculate(Enrollment $enrollment): Enrollment
    {
        $total = Lesson::query()
            ->where('course_id', $enrollment->course_id)
            ->where('is_published', true)
            ->count();

        if ($total === 0) {
            $enrollment->update([
                'progress_percent' => 0,
                'completed_at' => null,
                'status' => 'active',
            ]);

            return $enrollment->fresh();
        }

        $done = LessonCompletion::query()
            ->where('user_id', $enrollment->user_id)
            ->whereHas('lesson', fn ($q) => $q->where('course_id', $enrollment->course_id)->where('is_published', true))
            ->count();

        $percent = (int) round(($done / $total) * 100);
        $completed = $percent >= 100;

        $enrollment->update([
            'progress_percent' => min(100, $percent),
            'completed_at' => $completed ? ($enrollment->completed_at ?? now()) : null,
            'status' => $completed ? 'completed' : 'active',
        ]);

        $enrollment = $enrollment->fresh(['course']);

        if ($completed) {
            $this->certificates->issueIfEligible($enrollment);
        }

        return $enrollment;
    }
}

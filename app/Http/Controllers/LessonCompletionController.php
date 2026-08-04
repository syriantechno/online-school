<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonCompletion;
use App\Services\ProgressService;
use App\Services\StarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LessonCompletionController extends Controller
{
    public function store(
        Request $request,
        Lesson $lesson,
        StarService $stars,
        ProgressService $progress
    ): RedirectResponse {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);
        abort_unless($lesson->is_published || $user->isAdmin() || $user->isTeacher(), 403);

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->first();

        // Soft gate: students should be enrolled (admins bypass)
        if ($user->isStudent() && ! $enrollment) {
            return back()->with('error', 'يجب التسجيل في الدورة أولاً لإكمال الدرس.');
        }

        $data = $request->validate([
            'score' => ['nullable', 'integer', 'min:0'],
            'total' => ['nullable', 'integer', 'min:1'],
        ]);

        $hasQuiz = $lesson->is_interactive && ! empty($lesson->interactive_payload['questions']);

        if ($hasQuiz) {
            $score = (int) ($data['score'] ?? 0);
            $total = (int) ($data['total'] ?? 1);
            if (($score / max(1, $total)) < 0.5) {
                return back()->with('error', 'يلزم الإجابة على نصف الأسئلة على الأقل لإكمال الدرس.');
            }
        } else {
            $score = $data['score'] ?? null;
            $total = $data['total'] ?? null;
        }

        $already = LessonCompletion::query()
            ->where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->exists();

        LessonCompletion::query()->updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'score' => $score,
                'total' => $total,
                'completed_at' => now(),
            ]
        );

        $message = 'تم تسجيل إكمال الدرس.';

        if (! $already && ! $stars->alreadyAwarded($user, $lesson, 'quiz_lesson')) {
            $reward = (int) ($lesson->stars_reward ?: 2);
            $stars->award($user, $reward, 'quiz_lesson', $lesson, 'إكمال درس: '.$lesson->title);
            $message = "أحسنت! أكملت الدرس وحصلت على {$reward} نجوم.";
        } elseif ($already) {
            $message = 'سبق وأكملت هذا الدرس.';
        }

        if ($enrollment) {
            $progress->recalculate($enrollment);
        }

        return back()->with('success', $message);
    }
}

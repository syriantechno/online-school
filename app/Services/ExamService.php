<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\ExamAnswer;
use App\Models\ExamAttempt;
use App\Models\ExamQuestion;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ExamService
{
    public function __construct(
        private StarService $stars,
        private NotificationService $notifications,
    ) {}

    public function startAttempt(Exam $exam, User $user): ExamAttempt
    {
        $used = $exam->attempts()->where('user_id', $user->id)->count();
        abort_unless($used < $exam->max_attempts, 403, 'استنفدت عدد المحاولات المسموح.');

        $open = $exam->attempts()
            ->where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->first();

        if ($open) {
            return $open;
        }

        return ExamAttempt::query()->create([
            'exam_id' => $exam->id,
            'user_id' => $user->id,
            'attempt_number' => $used + 1,
            'status' => 'in_progress',
            'started_at' => now(),
            'max_score' => $exam->totalPoints(),
        ]);
    }

    public function submitAttempt(ExamAttempt $attempt, array $answers): ExamAttempt
    {
        return DB::transaction(function () use ($attempt, $answers) {
            $attempt->loadMissing(['exam.questions', 'user']);
            $exam = $attempt->exam;
            $questions = $exam->questions;
            $score = 0.0;
            $max = (float) $questions->sum('points');
            $needsManual = false;

            foreach ($questions as $question) {
                $raw = $answers[(string) $question->id] ?? $answers[$question->id] ?? null;
                $normalized = $this->normalizeAnswer($question, $raw);
                $graded = $question->grade($normalized);

                if ($question->type === ExamQuestion::TYPE_SHORT) {
                    $needsManual = true;
                }

                ExamAnswer::query()->updateOrCreate(
                    [
                        'exam_attempt_id' => $attempt->id,
                        'exam_question_id' => $question->id,
                    ],
                    [
                        'answer' => $normalized,
                        'is_correct' => $graded['is_correct'],
                        'points_earned' => $graded['points_earned'],
                    ]
                );

                $score += $graded['points_earned'];
            }

            $percent = $max > 0 ? round(($score / $max) * 100, 2) : 0;
            $passed = $percent >= $exam->pass_percent;

            $attempt->update([
                'score' => $score,
                'max_score' => $max,
                'percent' => $percent,
                'passed' => $passed,
                'status' => $needsManual ? 'submitted' : 'graded',
                'submitted_at' => now(),
            ]);

            if ($passed && ! $needsManual) {
                $this->awardStars($attempt);
            }

            if (! $needsManual) {
                $this->notifyResult($attempt->fresh(['exam', 'user']));
            }

            return $attempt->fresh(['answers.question', 'exam']);
        });
    }

    public function gradeShortAnswer(ExamAnswer $answer, float $points, ?bool $isCorrect, ?string $feedback = null): ExamAttempt
    {
        return DB::transaction(function () use ($answer, $points, $isCorrect, $feedback) {
            $answer->loadMissing('attempt.exam.questions', 'attempt.user', 'question');
            $wasGraded = $answer->attempt->status === 'graded';
            $maxPoints = (float) $answer->question->points;
            $points = max(0, min($points, $maxPoints));

            $answer->update([
                'points_earned' => $points,
                'is_correct' => $isCorrect ?? ($points >= $maxPoints),
                'teacher_feedback' => $feedback,
            ]);

            $attempt = $answer->attempt->fresh(['answers', 'exam']);
            $score = (float) $attempt->answers()->sum('points_earned');
            $max = (float) $attempt->exam->questions()->sum('points');
            $percent = $max > 0 ? round(($score / $max) * 100, 2) : 0;
            $passed = $percent >= $attempt->exam->pass_percent;
            $stillPending = $attempt->answers()
                ->whereHas('question', fn ($q) => $q->where('type', ExamQuestion::TYPE_SHORT))
                ->whereNull('is_correct')
                ->exists();

            $attempt->update([
                'score' => $score,
                'max_score' => $max,
                'percent' => $percent,
                'passed' => $passed,
                'status' => $stillPending ? 'submitted' : 'graded',
            ]);

            if ($passed && ! $stillPending) {
                $this->awardStars($attempt->fresh());
            }

            if (! $stillPending && ! $wasGraded) {
                $this->notifyResult($attempt->fresh(['exam', 'user']));
            }

            return $attempt->fresh(['answers.question', 'exam', 'user']);
        });
    }

    private function awardStars(ExamAttempt $attempt): void
    {
        $exam = $attempt->exam;
        $user = $attempt->user;
        $reward = (int) ($exam->stars_reward ?: 0);

        if ($reward <= 0) {
            return;
        }

        if ($this->stars->alreadyAwarded($user, $attempt, 'exam_pass')) {
            return;
        }

        $this->stars->award($user, $reward, 'exam_pass', $attempt, 'نجاح في فحص: '.$exam->title);
    }

    private function notifyResult(ExamAttempt $attempt): void
    {
        $this->notifications->send(
            $attempt->user,
            'exam_result',
            'نتيجة الفحص: '.$attempt->exam->title,
            $attempt->passed
                ? "نجحت بنسبة {$attempt->percent}%"
                : "حصلت على {$attempt->percent}% (درجة النجاح {$attempt->exam->pass_percent}%)",
            route('exams.result', [$attempt->exam_id, $attempt->id])
        );
    }

    private function normalizeAnswer(ExamQuestion $question, mixed $raw): array
    {
        if ($raw === null || $raw === '') {
            return [];
        }

        if ($question->type === ExamQuestion::TYPE_MULTIPLE) {
            return collect(is_array($raw) ? $raw : [$raw])->map(fn ($v) => (string) $v)->values()->all();
        }

        if ($question->type === ExamQuestion::TYPE_SHORT) {
            return [(string) (is_array($raw) ? ($raw[0] ?? '') : $raw)];
        }

        return [(string) (is_array($raw) ? ($raw[0] ?? '') : $raw)];
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAnswer;
use App\Models\ExamAttempt;
use App\Services\ExamService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamAttemptController extends Controller
{
    public function start(Request $request, Exam $exam, ExamService $exams): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isStudent() || $user->isAdmin(), 403);
        abort_unless($exam->isAvailable() || $user->isAdmin(), 403);
        abort_unless($exam->questions()->exists(), 422, 'لا توجد أسئلة في هذا الفحص.');

        if ($user->isStudent()) {
            abort_unless(
                Enrollment::query()->where('user_id', $user->id)->where('course_id', $exam->course_id)->exists(),
                403
            );
        }

        $attempt = $exams->startAttempt($exam, $user);

        return redirect()->route('exams.take', [$exam->id, $attempt->id]);
    }

    public function take(Request $request, Exam $exam, ExamAttempt $attempt): Response|RedirectResponse
    {
        abort_unless($attempt->exam_id === $exam->id, 404);
        abort_unless($attempt->user_id === $request->user()->id || $this->canManage($request, $exam), 403);

        if ($attempt->status !== 'in_progress') {
            return redirect()->route('exams.result', [$exam->id, $attempt->id]);
        }

        $exam->loadMissing('course:id,teacher_id');

        $expiresAt = null;
        if ($attempt->started_at && $exam->duration_minutes) {
            $expiresAt = $attempt->started_at->copy()->addMinutes($exam->duration_minutes);
        }
        if ($expiresAt && now()->greaterThan($expiresAt)) {
            app(ExamService::class)->submitAttempt($attempt, []);

            return redirect()->route('exams.result', [$exam->id, $attempt->id])
                ->with('success', 'انتهى الوقت وتم تسليم الفحص تلقائياً.');
        }

        $exam->load('questions');
        $questions = $exam->questions->map(function ($q) {
            return [
                'id' => $q->id,
                'type' => $q->type,
                'prompt' => $q->prompt,
                'options' => $q->options,
                'points' => $q->points,
            ];
        });

        if ($exam->shuffle_questions) {
            $questions = $questions->shuffle()->values();
        }

        return Inertia::render('Exams/Take', [
            'exam' => $exam->only([
                'id', 'title', 'duration_minutes', 'pass_percent', 'show_correct_answers',
            ]),
            'attempt' => $attempt->only(['id', 'attempt_number', 'started_at', 'status']),
            'questions' => $questions,
            'expiresAt' => $expiresAt?->toIso8601String(),
            'serverNow' => now()->toIso8601String(),
        ]);
    }

    public function submit(Request $request, Exam $exam, ExamAttempt $attempt, ExamService $exams): RedirectResponse
    {
        abort_unless($attempt->exam_id === $exam->id, 404);
        abort_unless($attempt->user_id === $request->user()->id, 403);
        abort_unless($attempt->status === 'in_progress', 422);

        $data = $request->validate([
            'answers' => ['nullable', 'array'],
        ]);

        $exams->submitAttempt($attempt, $data['answers'] ?? []);

        return redirect()->route('exams.result', [$exam->id, $attempt->id])
            ->with('success', 'تم تسليم الفحص.');
    }

    public function result(Request $request, Exam $exam, ExamAttempt $attempt): Response
    {
        abort_unless($attempt->exam_id === $exam->id, 404);
        $canManage = $this->canManage($request, $exam);
        abort_unless($attempt->user_id === $request->user()->id || $canManage, 403);
        abort_unless($attempt->status !== 'in_progress', 404);

        $attempt->load(['answers.question', 'user:id,name', 'exam']);

        $showAnswers = $canManage || $exam->show_correct_answers;

        $details = $attempt->answers->map(function (ExamAnswer $answer) use ($showAnswers, $canManage) {
            $q = $answer->question;

            return [
                'id' => $answer->id,
                'question_id' => $q->id,
                'type' => $q->type,
                'prompt' => $q->prompt,
                'options' => $q->options,
                'points' => $q->points,
                'answer' => $answer->answer,
                'is_correct' => $answer->is_correct,
                'points_earned' => $answer->points_earned,
                'teacher_feedback' => $answer->teacher_feedback,
                'correct_answers' => ($showAnswers || $canManage) ? $q->correct_answers : null,
                'explanation' => ($showAnswers || $canManage) ? $q->explanation : null,
            ];
        });

        return Inertia::render('Exams/Result', [
            'exam' => $exam->only(['id', 'title', 'pass_percent', 'stars_reward', 'show_correct_answers']),
            'attempt' => $attempt->only([
                'id', 'attempt_number', 'status', 'score', 'max_score', 'percent', 'passed', 'submitted_at',
            ]),
            'student' => $attempt->user,
            'details' => $details,
            'canManage' => $canManage,
        ]);
    }

    public function gradeAnswer(Request $request, Exam $exam, ExamAttempt $attempt, ExamAnswer $answer, ExamService $exams): RedirectResponse
    {
        abort_unless($this->canManage($request, $exam), 403);
        abort_unless($attempt->exam_id === $exam->id && $answer->exam_attempt_id === $attempt->id, 404);

        $data = $request->validate([
            'points_earned' => ['required', 'numeric', 'min:0'],
            'is_correct' => ['nullable', 'boolean'],
            'teacher_feedback' => ['nullable', 'string', 'max:1000'],
        ]);

        $exams->gradeShortAnswer(
            $answer,
            (float) $data['points_earned'],
            array_key_exists('is_correct', $data) ? (bool) $data['is_correct'] : null,
            $data['teacher_feedback'] ?? null,
        );

        return back()->with('success', 'تم تصحيح الإجابة.');
    }

    private function canManage(Request $request, Exam $exam): bool
    {
        $user = $request->user();
        $exam->loadMissing('course:id,teacher_id');

        return $user->isAdmin()
            || ($user->isTeacher() && ($exam->created_by === $user->id || $exam->course?->teacher_id === $user->id));
    }
}

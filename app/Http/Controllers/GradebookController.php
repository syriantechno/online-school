<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GradebookController extends Controller
{
    public function __invoke(Request $request, Course $course): Response
    {
        $user = $request->user();
        abort_unless(
            $user->isAdmin() || ($user->isTeacher() && $course->teacher_id === $user->id),
            403
        );

        $assignments = Assignment::query()
            ->where('course_id', $course->id)
            ->orderBy('due_at')
            ->orderBy('id')
            ->get(['id', 'title', 'max_score', 'due_at']);

        $exams = Exam::query()
            ->where('course_id', $course->id)
            ->orderBy('id')
            ->get(['id', 'title', 'pass_percent']);

        $enrollments = Enrollment::query()
            ->with('user:id,name,email,stars')
            ->where('course_id', $course->id)
            ->orderBy('id')
            ->get();

        $submissions = AssignmentSubmission::query()
            ->whereIn('assignment_id', $assignments->pluck('id'))
            ->whereIn('user_id', $enrollments->pluck('user_id'))
            ->get()
            ->groupBy('user_id');

        $examAttempts = ExamAttempt::query()
            ->whereIn('exam_id', $exams->pluck('id'))
            ->whereIn('user_id', $enrollments->pluck('user_id'))
            ->whereIn('status', ['submitted', 'graded'])
            ->get()
            ->groupBy('user_id');

        $rows = $enrollments->map(function (Enrollment $enrollment) use ($assignments, $submissions, $exams, $examAttempts) {
            $byAssignment = ($submissions->get($enrollment->user_id) ?? collect())->keyBy('assignment_id');
            $userExamAttempts = $examAttempts->get($enrollment->user_id) ?? collect();

            $scores = $assignments->map(function (Assignment $assignment) use ($byAssignment) {
                $sub = $byAssignment->get($assignment->id);

                return [
                    'assignment_id' => $assignment->id,
                    'status' => $sub?->status ?? 'missing',
                    'score' => $sub?->score,
                    'max_score' => $assignment->max_score ?? 100,
                ];
            });

            $examScores = $exams->map(function (Exam $exam) use ($userExamAttempts) {
                $best = $userExamAttempts
                    ->where('exam_id', $exam->id)
                    ->sortByDesc('percent')
                    ->first();

                return [
                    'exam_id' => $exam->id,
                    'percent' => $best?->percent,
                    'passed' => $best?->passed,
                    'status' => $best?->status ?? 'missing',
                ];
            });

            $graded = $scores->filter(fn ($s) => $s['score'] !== null);
            $examGraded = $examScores->filter(fn ($s) => $s['percent'] !== null);
            $assignmentAvg = $graded->isEmpty()
                ? null
                : $graded->avg(fn ($s) => ($s['score'] / max(1, $s['max_score'])) * 100);
            $examAvg = $examGraded->isEmpty() ? null : $examGraded->avg('percent');

            $parts = collect([$assignmentAvg, $examAvg])->filter(fn ($v) => $v !== null);
            $average = $parts->isEmpty() ? null : round($parts->avg(), 1);

            return [
                'user' => $enrollment->user,
                'progress_percent' => $enrollment->progress_percent,
                'status' => $enrollment->status,
                'scores' => $scores->values(),
                'examScores' => $examScores->values(),
                'average' => $average,
            ];
        });

        return Inertia::render('Gradebook/Show', [
            'course' => $course->only(['id', 'title']),
            'assignments' => $assignments,
            'exams' => $exams,
            'rows' => $rows,
            'stats' => [
                'students' => $rows->count(),
                'assignments' => $assignments->count(),
                'exams' => $exams->count(),
                'avgProgress' => (int) round($enrollments->avg('progress_percent') ?? 0),
                'avgGrade' => $rows->whereNotNull('average')->avg('average')
                    ? round($rows->whereNotNull('average')->avg('average'), 1)
                    : null,
            ],
        ]);
    }
}

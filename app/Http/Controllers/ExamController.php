<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamQuestion;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $exams = Exam::query()
            ->with(['course:id,title', 'creator:id,name'])
            ->withCount(['questions', 'attempts'])
            ->when($user->isTeacher(), function ($q) use ($user) {
                $q->where(function ($inner) use ($user) {
                    $inner->where('created_by', $user->id)
                        ->orWhereHas('course', fn ($c) => $c->where('teacher_id', $user->id));
                });
            })
            ->when($user->isStudent(), function ($q) use ($user) {
                $q->where('is_published', true)
                    ->whereHas('course.enrollments', fn ($e) => $e->where('user_id', $user->id));
            })
            ->latest()
            ->paginate(12);

        $myAttempts = $user->isStudent()
            ? ExamAttempt::query()
                ->where('user_id', $user->id)
                ->latest('id')
                ->get()
                ->groupBy('exam_id')
                ->map(fn ($group) => $group->first())
            : collect();

        return Inertia::render('Exams/Index', [
            'exams' => $exams,
            'myAttempts' => $myAttempts,
            'canManage' => $user->isAdmin() || $user->isTeacher(),
            'courses' => ($user->isAdmin() || $user->isTeacher())
                ? Course::query()
                    ->when($user->isTeacher(), fn ($q) => $q->where('teacher_id', $user->id))
                    ->orderBy('title')
                    ->get(['id', 'title'])
                : [],
        ]);
    }

    public function store(Request $request, NotificationService $notifications): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isTeacher(), 403);

        $data = $this->validatedExam($request);
        $this->assertCourseAccess($request, (int) $data['course_id']);

        $exam = Exam::query()->create([
            ...$data,
            'created_by' => $request->user()->id,
            'is_published' => $data['is_published'] ?? false,
        ]);

        if ($exam->is_published) {
            $students = Enrollment::query()
                ->with('user')
                ->where('course_id', $exam->course_id)
                ->get()
                ->pluck('user')
                ->filter();

            $notifications->sendMany(
                $students,
                'exam_published',
                'فحص جديد: '.$exam->title,
                'تم نشر فحص جديد في دورتك.',
                route('exams.show', $exam->id)
            );
        }

        return redirect()->route('exams.show', $exam->id)->with('success', 'تم إنشاء الفحص. أضف الأسئلة الآن.');
    }

    public function show(Request $request, Exam $exam): Response
    {
        $user = $request->user();
        $canManage = $this->canManage($user, $exam);

        if (! $canManage) {
            abort_unless($exam->is_published, 404);
            abort_unless(
                Enrollment::query()->where('user_id', $user->id)->where('course_id', $exam->course_id)->exists(),
                403
            );
        }

        $exam->load(['course:id,title', 'creator:id,name', 'questions']);

        $attempts = ExamAttempt::query()
            ->with('user:id,name,email')
            ->where('exam_id', $exam->id)
            ->when(! $canManage, fn ($q) => $q->where('user_id', $user->id))
            ->latest()
            ->get();

        $myAttemptsCount = $attempts->where('user_id', $user->id)->count();
        $openAttempt = $attempts->first(fn ($a) => $a->user_id === $user->id && $a->status === 'in_progress');

        return Inertia::render('Exams/Show', [
            'exam' => $exam,
            'canManage' => $canManage,
            'attempts' => $canManage ? $attempts : $attempts->where('user_id', $user->id)->values(),
            'myAttemptsCount' => $myAttemptsCount,
            'canStart' => $user->isStudent()
                && $exam->isAvailable()
                && $myAttemptsCount < $exam->max_attempts
                && ! $openAttempt
                && $exam->questions->isNotEmpty(),
            'openAttemptId' => $openAttempt?->id,
            'totalPoints' => $exam->totalPoints(),
        ]);
    }

    public function update(Request $request, Exam $exam): RedirectResponse
    {
        abort_unless($this->canManage($request->user(), $exam), 403);

        $data = $this->validatedExam($request);
        $this->assertCourseAccess($request, (int) $data['course_id']);
        $exam->update($data);

        return back()->with('success', 'تم تحديث الفحص.');
    }

    public function destroy(Request $request, Exam $exam): RedirectResponse
    {
        abort_unless($this->canManage($request->user(), $exam), 403);
        $exam->delete();

        return redirect()->route('exams.index')->with('success', 'تم حذف الفحص.');
    }

    public function storeQuestion(Request $request, Exam $exam): RedirectResponse
    {
        abort_unless($this->canManage($request->user(), $exam), 403);

        $data = $request->validate([
            'type' => ['required', 'in:single,multiple,true_false,short'],
            'prompt' => ['required', 'string'],
            'options' => ['nullable', 'array'],
            'options.*' => ['nullable', 'string', 'max:500'],
            'correct_answers' => ['nullable', 'array'],
            'correct_answers.*' => ['nullable'],
            'points' => ['nullable', 'integer', 'min:1', 'max:100'],
            'explanation' => ['nullable', 'string'],
        ]);

        $options = array_values(array_filter($data['options'] ?? [], fn ($o) => filled($o)));
        $correct = collect($data['correct_answers'] ?? [])->map(fn ($v) => (string) $v)->values()->all();

        if ($data['type'] === ExamQuestion::TYPE_TRUE_FALSE) {
            $options = ['صح', 'خطأ'];
        }

        if (in_array($data['type'], [ExamQuestion::TYPE_SINGLE, ExamQuestion::TYPE_MULTIPLE, ExamQuestion::TYPE_TRUE_FALSE], true)) {
            abort_if(count($options) < 2 && $data['type'] !== ExamQuestion::TYPE_TRUE_FALSE, 422, 'أضف خيارين على الأقل.');
            abort_if(count($correct) === 0, 422, 'حدد الإجابة الصحيحة.');
        }

        ExamQuestion::query()->create([
            'exam_id' => $exam->id,
            'type' => $data['type'],
            'prompt' => $data['prompt'],
            'options' => $data['type'] === ExamQuestion::TYPE_SHORT ? null : $options,
            'correct_answers' => $data['type'] === ExamQuestion::TYPE_SHORT ? null : $correct,
            'points' => $data['points'] ?? 1,
            'sort_order' => ($exam->questions()->max('sort_order') ?? 0) + 1,
            'explanation' => $data['explanation'] ?? null,
        ]);

        return back()->with('success', 'تمت إضافة السؤال.');
    }

    public function destroyQuestion(Request $request, Exam $exam, ExamQuestion $question): RedirectResponse
    {
        abort_unless($this->canManage($request->user(), $exam), 403);
        abort_unless($question->exam_id === $exam->id, 404);
        $question->delete();

        return back()->with('success', 'تم حذف السؤال.');
    }

    private function validatedExam(Request $request): array
    {
        return $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'lesson_id' => ['nullable', 'exists:lessons,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['nullable', 'integer', 'min:1', 'max:600'],
            'pass_percent' => ['nullable', 'integer', 'min:1', 'max:100'],
            'max_attempts' => ['nullable', 'integer', 'min:1', 'max:10'],
            'stars_reward' => ['nullable', 'integer', 'min:0', 'max:50'],
            'shuffle_questions' => ['sometimes', 'boolean'],
            'show_correct_answers' => ['sometimes', 'boolean'],
            'available_from' => ['nullable', 'date'],
            'available_until' => ['nullable', 'date', 'after_or_equal:available_from'],
            'is_published' => ['sometimes', 'boolean'],
        ]);
    }

    private function canManage($user, Exam $exam): bool
    {
        return $user->isAdmin()
            || ($user->isTeacher() && ($exam->created_by === $user->id || $exam->course?->teacher_id === $user->id || Course::query()->where('id', $exam->course_id)->where('teacher_id', $user->id)->exists()));
    }

    private function assertCourseAccess(Request $request, int $courseId): void
    {
        if ($request->user()->isAdmin()) {
            return;
        }

        abort_unless(
            Course::query()->where('id', $courseId)->where('teacher_id', $request->user()->id)->exists(),
            403
        );
    }
}
